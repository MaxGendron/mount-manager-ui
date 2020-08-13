import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { RegisterPopupComponent } from './register-popup/register-popup.component';
import { SharedModule } from '../modules/shared.module';

@NgModule({
  declarations: [
    LoginDialogComponent,
    RegisterPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    LoginDialogComponent,
    RegisterPopupComponent
  ],
  providers: [UserService]
})
export class UsersModule { }
