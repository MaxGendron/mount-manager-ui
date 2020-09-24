import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/modules/shared.module';
import { MyMountsComponent } from './my-mounts/my-mounts.component'

@NgModule({
  declarations: [MyMountsComponent],
  imports: [CommonModule, SharedModule],
  providers: [],
})
export class MountsModule {}
