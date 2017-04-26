import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import StudentsService from '../../services/students.service';
import StudentDetailsPage from '../../pages/student-details';

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
    this.navCtrl.push(StudentDetailsPage, {
      student: this.student,
      pageMode: 'view'
    });
  }

  edit() {
    this.navCtrl.push(StudentDetailsPage, {
      student: this.student,
      pageMode: 'edit'
    });
  }

  remove(student) {
    this.studentsService.deleteStudent(this.student._id);
  }
}