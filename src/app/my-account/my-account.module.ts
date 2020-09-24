import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/modules/shared.module';
import { MyAccountComponent } from './my-account.component';
import { AccountsSettingsService } from './accounts-settings/accounts-settings.service';
import { ServersService } from './servers/servers.service';

@NgModule({
  declarations: [MyAccountComponent],
  imports: [CommonModule, SharedModule],
  providers: [AccountsSettingsService, ServersService],
})
export class MyAccountModule {}
