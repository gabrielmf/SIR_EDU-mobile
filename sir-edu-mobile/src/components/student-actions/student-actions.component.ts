import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
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
    public studentsService: StudentsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public viewCtrl: ViewController) {}

  ngOnInit() {
    this.student = this.navParams.get('student');
  }

  view() {
    this.goToStudentDetails('view');
  }

  edit() {
    this.goToStudentDetails('edit');
  }

  remove(student) {
    let loading = this.loadingCtrl.create({
      content: 'Salvando...'
    });

    loading.present();

    loading.onDidDismiss((msg, data) => {
      this.displayMessage(msg);
      this.viewCtrl.dismiss(data);
    });

    this.studentsService.deleteStudent(this.student._id).then((removedStudent) => {
        console.log('removed', removedStudent);
        loading.dismiss('Aluno ' + removedStudent.name + ' removido com sucesso.', removedStudent);
    }).catch(err => {
        loading.dismiss('Ocorreu algum erro. Não foi possível remover o aluno.');
    });
    
  }

  private goToStudentDetails(pageMode) {
    this.navCtrl.push(StudentDetailsPage, {
      student: this.student,
      pageMode
    });
  }

  private displayMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }
}