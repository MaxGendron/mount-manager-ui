import { BulkAddComponent } from './bulk-add/bulk-add.component';
import { CouplingsService } from './couplings/couplings.service';
import { AddOrUpdateMountPopupComponent } from './add-or-update-mount-popup/add-or-update-mount-popup.component';
import { MountColorsService } from './mount-colors/mount-colors.service';
import { MountsService } from './mounts.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/modules/shared.module';
import { MyMountsComponent } from './my-mounts/my-mounts.component';

@NgModule({
  declarations: [MyMountsComponent, AddOrUpdateMountPopupComponent, BulkAddComponent],
  imports: [CommonModule, SharedModule],
  providers: [MountsService, MountColorsService, CouplingsService],
})
export class MountsModule {}
