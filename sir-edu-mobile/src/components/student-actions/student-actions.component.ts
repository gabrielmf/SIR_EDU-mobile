import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import StudentsService from '../../services/students.service';

@Component({
  selector: 'student-actions',
  templateUrl: 'student-actions.template.html'
})
export class StudentActions {

  student: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public studentsService: StudentsService
    ) {}

  ngOnInit() {
    this.student = this.navParams.get('student');
  }

  view() {
    console.log('TODO view');
  }

  edit() {
    console.log('TODO edit');
  }

  remove() {
    this.studentsService.deleteStudent(this.student._id);
  }
}