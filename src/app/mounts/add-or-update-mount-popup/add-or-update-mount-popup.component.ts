import { MountColorDto } from './../mount-colors/models/dtos/responses/mount-color-grouped-by.response.dto';
import { UpdateMountDto } from './../models/dtos/update-mount.dto';
import { MountsService } from './../mounts.service';
import { CreateMountDto } from './../models/dtos/create-mount.dto';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { MountResponseDto } from '../models/dtos/responses/mount.response.dto';
import { MountGenderEnum } from '../models/enum/mount-gender.enum';
import { MountColorGroupedByResponseDto } from '../mount-colors/models/dtos/responses/mount-color-grouped-by.response.dto';
import ValidatorUtil from 'src/app/common/utils/validator-util';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-or-update-mount-popup',
  templateUrl: './add-or-update-mount-popup.component.html',
  styleUrls: ['./add-or-update-mount-popup.component.scss'],
})
export class AddOrUpdateMountPopupComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  error: string;
  loading = false;
  currentLang: string;
  keys = Object.keys;

  title: string;
  buttonText: string;
  types: string[];
  mountForm: FormGroup;
  maxNumberOfChildForMountType: number;
  minNumberOfChildForMountType: number;

  genders = MountGenderEnum;
  baseMount: MountResponseDto;
  groupedColorDtos: MountColorGroupedByResponseDto[];
  currentColors: MountColorDto[];
  filteredColors: Observable<MountColorDto[]>;

  constructor(
    private translateService: TranslateService,
    private mountsService: MountsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddOrUpdateMountPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.currentLang = translateService.currentLang;
    translateService.onLangChange.subscribe((e: LangChangeEvent) => (this.currentLang = e.lang));

    //Set colors
    this.groupedColorDtos = data.colors;
    //Set types
    this.types = data.types;

    //Set mount infos
    if (data.mount) {
      this.baseMount = data.mount;
      this.title = translateService.instant('addOrUpdateMount.titleUpdate', { name: data.mount.name });
      this.buttonText = translateService.instant('button.edit');
      this.maxNumberOfChildForMountType = this.mountsService.getMaxNumberOfChildForMountType(data.mount.type);
      this.minNumberOfChildForMountType = this.mountsService.getMinNumberOfChildForMountType(data.mount.type);
    } else {
      this.title = translateService.instant('addOrUpdateMount.titleCreate');
      this.buttonText = translateService.instant('button.create');
    }

    //Set form value
    this.mountForm = this.fb.group({
      name: [data.mount?.name, Validators.required],
      gender: [data.mount?.gender, Validators.required],
      type: [data.mount?.type, Validators.required],
      color: [
        data.mount?.colorId,
        Validators.compose([ValidatorUtil.autocompleteObjectValidator(), Validators.required]),
      ],
      maxNumberOfChild: [
        data.mount?.maxNumberOfChild,
        Validators.compose([
          Validators.required,
          (control: AbstractControl) => Validators.max(this.maxNumberOfChildForMountType)(control),
          (control: AbstractControl) => Validators.min(this.minNumberOfChildForMountType)(control),
        ]),
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    const type = this.mountForm.get('type').value;
    if (type) {
      this.setCurrentColors(type);
    }

    //Listen on value changes to reset error message
    this.mountForm.valueChanges.subscribe(() => {
      this.error = '';
    });

    //Listen on value changes on type to reset value of color and reset currentColors
    this.mountForm.get('type').valueChanges.subscribe(type => {
      this.mountForm.get('color').setValue('');
      this.setCurrentColors(type);

      const maxNumber = this.mountsService.getMaxNumberOfChildForMountType(type);
      this.maxNumberOfChildForMountType = maxNumber;
      this.minNumberOfChildForMountType = this.mountsService.getMinNumberOfChildForMountType(type);
      this.mountForm.get('maxNumberOfChild').setValue(maxNumber);
    });

    this.filteredColors = this.mountForm.get('color').valueChanges.pipe(
      startWith(''),
      map(value => (value ? (value.color ? value.color[this.currentLang] : value) : undefined)),
      map(color => (color ? this._filterColors(color) : this.currentColors.slice())),
    );
  }

  isDisabled(): boolean {
    return !this.mountForm.valid || this.loading;
  }

  submit(): void {
    this.loading = true;
    const baseMount = this.baseMount;
    const mountFormValue = this.mountForm.value;

    //if baseMount => update, otherwise create
    if (baseMount) {
      const updateMountDto = new UpdateMountDto();
      //Only set field if they have been updated
      updateMountDto.name = mountFormValue.name === baseMount.name ? null : mountFormValue.name;
      updateMountDto.gender = mountFormValue.gender === baseMount.gender ? null : mountFormValue.gender;
      updateMountDto.colorId = mountFormValue.colorId === baseMount.colorId ? null : mountFormValue.colorId;
      updateMountDto.maxNumberOfChild =
        mountFormValue.maxNumberOfChild === baseMount.maxNumberOfChild ? null : mountFormValue.maxNumberOfChild;

      //Only send update if something is updated
      if (updateMountDto.name || updateMountDto.gender || updateMountDto.colorId || updateMountDto.maxNumberOfChild) {
        this.subscription.add(
          this.mountsService.updateMount(updateMountDto, baseMount._id).subscribe(
            mount => {
              this.handleCreateOrUpdate(mount);
            },
            () => {
              this.handleError();
            },
          ),
        );
      } else {
        //Close the dialog otherwise
        this.dialogRef.close();
      }
    } else {
      const createMountDto = new CreateMountDto();
      createMountDto.name = mountFormValue.name;
      createMountDto.gender = mountFormValue.gender;
      createMountDto.colorId = mountFormValue.color._id;
      createMountDto.maxNumberOfChild = mountFormValue.maxNumberOfChild;

      this.subscription.add(
        this.mountsService.createMount(createMountDto).subscribe(
          mount => {
            this.handleCreateOrUpdate(mount);
          },
          () => {
            this.handleError();
          },
        ),
      );
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
    this.currentColors = this.groupedColorDtos.find(c => c.type === type).colors;
  }

  private _filterColors(value: string): MountColorDto[] {
    const filterValue = value.toLowerCase();

    return this.currentColors.filter(color => color.color[this.currentLang].toLowerCase().indexOf(filterValue) === 0);
  }

  public displayFnWrapper() {
    return color => this.displayFn(color);
  }

  public displayFn(color: MountColorDto): string {
    return color && color.color ? color.color[this.currentLang] : undefined;
  }
}
