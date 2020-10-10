import { UpdateMountDto } from './../models/dtos/update-mount.dto';
import { MountsService } from './../mounts.service';
import { CreateMountDto } from './../models/dtos/create-mount.dto';
import { ColorLocalize } from './../mount-colors/models/color-localize';
import { MountColorsService } from './../mount-colors/mount-colors.service';
import { AccountsSettingsService } from './../../my-account/accounts-settings/accounts-settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MountResponseDto } from '../models/dtos/responses/mounts.response.dto';
import { MountGenderEnum } from '../models/enum/mount-gender.enum';
import { MountColorGroupedByResponseDto } from '../mount-colors/models/dtos/responses/mount-color-grouped-by.response.dto';

@Component({
  selector: 'app-add-or-update-mount-popup',
  templateUrl: './add-or-update-mount-popup.component.html',
  styleUrls: ['./add-or-update-mount-popup.component.scss']
})
export class AddOrUpdateMountPopupComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  error: string;
  loading = false;
  title: string;
  buttonText: string;
  mountForm: FormGroup;
  currentLang: string;
  baseMount: MountResponseDto;
  types: string[];
  groupedColorDtos: MountColorGroupedByResponseDto[];
  currentColors: ColorLocalize[];
  genders = MountGenderEnum;
  keys = Object.keys;
  
  constructor(
    private translateService: TranslateService,
    private mountsService: MountsService,
    private accountsSettingsService: AccountsSettingsService,
    private mountColorsService: MountColorsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddOrUpdateMountPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.currentLang = translateService.currentLang;
    translateService.onLangChange.subscribe((e : LangChangeEvent) => this.currentLang = e.lang);

    if (data.mount) {
      this.baseMount = data.mount;
      this.title = translateService.instant('addOrUpdateMount.titleUpdate', {name: data.mount.name});
      this.buttonText = translateService.instant('button.edit');
    } else {
      this.title = translateService.instant('addOrUpdateMount.titleCreate');
      this.buttonText = translateService.instant('button.create');
    }

    this.mountForm = this.fb.group({
      name: [data.mount?.name, Validators.required],
      gender: [data.mount?.gender, Validators.required],
      type: [data.mount?.type, Validators.required],
      color: [data.mount?.color[this.currentLang], Validators.required],
    });
  }

  isDisabled(): boolean {
    return !this.mountForm.valid || this.loading;
  }

  async ngOnInit(): Promise<void> {
    this.types = (await this.accountsSettingsService.getAccountSettingByUserId().toPromise()).mountTypes;
    this.groupedColorDtos = await this.mountColorsService.getMountColorsGroupedByMountType().toPromise();

    const type = this.mountForm.get('type').value;
    if (type) {
      this.setCurrentColors(type);
    }

    //Listen on value changes to reset error message
    this.mountForm.valueChanges.subscribe(() => {
      this.error = "";
    });

    //Listen on value changes on type to reset value of color and reset currentColors
    this.mountForm.get('type').valueChanges.subscribe(type => {
      this.mountForm.get('color').setValue('');
      this.setCurrentColors(type);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit(): void {
    this.loading = true;
    const baseMount = this.baseMount;
    const mountFormValue = this.mountForm.value;
    //Find colorId based on color value
    const colorId = this.groupedColorDtos.find(c => c.type === mountFormValue.type).colors
      .find(c => c.color[this.currentLang] === mountFormValue.color)._id;

    //if baseMount => update, otherwise create
    if (baseMount) {
      const baseMountColorId = this.groupedColorDtos.find(c => c.type === baseMount.type).colors
        .find(c => c.color[this.currentLang] === baseMount.color[this.currentLang])._id;
      const updateMountDto = new UpdateMountDto();
      //Only set field if they have been updated
      updateMountDto.name = mountFormValue.name === baseMount.name ? null : mountFormValue.name;
      updateMountDto.gender = mountFormValue.gender === baseMount.gender ? null : mountFormValue.gender;
      updateMountDto.colorId = colorId === baseMountColorId ? null : colorId;
      
      //Only send update if something is updated
      if (updateMountDto.name || updateMountDto.gender || updateMountDto.colorId) {
        this.subscription.add(this.mountsService.updateMount(updateMountDto, baseMount._id).subscribe(mount => {
          this.handleCreateOrUpdate(mount);
          }, () => {
          this.handleError();
        }))
      } else {
        //Close the dialog otherwise
        this.dialogRef.close();
      }
    } else {
      const createMountDto = new CreateMountDto();
      createMountDto.name = mountFormValue.name;
      createMountDto.gender = mountFormValue.gender;
      createMountDto.colorId = colorId;
      this.subscription.add(this.mountsService.createMount(createMountDto).subscribe(mount => {
        this.handleCreateOrUpdate(mount);
      }, () => {
        this.handleError();
      }))
    }
  }

  private handleCreateOrUpdate(mount: MountResponseDto) {
    this.loading = false;
    this.dialogRef.close(mount);
  }

  private handleError() {
    this.error = this.translateService.instant('error.unexpected');
    this.loading = false;
  }

  private setCurrentColors(type: string): void {
    this.currentColors = this.groupedColorDtos.find(c => c.type === type).colors.map(c => c.color);
  }
}
