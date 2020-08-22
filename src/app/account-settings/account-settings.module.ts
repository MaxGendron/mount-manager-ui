import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../modules/shared.module';
import { AccountSettingsComponent } from './account-settings.component';
import { AcountSettingsService } from './acount-settings.service';

@NgModule({
  declarations: [AccountSettingsComponent],
  imports: [CommonModule, SharedModule],
  providers: [AcountSettingsService],
})
export class AccountSettingsModule {}
