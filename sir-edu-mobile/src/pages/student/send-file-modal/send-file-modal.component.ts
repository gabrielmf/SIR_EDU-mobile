import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'send-file-modal',
  templateUrl: 'send-file-modal.template.html'
})
export class SendFileModal {
  constructor(public viewCtrl: ViewController) {
    console.log('alright')
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}