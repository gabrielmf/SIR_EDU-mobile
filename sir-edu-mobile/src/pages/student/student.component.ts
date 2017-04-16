import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'student',
  templateUrl: 'student.template.html'
})
export class StudentPage {

  student: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.student = navParams.get('student') || {};
  }

}
