import { MountGenderEnum } from './../models/enum/mount-gender.enum';
import { MountsService } from './../mounts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MountResponseDto } from '../models/dtos/responses/mounts.response.dto';

@Component({
  selector: 'app-my-mounts',
  templateUrl: './my-mounts.component.html',
  styleUrls: ['./my-mounts.component.scss'],
})
export class MyMountsComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  currentLang: string;
  error: string;
  mounts: MountResponseDto[] = new Array();
  mountGenderEnum = MountGenderEnum;
  
  constructor(
    private translateService: TranslateService,
    private mountsService: MountsService
  ) {
    this.currentLang = translateService.currentLang;
    translateService.onLangChange.subscribe((e : LangChangeEvent) => this.currentLang = e.lang)
  }

  async ngOnInit(): Promise<void> {
    this.mounts = await this.mountsService.getMountForUserId().toPromise();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editMount(mountId: string): void {
    //open popup for edit
  }

  addMount(): void {
    //open popup for add
  }

  deleteMount(mountId: string): void {
    this.subscription.add(this.mountsService.deleteMount(mountId).subscribe(() => {
      //Remove mount from the lists
      this.mounts = this.mounts.filter(m => m._id !== mountId);
    }, () => {
      this.error = this.translateService.instant('error.unexpected');
    }));
  }
}
