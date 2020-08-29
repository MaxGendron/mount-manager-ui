import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../modules/shared.module';
import { MyAccountComponent } from './my-account.component';
import { AccountSettingsService } from './account-settings/account-settings.service';

@NgModule({
  declarations: [MyAccountComponent],
  imports: [CommonModule, SharedModule],
  providers: [AccountSettingsService],
})
export class MyAccountModule {}
