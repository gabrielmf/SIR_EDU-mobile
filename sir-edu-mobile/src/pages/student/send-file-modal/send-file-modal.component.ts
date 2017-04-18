import { Component } from '@angular/core';
import { ViewController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, CaptureVideoOptions, MediaFile, CaptureError } from '@ionic-native/media-capture';

@Component({
  selector: 'send-file-modal',
  templateUrl: 'send-file-modal.template.html'
})
export class SendFileModal {

  image: Object;

  constructor(
    public viewCtrl: ViewController, 
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private mediaCapture: MediaCapture) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

 takePicture() {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 800,
      targetHeight: 600, 
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: false
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.image = base64Image;
     alert(this.image);
    }, (err) => {
     // Handle error
    });
  }

  selectFromGallery() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.ALLMEDIA
    }

    this.camera.getPicture(options).then((file) => {
     alert('TODO handle file');
    }, (err) => {
     // Handle error
     alert(err);
    });
  }

  recordVideo() {
    this.mediaCapture.captureVideo().then((video: MediaFile[]) => {
      alert('gravou');
    }).catch((err: CaptureError) => {
      alert(err);
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

}