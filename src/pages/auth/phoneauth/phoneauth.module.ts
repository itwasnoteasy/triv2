import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneAuthPage } from './phoneauth';

@NgModule({
  declarations: [
    PhoneAuthPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneAuthPage),
  ],
  exports: [
    PhoneAuthPage
  ]
})
export class PhoneAuthPageModule {}