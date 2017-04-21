import { Component, NgZone } from '@angular/core';
import { ViewController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, CaptureVideoOptions, MediaFile, CaptureError } from '@ionic-native/media-capture';
import { File, FileEntry, Entry } from '@ionic-native/file';

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
  date: String;
  hasMedia: Boolean;

  constructor(
    private ngZone: NgZone,
    public viewCtrl: ViewController, 
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private mediaCapture: MediaCapture,
    private fileCordova: File ) {
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
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.media = {
       src: base64Image,
       mimeType: null,
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
      this.fileCordova.resolveLocalFilesystemUrl('file://'+fileUri).then((f: FileEntry)=>{
        f.file((resolvedFile: any) => {
          this.ngZone.run(() => {
            this.media = {
              src: f.toURL(),
              mimeType: resolvedFile.type,
              type: typeof resolvedFile.type === 'string' ? resolvedFile.type.split('/')[0] : null
            }
          });
        });
      }).catch((err)=>{
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

 uploadFile() {
   alert('TODO upload');
 }

}