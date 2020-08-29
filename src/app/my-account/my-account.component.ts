import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountSettingsService } from './account-settings/account-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidatorUtil, { PasswordErrorStateMatcher } from '../utils/validator-util';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  error: string;
  loading = false;
  passwordMatcher = new PasswordErrorStateMatcher();
  userForm: FormGroup;

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
    const userInfo = await this.userService.getUserByUserId().toPromise();
    //Get the accountsSettings

    //Initialize the form
    this.userForm = this.fb.group({
      username: [userInfo.username],
      email: [
        userInfo.email,
        Validators.pattern(/[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/i)
      ],
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
    });
  }

  isDisabled(): boolean {
    return !this.userForm.valid || this.loading;
  }

  //Update username
  updateUsername(username: string) {
    //Only update if changed
  }

  //Update email
  updateEmail(email: string) {
    //Only update if changed
  }
}
