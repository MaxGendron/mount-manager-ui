import { SearchMountDto } from './../models/dtos/search-mount.dto';
import { MountSortFieldEnum } from './../models/enum/mount-sort-field.enum';
import { SortOrderEnum } from './../../common/enum/sort-order.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MountGenderCountResponseDto } from './../models/dtos/responses/mount-gender-count.response.dto';
import { MountGenderEnum } from './../models/enum/mount-gender.enum';
import { MountsService } from './../mounts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MountResponseDto } from '../models/dtos/responses/mounts.response.dto';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddOrUpdateMountPopupComponent } from '../add-or-update-mount-popup/add-or-update-mount-popup.component';
import Swal from 'sweetalert2/src/sweetalert2.js';
import {
  MountColorDto,
  MountColorGroupedByResponseDto,
} from '../mount-colors/models/dtos/responses/mount-color-grouped-by.response.dto';
import { MountColorsService } from '../mount-colors/mount-colors.service';
import { AccountsSettingsService } from 'src/app/my-account/accounts-settings/accounts-settings.service';

@Component({
  selector: 'app-my-mounts',
  templateUrl: './my-mounts.component.html',
  styleUrls: ['./my-mounts.component.scss'],
})
export class MyMountsComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  currentLang: string;
  loading = false;
  error: string;
  keys = Object.keys;

  filtersForm: FormGroup;
  types: string[];

  mountGenderEnum = MountGenderEnum;
  mountSortFieldEnum = MountSortFieldEnum;
  sortOrderEnum = SortOrderEnum;

  mounts: MountResponseDto[] = new Array();
  currentColors: MountColorDto[];
  mountGenderCounts: MountGenderCountResponseDto[];
  groupedColorDtos: MountColorGroupedByResponseDto[];

  constructor(
    private translateService: TranslateService,
    private mountsService: MountsService,
    private mountColorsService: MountColorsService,
    private accountsSettingsService: AccountsSettingsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.currentLang = translateService.currentLang;
    translateService.onLangChange.subscribe((e: LangChangeEvent) => (this.currentLang = e.lang));

    //Initialize the accountSettings form
    this.filtersForm = this.fb.group({
      name: [''],
      gender: [''],
      type: [''],
      colorId: [''],
      sortField: [MountSortFieldEnum.Name],
      sortOrder: [SortOrderEnum.Asc],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.mounts = await this.mountsService.getMountForUserId().toPromise();
      this.groupedColorDtos = await this.mountColorsService.getMountColorsGroupedByMountType().toPromise();
      this.types = (await this.accountsSettingsService.getAccountSettingByUserId().toPromise())?.mountTypes;
    } catch (e) {
      this.error = this.translateService.instant('error.unexpected');
    }
    this.setMountGenderCounts();

    //Listen on value changes on type to reset value of color and reset currentColors
    this.filtersForm.get('type').valueChanges.subscribe(type => {
      this.filtersForm.get('colorId').setValue('');
      this.setCurrentColors(type);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isDisabled(): boolean {
    return this.loading;
  }

  openPopup(mount?: MountResponseDto): void {
    //open popup for add or edit
    const dialogRef = this.dialog.open(AddOrUpdateMountPopupComponent, {
      id: 'mount-popup',
      width: '600px',
      data: {
        mount: mount,
        colors: this.groupedColorDtos,
        types: this.types,
      },
      autoFocus: false,
    });

    this.listenOnPopupClose(dialogRef);
  }

  listenOnPopupClose(dialogRef: MatDialogRef<AddOrUpdateMountPopupComponent>): void {
    dialogRef.afterClosed().subscribe((mountResponse: MountResponseDto) => {
      if (mountResponse) {
        let index = this.mounts.findIndex(m => m._id === mountResponse._id);
        //If mount exist, update it otherwise append it.
        //It will always append at the end even if the user has filters, that's the desired behavior. (when creating)
        if (index != -1) {
          this.mounts[index] = mountResponse;
        } else {
          this.mounts.push(mountResponse);
        }
        //Refresh stats
        this.setMountGenderCounts();
      }
    });
  }

  confirmDelete(mountId: string): void {
    Swal.fire({
      title: this.translateService.instant('myMounts.deleteConfirmation'),
      showDenyButton: true,
      confirmButtonText: this.translateService.instant('button.delete'),
      denyButtonText: this.translateService.instant('button.dontDelete'),
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteMount(mountId);
      }
    });
  }

  deleteMount(mountId: string): void {
    this.subscription.add(
      this.mountsService.deleteMount(mountId).subscribe(
        () => {
          //Remove mount from the lists
          this.mounts = this.mounts.filter(m => m._id !== mountId);
          //Refresh stats
          this.setMountGenderCounts();
        },
        () => {
          this.error = this.translateService.instant('error.unexpected');
        },
      ),
    );
  }

  submit() {
    this.loading = true;
    const filtersFormValue = this.filtersForm.value;
    let searchMountDto = new SearchMountDto();

    if (filtersFormValue.name) {
      searchMountDto.name = filtersFormValue.name;
    }
    if (filtersFormValue.gender) {
      searchMountDto.gender = filtersFormValue.gender;
    }
    if (filtersFormValue.type) {
      searchMountDto.type = filtersFormValue.type;
    }
    if (filtersFormValue.colorId) {
      searchMountDto.colorId = filtersFormValue.colorId;
    }
    if (filtersFormValue.sortField) {
      searchMountDto.sortField = filtersFormValue.sortField;
    }
    if (filtersFormValue.sortOrder) {
      searchMountDto.sortOrder = filtersFormValue.sortOrder;
    }

    this.subscription.add(
      this.mountsService.getMountForUserId(searchMountDto).subscribe(
        mounts => {
          this.mounts = mounts;
          this.loading = false;
        },
        () => {
          this.error = this.translateService.instant('error.unexpected');
          this.loading = false;
        },
      ),
    );
  }

  private async setMountGenderCounts() {
    try {
      this.mountGenderCounts = await this.mountsService.genderCountByTypeForUserId().toPromise();
    } catch (e) {
      this.error = this.translateService.instant('error.unexpected');
    }
  }

  private setCurrentColors(type: string): void {
    this.currentColors = this.groupedColorDtos.find(c => c.type === type).colors;
  }
}
