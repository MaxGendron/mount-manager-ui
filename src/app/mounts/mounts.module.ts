import { MountColorsService } from './mount-colors/mount-colors.service';
import { MountsService } from './mounts.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/modules/shared.module';
import { MyMountsComponent } from './my-mounts/my-mounts.component';

@NgModule({
  declarations: [MyMountsComponent],
  imports: [CommonModule, SharedModule],
  providers: [MountsService, MountColorsService],
})
export class MountsModule {}
