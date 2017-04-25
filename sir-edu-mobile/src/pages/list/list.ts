import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import StudentPage from '../student';
import StudentActions from '../../components/student-actions';
import StudentsService from '../../services/students.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  selectedItem: any;
  students: Array<Object>;

  constructor(
    private navCtrl: NavController,
    private studentsService: StudentsService,
    private popoverCtrl: PopoverController) {
      this.students = [];
  }

  ngOnInit() {
    console.log('aqui');
    this.studentsService.getStudentList().then(
      list => { console.log('list', list); this.students = list }
    ).catch(
      error => { console.log(error) }
    );
  }

  goToStudentPage(student) {
    this.navCtrl.push(StudentPage, {
      student: student
    });
  }

  showStudentPopover(ev, student) {
    let popoverItem = this.popoverCtrl.create(StudentActions, { student }, {
      cssClass: 'student-actions-content'
    });
    
    popoverItem.present({ ev });
  }
}
