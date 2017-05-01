import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from '@ionic-native/file';
import StudentsService from '../../services/students.service';

@Component({
  selector: 'student-details',
  templateUrl: 'student-details.template.html'
})
export class StudentDetails {

  student: any;
  pageMode: string;
  pageTitle: string;
  specialNeeds = [
    {label: 'Altas Habilidades/Superdotado'},
    {label: 'Deficiência Visual/Cegueira'},
    {label: 'Deficiência Física'},
    {label: 'Dislexia'},
    {label: 'Deficiência Múltipla'},
    {label: 'Síndrome de Ritt'},
    {label: 'Transtorno do Espectro Autista'},
    {label: 'Baixa Visão'},
    {label: 'Deficiência Auditiva/Surdez'},
    {label: 'Deficiência Intelecdevdactic.com/images-videos-fullscreen-ionic/tual'},
    {label: 'Transtorno de Oposição e desafio(TOD)'},
    {label: 'Síndrome de Down'},
    {label: 'Surdocegueira'},
    {label: 'Síndrome do X frágil'},
    {label: 'Transtornos psicóticos agudos e transitórios'},
    {label: 'Transtorno de conduta'}
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public studentsService: StudentsService,
    private camera: Camera,
    private file: File,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
    this.student = navParams.get('student') || { specialNeeds: [] };
    this.pageMode = navParams.get('pageMode') || 'add';
    this.pageTitle = 'Cadastrar aluno';
    
    if (this.pageMode !== 'add') {
      this.pageTitle = this.pageMode === 'edit' ? 'Editar aluno' : 'Dados do aluno';
    }
  }

  choosePicture(prop: string) {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.ALLMEDIA
    }
    this.camera.getPicture(options).then(fileUri => {
        this.file.resolveLocalFilesystemUrl('file://'+fileUri).then((fileEntry: FileEntry) => {
              fileEntry.file((file: any) => {
                    const reader = new FileReader();
                    reader.onloadend = (fileReadResult: any) => {
                      let data = new Uint8Array(fileReadResult.target.result);
                      let blob = new Blob([data], { type: file.type });
                      this.student[prop] = { file: blob, path: fileEntry.toURL(), filename: fileEntry.name };
                  };
                    reader.readAsArrayBuffer(file);
              })
          }).catch(err => { console.log(err)});
        }).catch(err => { console.log(err)});
  }

  updateSpecialNeeds(value) {
      let newSelectionArray;
      
      if(this.student.specialNeeds && this.student.specialNeeds.indexOf(value) > -1) {
          newSelectionArray = this.student.specialNeeds.filter(s => s !== value)
      } else {
          newSelectionArray = [...this.student.specialNeeds || '', value];
      }

      this.student.specialNeeds = newSelectionArray;
  }

  onSubmit() {
    let formData = new FormData();

    let loading = this.loadingCtrl.create({
      content: 'Salvando...'
    });

    loading.present();

    loading.onDidDismiss((msg, data) => {
      this.displayMessage(msg);
    });
    
    Object.keys(this.student).forEach((key) => {
        if(typeof this.student[key] === 'object' && this.student[key].file) {
          formData.append(key, this.student[key].file, this.student[key].filename);
        }
        else {
          formData.append(key, this.student[key]);
        }
    });
    
    this.studentsService.saveStudent(formData).then((res) => {
        loading.dismiss('Aluno salvo com sucesso.');
    }).catch((err) => {
        loading.dismiss('Ocorreu algum erro. Não foi possível salvar o aluno.');
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