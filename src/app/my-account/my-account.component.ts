import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountSettingsService } from './accounts-settings/accounts-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidatorUtil, { PasswordErrorStateMatcher } from '../common/utils/validator-util';
import { UserService } from '../users/user.service';
import { UserResponseDto } from '../users/models/dtos/responses/user.response.dto';
import { UpdateUserDto } from '../users/models/dtos/update-user.dto';
import { AccountSettingsDto } from './accounts-settings/models/dtos/responses/account-settings.dto';
import { UpdateAccountSettingsDto } from './accounts-settings/models/dtos/update-account-settings.dto';
import { ServerDto } from './servers/models/dtos/responses/server.dto';
import { ServerService } from './servers/server.service';
import { MountTypeEnum } from '../mounts/models/enum/mount-type.enum';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  error: string;
  loading = false;
  showPassword = false;
  mountTypes = MountTypeEnum;
  keys = Object.keys;

  passwordMatcher = new PasswordErrorStateMatcher();
  userForm: FormGroup;
  accountSettingForm: FormGroup;

  userInfo: UserResponseDto;
  accountSettingsInfo: AccountSettingsDto;
  servers: ServerDto[];

  usernameUpdated = false;
  emailUpdated = false;
  passwordUpdated = false;
  igUsernameUpdated = false;
  serverNameUpdated = false;
  mountTypesUpdated = false;

  constructor(
    private translateService: TranslateService,
    private accountSettingsService: AccountSettingsService,
    private serverService: ServerService,
    private userService: UserService,
    private fb: FormBuilder,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    //Get the connected user
    this.userInfo = await this.userService.getUserByUserId().toPromise();
    //Get the accountsSettings
    this.accountSettingsInfo = await this.accountSettingsService.getAccountSettingByUserId().toPromise();
    //Get the servers
    this.servers = await this.serverService.getServers().toPromise();

    //Initialize the user form
    this.userForm = this.fb.group({
      username: [this.userInfo.username, Validators.required],
      email: [
        this.userInfo.email,
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
      igUsername: [this.accountSettingsInfo.igUsername],
      serverName: [this.accountSettingsInfo.serverName],
      mountTypes: [this.accountSettingsInfo.mountTypes, Validators.required],
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
    });

    //Listen on value changes on the selects to call the update
    this.accountSettingForm.get('serverName').valueChanges.subscribe(serverName => {
      this.updateServerName(serverName);
    });
    this.accountSettingForm.get('mountTypes').valueChanges.subscribe(mountTypes => {
      this.updateMountTypes(mountTypes);
    });
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
}
