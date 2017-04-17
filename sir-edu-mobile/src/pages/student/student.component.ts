import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SendFileModal } from './send-file-modal/send-file-modal.component'

@Component({
  selector: 'student',
  templateUrl: 'student.template.html'
})
export class StudentPage {

  student: Object; 
  image: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
    private modalCtrl: ModalController) {

    this.student = navParams.get('student') || {};
    this.image = '';
  }

  addFile() {
    let modal = this.modalCtrl.create(SendFileModal);
    modal.present();
  }

  addMedia() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.image = base64Image;
    }, (err) => {
     // Handle error
    });
  }
}