import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/modules/shared.module';
import { MyAccountComponent } from './my-account.component';
import { AccountSettingsService } from './accounts-settings/accounts-settings.service';
import { ServerService } from './servers/server.service';

@NgModule({
  declarations: [MyAccountComponent],
  imports: [CommonModule, SharedModule],
  providers: [AccountSettingsService, ServerService],
})
export class MyAccountModule {}
