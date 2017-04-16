import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import AuthService from '../../services/auth.service'
import { ListPage } from '../list/list';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.template.html',
  providers: [ AuthService ]
})
export class LoginPage {

  loginForm: Object;
  error: Boolean;

  constructor(public navCtrl: NavController, public authService: AuthService, public toastCtrl: ToastController) {
    this.loginForm = {};
    this.error = false;
  }

  showToastWithCloseButton() {
    const toast = this.toastCtrl.create({
      message: 'Email incorreto ou o usuário não foi encontrado.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }


  onSubmit(form) {
      if(!form.form.valid) {
          return;
      }
      this.authService.login(this.loginForm).then(data => {
        this.navCtrl.setRoot(ListPage);
      }, error => { this.showToastWithCloseButton(); });
  }

}