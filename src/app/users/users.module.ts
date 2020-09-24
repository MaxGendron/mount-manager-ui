import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './users.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { RegisterPopupComponent } from './register-popup/register-popup.component';
import { SharedModule } from '../common/modules/shared.module';

@NgModule({
  declarations: [LoginDialogComponent, RegisterPopupComponent],
  imports: [CommonModule, SharedModule],
  providers: [UsersService],
})
export class UsersModule {}
