import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import StudentPage from '../student';
import StudentsService from '../../services/students.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  selectedItem: any;
  students: Array<Object>;

  constructor(public navCtrl: NavController, public studentsService: StudentsService) {
      this.students = [];
  }

  ngOnInit() {
    this.studentsService.getStudentList().then(
      list => { console.log('list', list); this.students = list }
    ).catch(
      error => { console.log(error) }
    );
  }

  itemTapped(event, student) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(StudentPage, {
      student: student
    });
  }
}
