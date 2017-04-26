import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    {label: 'Deficiência Intelectual'},
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
    public studentsService: StudentsService) {
    this.student = navParams.get('student') || {};
    this.pageMode = navParams.get('pageMode') || 'add';
    this.pageTitle = 'Cadastrar aluno';
    
    if (this.pageMode !== 'add') {
      this.pageTitle = this.pageMode === 'edit' ? 'Editar aluno' : 'Dados do aluno';
    }
  }
}