import { CreateCouplingDto } from './../couplings/models/dtos/create-coupling.dto';
import { SearchCouplingDto } from './../couplings/models/dtos/search-coupling.dto';
import { CouplingResponseDto } from './../couplings/models/dtos/responses/coupling.response.dto';
import { CouplingsService } from './../couplings/couplings.service';
import { SearchMountDto } from './../models/dtos/search-mount.dto';
import { MountSortFieldEnum } from './../models/enum/mount-sort-field.enum';
import { SortOrderEnum } from './../../common/enum/sort-order.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MountGenderCountResponseDto } from './../models/dtos/responses/mount-gender-count.response.dto';
import { MountGenderEnum } from './../models/enum/mount-gender.enum';
import { MountsService } from './../mounts.service';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MountResponseDto } from '../models/dtos/responses/mount.response.dto';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddOrUpdateMountPopupComponent } from '../add-or-update-mount-popup/add-or-update-mount-popup.component';
import Swal from 'sweetalert2/src/sweetalert2.js';
import {
  MountColorDto,
  MountColorGroupedByResponseDto,
} from '../mount-colors/models/dtos/responses/mount-color-grouped-by.response.dto';
import { MountColorsService } from '../mount-colors/mount-colors.service';
import { AccountsSettingsService } from 'src/app/my-account/accounts-settings/accounts-settings.service';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';

export enum DeleteTypeEnum {
  Mount,
  Coupling,
}

@Component({
  selector: 'app-my-mounts',
  templateUrl: './my-mounts.component.html',
  styleUrls: ['./my-mounts.component.scss'],
})
export class MyMountsComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private limitIncrement: number = 20;
  currentLang: string;
  keys = Object.keys;
  breedingTooltip: string;
  mountsLimit: number = this.limitIncrement;
  couplingsLimit: number = this.limitIncrement;
  showButton: boolean = false;
  isViewMoreMountsDisabled: boolean = false;
  isViewMoreCouplingsDisabled: boolean = false;

  mountLoading = false;
  couplingLoading = false;
  createCouplingLoading = false;

  mountError: string;
  couplingError: string;
  createCouplingError: string;
  globalError: string;

  mountsFiltersForm: FormGroup;
  couplingsFiltersForm: FormGroup;
  types: string[];

  mountGenderEnum = MountGenderEnum;
  mountSortFieldEnum = MountSortFieldEnum;
  sortOrderEnum = SortOrderEnum;
  deleteTypeEnum = DeleteTypeEnum;

  mounts: MountResponseDto[] = new Array();
  currentColors: MountColorDto[];
  mountGenderCounts: MountGenderCountResponseDto[];
  groupedColorDtos: MountColorGroupedByResponseDto[];
  couplings: CouplingResponseDto[] = new Array();
  couplingMother: MountResponseDto;
  couplingFather: MountResponseDto;
  couplingChildName: string;

  constructor(
    private translateService: TranslateService,
    private mountsService: MountsService,
    private mountColorsService: MountColorsService,
    private accountsSettingsService: AccountsSettingsService,
    private couplingsService: CouplingsService,
    private fb: FormBuilder,
    private scrollDispatcher: ScrollDispatcher,
    private ngZone: NgZone,
    public dialog: MatDialog,
  ) {
    this.currentLang = translateService.currentLang;
    translateService.onLangChange.subscribe((e: LangChangeEvent) => {
      this.currentLang = e.lang;
      this.breedingTooltip = this.translateService.instant('myMounts.breedingTooltip');
    });

    //Initialize the mountsFilters form
    this.mountsFiltersForm = this.fb.group({
      name: [''],
      gender: [''],
      type: [''],
      colorId: [''],
      sortField: [MountSortFieldEnum.Name],
      sortOrder: [SortOrderEnum.Asc],
      hasMaxedChild: [false],
      hasNoChild: [false],
    });

    //Initialize the couplingsFiltersForm form
    this.couplingsFiltersForm = this.fb.group({
      fatherName: [''],
      motherName: [''],
      childName: [''],
    });
  }

  ngAfterViewInit(): void {
    //Subscribe on scroll event to add "back to top button"
    this.scrollDispatcher.scrolled().subscribe((data: CdkScrollable) => {
      if (data.measureScrollOffset('top') > 1000) {
        //Need to get into angular zone to use dataBindings
        this.ngZone.run(() => {
          this.showButton = true;
        });
      } else {
        //Need to get into angular zone to use dataBindings
        this.ngZone.run(() => {
          this.showButton = false;
        });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const mountsResponse = await this.mountsService.getMountForUserId().toPromise();
      if (mountsResponse != null) {
        this.mounts = mountsResponse.mounts;
        this.setIsViewMoreMountsDisabled(mountsResponse.totalCount);
      }
      const couplingsResponse = await this.couplingsService.getCouplingsForUserId().toPromise();
      if (couplingsResponse != null) {
        this.couplings = couplingsResponse.couplings;
        this.setIsViewMoreCouplingsDisabled(couplingsResponse.totalCount);
      }
      this.groupedColorDtos = await this.mountColorsService.getMountColorsGroupedByMountType().toPromise();
      this.types = (await this.accountsSettingsService.getAccountSettingByUserId().toPromise())?.mountTypes;
    } catch (e) {
      this.globalError = this.translateService.instant('error.unexpectedPleaseRefresh');
    }
    this.setMountGenderCounts();

    //Listen on value changes on type to reset value of color and reset currentColors
    this.mountsFiltersForm.get('type').valueChanges.subscribe(type => {
      this.mountsFiltersForm.get('colorId').setValue('');
      if (type) {
        this.setCurrentColors(type);
      }
    });

    //Listen on value changes to reset error message
    this.mountsFiltersForm.valueChanges.subscribe(() => {
      this.mountError = '';
    });
    this.couplingsFiltersForm.valueChanges.subscribe(() => {
      this.couplingError = '';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  scrollToTop(): void {
    /* I know this is ugly but it's the only solution I found.
    I tried using a bunch of stuff including a ViewChild of the CdkScrollable
    which got my object in it, but the scrollTo function did nothing.
    I think it's because of the way the app is build with the sidenav etc.*/
    for (const containers of this.scrollDispatcher.scrollContainers) {
      for (const element of containers) {
        if (element instanceof CdkScrollable) {
          element.scrollTo({
            top: 0,
          });
        }
      }
    }
  }

  handleMountError(): void {
    this.mountError = this.translateService.instant('error.unexpected');
    this.scrollToTop();
  }

  handleCouplingError(): void {
    this.couplingError = this.translateService.instant('error.unexpected');
    this.scrollToTop();
  }

  isMountButtonDisabled(): boolean {
    return this.mountLoading;
  }

  isCouplingButtonDisabled(): boolean {
    return this.couplingLoading;
  }

  isCreateCouplingDisabled(): boolean {
    return this.createCouplingLoading || !this.couplingChildName;
  }

  openMountPopup(mount?: MountResponseDto): void {
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

    this.listenOnMountPopupClose(dialogRef);
  }

  listenOnMountPopupClose(dialogRef: MatDialogRef<AddOrUpdateMountPopupComponent>): void {
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

  confirmDelete(id: string, deleteType: DeleteTypeEnum): void {
    Swal.fire({
      title:
        deleteType === DeleteTypeEnum.Mount
          ? this.translateService.instant('myMounts.mountDeleteConfirmation')
          : this.translateService.instant('myMounts.couplingDeleteConfirmation'),
      showDenyButton: true,
      confirmButtonText: this.translateService.instant('button.dontDelete'),
      denyButtonText: this.translateService.instant('button.delete'),
    }).then(result => {
      if (result.isDenied) {
        deleteType === DeleteTypeEnum.Mount ? this.deleteMount(id) : this.deleteCoupling(id);
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
          this.handleMountError();
        },
      ),
    );
  }

  deleteCoupling(couplingId: string): void {
    this.subscription.add(
      this.couplingsService.deleteCoupling(couplingId).subscribe(
        () => {
          //Remove mount from the lists
          this.couplings = this.couplings.filter(m => m._id !== couplingId);
        },
        () => {
          this.handleMountError();
        },
      ),
    );
  }

  filterMounts(searchMountDto?: SearchMountDto): void {
    this.mountLoading = true;
    const filtersFormValue = this.mountsFiltersForm.value;
    //If no dto passed, if means we come from the filter button, so we need to create the object
    //& reset the mountsLimit.
    //Otherwise we come from the "viewMore" button so we already have a dto
    if (!searchMountDto) {
      searchMountDto = new SearchMountDto();
      this.resetMountsLimit();
    }

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
    if (filtersFormValue.hasMaxedChild) {
      searchMountDto.hasMaxedChild = filtersFormValue.hasMaxedChild;
    }
    if (filtersFormValue.hasNoChild) {
      searchMountDto.hasNoChild = filtersFormValue.hasNoChild;
    }
    if (filtersFormValue.sortField) {
      searchMountDto.sortField = filtersFormValue.sortField;
    }
    if (filtersFormValue.sortOrder) {
      searchMountDto.sortOrder = filtersFormValue.sortOrder;
    }

    this.subscription.add(
      this.mountsService.getMountForUserId(searchMountDto).subscribe(
        response => {
          this.mounts = response.mounts;
          this.setIsViewMoreMountsDisabled(response.totalCount);
          this.mountLoading = false;
        },
        () => {
          this.handleMountError();
          this.mountLoading = false;
        },
      ),
    );
  }

  filterCouplings(searchCouplingDto?: SearchCouplingDto): void {
    this.couplingLoading = true;
    const filtersFormValue = this.couplingsFiltersForm.value;
    //If no dto passed, if means we come from the filter button, so we need to create the object
    //& reset the couplingsLimit.
    //Otherwise we come from the "viewMore" button so we already have a dto
    if (!searchCouplingDto) {
      searchCouplingDto = new SearchCouplingDto();
      this.resetCouplingsLimit();
    }

    if (filtersFormValue.fatherName) {
      searchCouplingDto.fatherName = filtersFormValue.fatherName;
    }
    if (filtersFormValue.motherName) {
      searchCouplingDto.motherName = filtersFormValue.motherName;
    }
    if (filtersFormValue.childName) {
      searchCouplingDto.childName = filtersFormValue.childName;
    }

    this.subscription.add(
      this.couplingsService.getCouplingsForUserId(searchCouplingDto).subscribe(
        response => {
          this.couplings = response.couplings;
          this.setIsViewMoreCouplingsDisabled(response.totalCount);
          this.couplingLoading = false;
        },
        () => {
          this.handleCouplingError();
          this.couplingLoading = false;
        },
      ),
    );
  }

  addToBreeding(mount: MountResponseDto): void {
    //Reset error message
    this.createCouplingError = null;

    if (mount.gender === MountGenderEnum.Male) {
      //If already a father in coupling, show error
      if (this.couplingFather) {
        this.createCouplingError = this.translateService.instant('error.sameGender');
      } else {
        //If a mother is selected and type is not the same, show error
        if (this.couplingMother && this.couplingMother.type !== mount.type) {
          this.createCouplingError = this.translateService.instant('error.notSameType');
        } else {
          this.couplingFather = mount;
        }
      }
    } else {
      //If already a mother in coupling, show error
      if (this.couplingMother) {
        this.createCouplingError = this.translateService.instant('error.sameGender');
      } else {
        //If a father is selected and type is not the same, show error
        if (this.couplingFather && this.couplingFather.type !== mount.type) {
          this.createCouplingError = this.translateService.instant('error.notSameType');
        } else {
          this.couplingMother = mount;
        }
      }
    }

    //If both parents selected, set childName
    if (this.couplingFather && this.couplingMother) {
      this.couplingChildName = this.couplingMother.name + this.couplingFather.name;
    }
  }

  createCoupling(): void {
    this.createCouplingLoading = true;
    let createCouplingDto = new CreateCouplingDto();
    createCouplingDto.childName = this.couplingChildName;
    createCouplingDto.fatherId = this.couplingFather._id;
    createCouplingDto.motherId = this.couplingMother._id;

    this.subscription.add(
      this.couplingsService.createCoupling(createCouplingDto).subscribe(
        coupling => {
          this.couplings.push(coupling);
          this.createCouplingLoading = false;
          //Increment numberOfChild
          this.couplingMother.numberOfChild = ++this.couplingMother.numberOfChild;
          this.couplingFather.numberOfChild = ++this.couplingFather.numberOfChild;
          //Reset coupling info
          this.couplingMother = null;
          this.couplingFather = null;
          this.couplingChildName = null;
        },
        error => {
          if (error.name === 'CannotInsert') {
            this.createCouplingError = this.translateService.instant('error.maxNumberOfChild');
          } else {
            this.createCouplingError = this.translateService.instant('error.unexpected');
          }
          this.createCouplingLoading = false;
        },
      ),
    );
  }

  deleteCouplingMother(): void {
    this.couplingMother = null;
    this.couplingChildName = this.couplingChildName = null;
    //Reset error message
    this.createCouplingError = null;
  }

  deleteCouplingFather(): void {
    this.couplingFather = null;
    this.couplingChildName = this.couplingChildName = null;
    //Reset error message
    this.createCouplingError = null;
  }

  loadMoreMounts(): void {
    this.mountsLimit += this.limitIncrement;
    let searchMountDto = new SearchMountDto();
    searchMountDto.limit = this.mountsLimit;
    this.filterMounts(searchMountDto);
  }

  loadMoreCouplings(): void {
    this.couplingsLimit += this.limitIncrement;
    let searchCouplingDto = new SearchCouplingDto();
    searchCouplingDto.limit = this.mountsLimit;
    this.filterCouplings(searchCouplingDto);
  }

  resetMountsLimit(): void {
    this.mountsLimit = this.limitIncrement;
  }

  resetCouplingsLimit(): void {
    this.couplingsLimit = this.limitIncrement;
  }

  //Set the variable based on totalCount vs array count
  private setIsViewMoreMountsDisabled(totalCount: number) {
    this.isViewMoreMountsDisabled = !(totalCount > this.mounts.length);
  }

  //Set the variable based on totalCount vs array count
  private setIsViewMoreCouplingsDisabled(totalCount: number) {
    this.isViewMoreCouplingsDisabled = !(totalCount > this.couplings.length);
  }

  private async setMountGenderCounts(): Promise<void> {
    try {
      this.mountGenderCounts = await this.mountsService.genderCountByTypeForUserId().toPromise();
    } catch (e) {
      this.globalError = this.translateService.instant('error.unexpectedPleaseRefresh');
    }
  }

  private setCurrentColors(type: string): void {
    this.currentColors = this.groupedColorDtos.find(c => c.type === type).colors;
  }
}
