import { AuthService } from './../users/auth.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountsSettingsService } from './accounts-settings/accounts-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidatorUtil, { PasswordErrorStateMatcher } from '../common/utils/validator-util';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/models/dtos/responses/user.response.dto';
import { UpdateUserDto } from '../users/models/dtos/update-user.dto';
import { AccountSettingsResponseDto } from './accounts-settings/models/dtos/responses/account-settings.response.dto';
import { UpdateAccountSettingsDto } from './accounts-settings/models/dtos/update-account-settings.dto';
import { ServerResponseDto } from './servers/models/dtos/responses/server.response.dto';
import { ServersService } from './servers/servers.service';
import { MountTypeEnum } from 'src/app/mounts/models/enum/mount-type.enum';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnDestroy, AfterViewInit {
  private subscription: Subscription = new Subscription();
  error: string;
  loading = false;
  showPassword = false;
  mountTypes = MountTypeEnum;
  keys = Object.keys;
  initialize = true;

  passwordMatcher = new PasswordErrorStateMatcher();
  userForm: FormGroup;
  accountSettingForm: FormGroup;

  userInfo: UserResponseDto;
  accountSettingsInfo: AccountSettingsResponseDto;
  servers: ServerResponseDto[];

  usernameUpdated = false;
  emailUpdated = false;
  passwordUpdated = false;
  igUsernameUpdated = false;
  serverNameUpdated = false;
  mountTypesUpdated = false;
  autoFillChildNameUpdated = false;

  constructor(
    private translateService: TranslateService,
    private accountSettingsService: AccountsSettingsService,
    private serverService: ServersService,
    private userService: UsersService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    //Initialize the user form
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: [
        '',
        Validators.compose([Validators.required, Validators.pattern(/[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/i)]),
      ],
      passwords: this.fb.group(
        {
          password: ['', Validators.required],
          confirmPassword: [''],
        },
        { validators: ValidatorUtil.matchPasswords },
      ),
    });

    //Initialize the accountSettings form
    this.accountSettingForm = this.fb.group({
      igUsername: [''],
      serverName: [''],
      mountTypes: ['', Validators.required],
      autoFillChildName: [false, Validators.required],
    });

    //Listen on value changes to reset error & success message
    this.userForm.valueChanges.subscribe(() => {
      this.error = '';
      this.usernameUpdated = false;
      this.emailUpdated = false;
      this.passwordUpdated = false;
    });
    this.accountSettingForm.valueChanges.subscribe(() => {
      this.error = '';
      this.igUsernameUpdated = false;
      this.serverNameUpdated = false;
      this.mountTypesUpdated = false;
      this.autoFillChildNameUpdated = false;
    });

    //Listen on value changes on the selects to call the update
    this.accountSettingForm.get('serverName').valueChanges.subscribe(serverName => {
      this.updateServerName(serverName);
    });
    this.accountSettingForm.get('mountTypes').valueChanges.subscribe(mountTypes => {
      this.updateMountTypes(mountTypes);
    });
    this.accountSettingForm.get('autoFillChildName').valueChanges.subscribe(autoFillChildName => {
      this.updateAutoFillChildName(autoFillChildName);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      //Get the connected user
      this.userInfo = await this.userService.getUserByUserId().toPromise();
      //Get the accountsSettings
      this.accountSettingsInfo = await this.accountSettingsService.getAccountSettingByUserId().toPromise();
      //Get the servers
      this.servers = await this.serverService.getServers().toPromise();

      //Set value to both forms
      this.userForm.patchValue({ username: this.userInfo.username, email: this.userInfo.email });
      this.accountSettingForm.patchValue({
        igUsername: this.accountSettingsInfo.igUsername,
        serverName: this.accountSettingsInfo.serverName,
        mountTypes: this.accountSettingsInfo.mountTypes,
        autoFillChildName: this.accountSettingsInfo.autoFillChildName,
      });
    } catch (e) {
      this.error = this.translateService.instant('error.unexpectedPleaseRefresh');
    }

    this.initialize = false;
  }

  isPasswordButtonDisabled(): boolean {
    return !this.userForm.get('passwords').valid || this.loading;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  //Update username
  updateUsername(eventTarget: any): void {
    let username = eventTarget.value;
    //Only update if changed & valid
    if (username !== this.userInfo.username && this.userForm.get('username').valid) {
      const updateUserDto = new UpdateUserDto();
      updateUserDto.username = username;

      this.subscription.add(
        this.userService.updateUser(updateUserDto, this.userInfo._id).subscribe(
          user => {
            //Set userInfo to new info
            this.userInfo = user;
            //Add visual info to the user
            this.usernameUpdated = true;
          },
          error => {
            //Error handling
            if (error.name === 'CannotInsert') {
              this.userForm.get('username').setErrors({ exist: true });
            } else {
              const field = this.translateService.instant('form.username');
              this.error = this.translateService.instant('error.unexpectedUpdate', { field: field });
            }
          },
        ),
      );
    }
    eventTarget.blur();
  }

  //Update email
  updateEmail(eventTarget: any): void {
    let email = eventTarget.value;
    //Only update if changed & if email is valid
    if (email !== this.userInfo.email && this.userForm.get('email').valid) {
      const updateUserDto = new UpdateUserDto();
      updateUserDto.email = email;

      this.subscription.add(
        this.userService.updateUser(updateUserDto, this.userInfo._id).subscribe(
          user => {
            //Set userInfo to new info
            this.userInfo = user;
            //Add visual info to the user
            this.emailUpdated = true;
          },
          error => {
            //Error handling
            if (error.name === 'BadParameter') {
              this.userForm.get('email').setErrors({ pattern: true });
            } else if (error.name === 'CannotInsert') {
              this.userForm.get('email').setErrors({ exist: true });
            } else {
              const field = this.translateService.instant('form.email');
              this.error = this.translateService.instant('error.unexpectedUpdate', { field: field });
            }
          },
        ),
      );
    }
    eventTarget.blur();
  }

  //Update password
  updatePassword(): void {
    //Since this call is done from a button, we treat it like a "real api call"
    //so we don't check if changed or not
    this.loading = true;
    const updateUserDto = new UpdateUserDto();
    updateUserDto.password = this.userForm.get('passwords').get('password').value;

    this.subscription.add(
      this.userService.updateUser(updateUserDto, this.userInfo._id).subscribe(
        () => {
          this.passwordUpdated = true;
          this.loading = false;
        },
        () => {
          const field = this.translateService.instant('form.password');
          this.error = this.translateService.instant('error.unexpectedUpdate', { field: field });
          this.loading = false;
        },
      ),
    );
  }

  //Update igUsername
  updateIgUsername(eventTarget: any): void {
    let igUsername = eventTarget.value;
    //Only update if changed & valid
    if (igUsername !== this.accountSettingsInfo.igUsername) {
      const accountSettingsDto = new UpdateAccountSettingsDto();
      accountSettingsDto.igUsername = igUsername;

      this.subscription.add(
        this.accountSettingsService.updateAccountSetting(accountSettingsDto, this.accountSettingsInfo._id).subscribe(
          accountSettings => {
            //Set accountSettingsInfo to new accountSettings
            this.accountSettingsInfo = accountSettings;
            //Add visual info to the user
            this.igUsernameUpdated = true;
          },
          () => {
            //Error handling
            const field = this.translateService.instant('form.igUsername');
            this.error = this.translateService.instant('error.unexpectedUpdate', { field: field });
          },
        ),
      );
    }
    eventTarget.blur();
  }

  //Update serverName
  updateServerName(serverName: string): void {
    //Only update if changed
    if (serverName !== this.accountSettingsInfo.serverName) {
      const accountSettingsDto = new UpdateAccountSettingsDto();
      accountSettingsDto.serverName = serverName ?? '';

      this.subscription.add(
        this.accountSettingsService.updateAccountSetting(accountSettingsDto, this.accountSettingsInfo._id).subscribe(
          accountSettings => {
            //Set accountSettingsInfo to new accountSettings
            this.accountSettingsInfo = accountSettings;
            //Add visual info to the user
            this.serverNameUpdated = true;
          },
          () => {
            //Error handling
            const field = this.translateService.instant('form.serverName');
            this.error = this.translateService.instant('error.unexpectedUpdate', { field: field });
          },
        ),
      );
    }
  }

  //Update mountTypes
  updateMountTypes(mountTypes: MountTypeEnum[]): void {
    //Only update if changed & valid
    if (mountTypes !== this.accountSettingsInfo.mountTypes && this.accountSettingForm.get('mountTypes').valid) {
      const accountSettingsDto = new UpdateAccountSettingsDto();
      accountSettingsDto.mountTypes = mountTypes;

      this.subscription.add(
        this.accountSettingsService.updateAccountSetting(accountSettingsDto, this.accountSettingsInfo._id).subscribe(
          accountSettings => {
            //Set accountSettingsInfo to new accountSettings
            this.accountSettingsInfo = accountSettings;
            //Add visual info to the user
            this.mountTypesUpdated = true;
          },
          () => {
            //Error handling
            const field = this.translateService.instant('form.mountTypes');
            this.error = this.translateService.instant('error.unexpectedUpdate', { field: field });
          },
        ),
      );
    }
  }

  //Update AutoFillChildName field in accountSettings
  updateAutoFillChildName(autoFillChildName: boolean): void {
    //Only update if changed & valid
    if (autoFillChildName !== this.accountSettingsInfo.autoFillChildName) {
      const accountSettingsDto = new UpdateAccountSettingsDto();
      accountSettingsDto.autoFillChildName = autoFillChildName;

      this.subscription.add(
        this.accountSettingsService.updateAccountSetting(accountSettingsDto, this.accountSettingsInfo._id).subscribe(
          accountSettings => {
            //Set accountSettingsInfo to new accountSettings
            this.accountSettingsInfo = accountSettings;
            //Add visual info to the user
            this.autoFillChildNameUpdated = true;
          },
          () => {
            //Error handling
            const field = this.translateService.instant('form.autoFillChildNameUpdated');
            this.error = this.translateService.instant('error.unexpectedUpdate', { field: field });
          },
        ),
      );
    }
  }

  confirmDelete(): void {
    Swal.fire({
      title: this.translateService.instant('myAccount.deleteConfirmation'),
      showDenyButton: true,
      confirmButtonText: this.translateService.instant('button.dontDelete'),
      denyButtonText: this.translateService.instant('button.delete'),
    }).then(result => {
      if (result.isDenied) {
        this.deleteUser();
      }
    });
  }

  //Delete the user
  deleteUser(): void {
    this.subscription.add(
      this.userService.deleteUser(this.userInfo._id).subscribe(
        () => {
          //User has been deleted, logout
          this.authService.logout();
        },
        () => {
          this.error = this.translateService.instant('error.unexpected');
        },
      ),
    );
  }

  isDeleteButtonDisabled(): boolean {
    return this.loading;
  }
}
