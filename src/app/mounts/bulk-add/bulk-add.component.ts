import { CreateMountsDto } from './../models/dtos/create-mounts.dto';
import { MountColorsService } from './../mount-colors/mount-colors.service';
import { AccountsSettingsService } from 'src/app/my-account/accounts-settings/accounts-settings.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MountsService } from './../mounts.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MountGenderEnum } from '../models/enum/mount-gender.enum';
import {
  MountColorDto,
  MountColorGroupedByResponseDto,
} from '../mount-colors/models/dtos/responses/mount-color-grouped-by.response.dto';
import { CreateMountDto } from '../models/dtos/create-mount.dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-bulk-add',
  templateUrl: './bulk-add.component.html',
  styleUrls: ['./bulk-add.component.scss'],
})
export class BulkAddComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: Subscription = new Subscription();
  currentLang: string;
  loading: boolean;
  error: string;
  keys = Object.keys;
  globalError: string;

  mounts = new FormArray([]);
  types: string[];

  groupedColorDtos: MountColorGroupedByResponseDto[];
  genders = MountGenderEnum;
  currentColors: MountColorDto[][] = [];
  maxNumberOfChildForMountType: number[] = [];
  minNumberOfChildForMountType: number[] = [];

  constructor(
    private translateService: TranslateService,
    private mountsService: MountsService,
    private accountsSettingsService: AccountsSettingsService,
    private mountColorsService: MountColorsService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.currentLang = translateService.currentLang;
    translateService.onLangChange.subscribe((e: LangChangeEvent) => (this.currentLang = e.lang));

    //Listen on value changes to reset error message
    this.mounts.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  ngOnInit(): void {
    //Add some items to the array
    this.initializeMountsArray();
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      this.types = (await this.accountsSettingsService.getAccountSettingByUserId().toPromise()).mountTypes;
      this.groupedColorDtos = await this.mountColorsService.getMountColorsGroupedByMountType().toPromise();
    } catch (e) {
      this.globalError = this.translateService.instant('error.unexpectedPleaseRefresh');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isDisabled(): boolean {
    return this.mounts.controls.length === -1 || !this.mounts.valid || this.loading;
  }

  //Add a new FormGroup to the FormArray
  addItemToFormArray(): void {
    const index = this.mounts.length;
    const mountForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      typeGroup: this.fb.group({
        type: ['', Validators.required],
        index: index,
      }),
      colorId: ['', Validators.required],
      maxNumberOfChild: [
        '',
        Validators.compose([
          Validators.required,
          (control: AbstractControl) => Validators.max(this.maxNumberOfChildForMountType[index])(control),
          (control: AbstractControl) => Validators.min(this.minNumberOfChildForMountType[index])(control),
        ]),
      ],
    });

    mountForm.get('typeGroup').valueChanges.subscribe(data => {
      const type = data['type'];
      const index = data['index'];
      const changedForm = this.mounts.controls[index];

      changedForm.get('colorId').setValue('');
      this.setCurrentColors(index, type);

      const maxNumber = this.mountsService.getMaxNumberOfChildForMountType(type);
      this.maxNumberOfChildForMountType[index] = maxNumber;
      this.minNumberOfChildForMountType[index] = this.mountsService.getMinNumberOfChildForMountType(type);
      changedForm.get('maxNumberOfChild').setValue(maxNumber);
    });

    this.mounts.push(mountForm);
  }

  deleteRow(index: number): void {
    this.mounts.removeAt(index);
  }

  submit(): void {
    this.loading = true;
    let createMountsDto: CreateMountsDto = new CreateMountsDto();
    createMountsDto.createMountDtos = [];

    for (const control of this.mounts.controls) {
      const values = control.value;
      const createMountDto = new CreateMountDto();
      createMountDto.name = values.name;
      createMountDto.gender = values.gender;
      createMountDto.colorId = values.colorId;
      createMountDto.maxNumberOfChild = values.maxNumberOfChild;

      createMountsDto.createMountDtos.push(createMountDto);
    }

    this.subscription.add(
      this.mountsService.createMounts(createMountsDto).subscribe(
        () => {
          this.loading = false;
          this.showSuccessDialog();
        },
        () => {
          this.loading = false;
          this.error = this.translateService.instant('error.unexpected');
        },
      ),
    );
  }

  private initializeMountsArray(): void {
    for (let i = 0; i < 4; i++) {
      this.addItemToFormArray();
    }
  }

  private showSuccessDialog(): void {
    Swal.fire({
      title: this.translateService.instant('bulkAdd.success'),
      icon: 'success',
      showDenyButton: true,
      confirmButtonText: this.translateService.instant('button.yes'),
      denyButtonText: this.translateService.instant('button.no'),
    }).then(result => {
      if (result.isConfirmed) {
        //Navigate to my-mounts page
        this.router.navigate(['my-mounts']);
      } else if (result.isDenied) {
        //Wipe out the form
        this.mounts = new FormArray([]);
        //Re-initialize it
        this.initializeMountsArray();
      }
    });
  }

  private setCurrentColors(index: number, type: string): void {
    this.currentColors[index] = this.groupedColorDtos.find(c => c.type === type).colors;
  }
}
