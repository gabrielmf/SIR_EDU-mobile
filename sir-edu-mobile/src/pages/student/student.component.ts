import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SendFileModal } from './send-file-modal/send-file-modal.component'

@Component({
  selector: 'student',
  templateUrl: 'student.template.html'
})
export class StudentPage {

  student: Object; 
  image: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
    this.student = navParams.get('student') || {};
    this.image = '';
  }

  addFile() {
    let modal = this.modalCtrl.create(SendFileModal);
    modal.present();
  }
}