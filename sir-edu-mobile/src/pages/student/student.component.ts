import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SendFileModal } from './send-file-modal/send-file-modal.component';
import FilesService from '../../services/files.service';

@Component({
  selector: 'student',
  templateUrl: 'student.template.html'
})
export class StudentPage {

  student: any;
  files: Array<Object>;
  image: String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private modalCtrl: ModalController,
    private fileService: FilesService) {

    this.student = navParams.get('student') || {};
    this.image = '';
  }

  ngOnInit() {
    this.fileService.getFilesList(this.student._id).then((files) => {
      this.files = files.map((file) => {
        return {
          id: file._id,
          url: file.url,
          mimeType: file.contentType,
          date: file.metadata.date,
          comment: file.metadata.comment
        };
      });
      console.log(this.files);
    }).catch((err) => {
      console.log(err);
    });
  }

  addFile() {
    let modal = this.modalCtrl.create(SendFileModal, { studentId: this.student._id });
    modal.present();
  }
}