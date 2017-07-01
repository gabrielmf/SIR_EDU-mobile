import { Component, NgZone } from '@angular/core';
import { NavParams, ViewController, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, CaptureVideoOptions, MediaFile, CaptureError } from '@ionic-native/media-capture';
import { File, FileEntry } from '@ionic-native/file';
import FilesService from '../../../services/files.service';

@Component({
  selector: 'send-file-modal',
  templateUrl: 'send-file-modal.template.html'
})
export class SendFileModal {
  media: { 
    src: string,
    mimeType: string,
    type: string
  };
  hasMedia: boolean;
  studentId: string;
  keyword: string;
  file: any;

  constructor(
    private params: NavParams,
    private ngZone: NgZone,
    public viewCtrl: ViewController, 
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private mediaCapture: MediaCapture,
    private fileCordova: File,
    private filesService: FilesService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
    
    this.studentId = this.params.get('studentId');
    this.file = this.params.get('file') || null;
    this.hasMedia = false;
    
    if (this.file) {
      this.media = {
        src: this.file.url,
        type: this.file.type,
        mimeType: this.file.mimeType
      };

      this.hasMedia = true;
    } else {
      this.file = {};
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addKeyword() {
    let keyword = this.keyword.toLowerCase().trim();
    
    if (keyword === '') {
      return;
    }

    if (this.file.keywords && this.file.keywords.length) {
      this.file['keywords'].push(keyword);
    } else {
      this.file['keywords'] = [ keyword ];
    }

    this.keyword = '';
  }

  removeKeyword(index) {
    this.file.keywords.splice(index, 1);
  }

 takePicture() {
    const options: CameraOptions = {
      quality: 70,
      targetWidth: 800,
      targetHeight: 600,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
    }

    this.camera.getPicture(options).then((image) => {
        this.media = {
          src: image,
          mimeType: 'image/jpeg',
          type: 'image'
        };
     
        this.hasMedia = true;
    }, (err) => {
        console.log(err);
    });
  }

  selectFromGallery() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.ALLMEDIA
    }

    this.camera.getPicture(options).then((fileUri) => {
      this.fileCordova.resolveLocalFilesystemUrl('file://'+fileUri).then((f: FileEntry) => {
        f.file((resolvedFile: any) => {
            this.ngZone.run(() => {
                this.media = {
                  src: f.toURL(),
                  mimeType: resolvedFile.type,
                  type: typeof resolvedFile.type === 'string' ? resolvedFile.type.split('/')[0] : null
                }
            });
        });
      }).catch((err) => {
        console.log(err)
      });
      this.hasMedia = true;
    }, (err) => {
     // Handle error
     alert(err);
    });
  }

  recordVideo() {
    this.mediaCapture.captureVideo().then((videos: MediaFile[]) => {
      let video = videos[0];
      
      this.ngZone.run(() => {
        this.media = {
          src: video.fullPath,
          mimeType: video.type,
          type: 'video'
        };
      });

      this.hasMedia = true;
    }).catch((err: CaptureError) => {
      console.log(err);
    })
  }

  recordAudio() {
    this.mediaCapture.captureAudio().then((audios: MediaFile[]) => {
      let audio = audios[0];
      
      this.ngZone.run(() => {
        this.media = {
          src: audio.fullPath,
          mimeType: audio.type,
          type: 'audio'
        };
      });

      this.hasMedia = true;
    }).catch((err: CaptureError) => {
      console.log(err);
    })
  }

  cameraActions() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Opções de envio',
     buttons: [
       {
         text: 'Tirar foto',
         icon: 'camera',
         handler: () => {
           this.takePicture();
         }
       },
       {
         text: 'Gravar vídeo',
         icon: 'videocam',
         handler: () => {
           this.recordVideo();
         }
       },
       {
         text: 'Gravar áudio',
         icon: 'mic',
         handler: () => {
           this.recordAudio();
         }
       },
       {
         text: 'Escolher da galeria',
         icon: 'image',
         handler: () => {
           this.selectFromGallery();
         }
       },
       {
         text: 'Cancelar',
         icon: 'close',
         role: 'cancel'
       }
     ]
   });

   actionSheet.present();
 }

 removeFile() {
   this.media = null;
   this.hasMedia = false;
 }

 private displayMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
 }

 uploadFile(form) {
    if(form.invalid) {
      return;
    }
    
    let loading = this.loadingCtrl.create({
      content: 'Enviando arquivo...'
    });

    loading.present();

    loading.onDidDismiss((msg, data) => {
      this.viewCtrl.dismiss(data);
      this.displayMessage(msg);
    });

    let body = { ...this.file, studentId: this.studentId };

    //Temporary, this is necessary because http cordova was failling, need to identify the root cause
    if (body.keywords && body.keywords.length) {
      body.keywords = body.keywords.toString();
    }
    
    this.filesService.uploadFile(this.media, body).then((data) => {
        loading.dismiss('Arquivo salvo com sucesso.', data);
    }).catch((err) => {
        loading.dismiss('Ocorreu algum erro, não foi possível salvar o arquivo.');
    });
 }

}