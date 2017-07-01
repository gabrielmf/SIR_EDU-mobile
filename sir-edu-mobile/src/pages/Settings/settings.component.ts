import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import AuthService from '../../services/auth.service'
import LoginPage from '../login';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'settings.template.html',
  providers: [ AuthService ]
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public authService: AuthService, public toastCtrl: ToastController) {
  }

  showToastWithCloseButton() {
    const toast = this.toastCtrl.create({
      message: 'Você saiu da aplicação com sucesso.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }


  logout() {
      this.authService.logout();
      this.navCtrl.setRoot(LoginPage);
  }

}