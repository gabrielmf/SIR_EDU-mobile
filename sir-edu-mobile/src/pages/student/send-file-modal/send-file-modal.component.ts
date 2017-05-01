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
    src: String,
    mimeType: String,
    type: String
  };
  hasMedia: Boolean;
  studentId: String;
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

    if (this.file) {
      console.log('file', this.file);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
         role: 'destructive',
         handler: () => {
           this.recordVideo();
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

    let body = { ...form.value, studentId: this.studentId };
    
    this.filesService.uploadFile(this.media, body).then((data) => {
        loading.dismiss('Arquivo salvo com sucesso.', data);
    }).catch((err) => {
        loading.dismiss('Ocorreu algum erro, não foi possível salvar o arquivo.');
    });
 }

}