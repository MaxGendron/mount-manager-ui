import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountSettingsService } from './account-settings/account-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidatorUtil, { PasswordErrorStateMatcher } from '../utils/validator-util';
import { UserService } from '../users/user.service';
import { UserResponseDto } from '../users/models/dtos/responses/user.response.dto';
import { UpdateUserDto } from '../users/models/dtos/update-user.dto';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  error: string;
  loading = false;
  showPassword = true;

  passwordMatcher = new PasswordErrorStateMatcher();
  userForm: FormGroup;
  userInfo: UserResponseDto;

  usernameUpdated = false;
  emailUpdated = false;
  passwordUpdated = false;

  constructor(
    private translateService: TranslateService,
    private accountSettingsService: AccountSettingsService,
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

    //Initialize the user form
    this.userForm = this.fb.group({
      username: [this.userInfo.username],
      email: [this.userInfo.email, Validators.pattern(/[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/i)],
      passwords: this.fb.group(
        {
          password: ['', Validators.required],
          confirmPassword: [''],
        },
        { validators: ValidatorUtil.matchPasswords },
      ),
    });

    //Listen on value changes to reset error message
    this.userForm.valueChanges.subscribe(() => {
      this.error = '';
      this.usernameUpdated = false;
      this.emailUpdated = false;
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
    //Only update if changed
    if (username != this.userInfo.username) {
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
    if (email != this.userInfo.email && this.userForm.get('email').valid) {
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
}
