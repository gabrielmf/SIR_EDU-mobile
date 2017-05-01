import { Component, OnInit, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, ModalController, PopoverController, ViewController } from 'ionic-angular';
import { SendFileModal } from './send-file-modal/send-file-modal.component';
import FilesService from '../../services/files.service';

@Component({
  selector: 'student',
  templateUrl: 'student.template.html'
})
export class StudentPage {

  @ViewChild(Content) content: Content;
  student: any;
  files: Array<Object>;
  image: String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private modalCtrl: ModalController,
    private fileService: FilesService,
    private popoverCtrl: PopoverController) {

    this.student = navParams.get('student') || {};
    this.files = [];
    this.image = '';
  }

  ngOnInit() {
    this.fileService.getFilesList(this.student._id).then((files) => {
      this.files = files.map((file) => {
        return {
          id: file._id,
          url: file.url,
          type: file.contentType.split('/')[0],
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
    let params =  { studentId: this.student._id };
    this.createModal(params);
  }

  showOptions(ev, file) {
    let popoverItem = this.popoverCtrl.create(FileActions, { 
        file,
        options: { 
          remove: this.removeFile.bind(this),
          edit: this.editFile.bind(this)
        }
      });
    
    popoverItem.present({ ev });    
  }

  private createModal(params) {
    let modal = this.modalCtrl.create(SendFileModal, params);
    modal.present();

    modal.onDidDismiss((data) => {
      if (data) { 
        this.ngOnInit();
        this.content.scrollToTop();
      }
    })
  }

  private removeFile(file) {
    console.log(this.files);
    this.fileService.removeFile(file.id).then((res) => {
        console.log('removed', res);
        let index = this.files.indexOf(file);
        if ( index > -1) {
          this.files.splice(index);
        }
        console.log(this.files);
    }).catch(err => { console.log(err); });
  }

  private editFile(file) {
      let params = { studentId: this.student._id, file };
      this.createModal(params);
  }

}

@Component({
  template: 
    `<ion-list>
        <button ion-item (click)="edit()">
            Editar
            <ion-icon name="create" item-right></ion-icon>
        </button>
        <button ion-item (click)="remove()">
            Remover
            <ion-icon name="close" item-right></ion-icon>
        </button>
    </ion-list>`
})
export class FileActions {

  options: any;
  file: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    ) {}

  ngOnInit() {
    this.file = this.navParams.get('file') || null;
    this.options = this.navParams.get('options') || null;
  }

  edit() {
    this.options.edit(this.file);
    this.viewCtrl.dismiss();
  }

  remove() {
    this.options.remove(this.file);
    this.viewCtrl.dismiss();
  }
}