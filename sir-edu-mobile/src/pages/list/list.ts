import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController } from 'ionic-angular';
import { StudentPage } from '../student';
import StudentActions from '../../components/student-actions';
import StudentsService from '../../services/students.service';
import StudentDetailsPage from '../student-details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  selectedItem: any;
  studentList: Array<Object>;
  students: Array<Object>;

  constructor(
    private navCtrl: NavController,
    private studentsService: StudentsService,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController) {
      this.students = [];
      this.studentList = [];
  }

  ngOnInit() {
    this.studentsService.getStudentList().then(
      list => { 
        this.studentList = list;
        this.students = list;
        console.log(this.students);
       }
    ).catch(
      error => { console.log(error) }
    );
  }

  searchStudent(evt) {
    let val = evt.target.value.toLowerCase().trim();

    if (this.studentList.length) {
      this.students = this.studentList.filter((student: any) => {
          if (student && student.name) return student.name.toLowerCase().includes(val);
      });
    }
  }

  goToStudentPage(student) {
    this.navCtrl.push(StudentPage, {
      student: student
    });
  }

  showStudentPopover(ev, student) {
    ev.stopPropagation();
    let popoverItem = this.popoverCtrl.create(StudentActions, { student }, {
      cssClass: 'student-actions-content'
    });
    
    popoverItem.present({ ev });

    popoverItem.onDidDismiss((data) => {
        if (data) {
            this.ngOnInit();
        }
    });
  }

  addStudent() {
    this.navCtrl.push(StudentDetailsPage, {
      pageMode: 'add'
    });
  }
}
