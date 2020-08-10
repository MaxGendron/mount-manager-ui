import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import ValidatorUtil, { PasswordErrorStateMatcher } from '../utils/validator-util';

@Component({
  selector: 'app-register-popup',
  templateUrl: './register-popup.component.html',
  styleUrls: ['./register-popup.component.scss']
})
export class RegisterPopupComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  error : string;
  loading = false;
  passwordMatcher = new PasswordErrorStateMatcher();

  registerForm = this.fb.group({
    username: [this.data.username, Validators.required],
    email: ['', Validators.compose([Validators.required, Validators.pattern(/[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/i)])],
    passwords: this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['']
    }, {validators: ValidatorUtil.matchPasswords})
  });

  constructor(public dialogRef: MatDialogRef<RegisterPopupComponent>, private translateService: TranslateService,
    private userService: UserService, private authService: AuthService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    //Listen on value changes to reset error message
    this.registerForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isDisabled(): boolean {
    return !this.registerForm.valid || this.loading;
  }

  //Verify the username don't exist
  onUsernameBlur(username: string) {
    let query = {
      query: {'username': username}
    }

    this.subscription.add(
      this.userService.exist(query).subscribe((response) => {
        if (response.exist) {
          this.registerForm.get('username').setErrors({ exist: true });
        }
        //Not subscribing on error because we don't wanna afraid the user for nothing
        //and the existing account is checked on register, so no worries about sanity
      })
    );
  }

  //Verify the email don't exist
  onEmailBlur(email: string) {
    let query = {
      query: { 'email': email }
    }

    this.subscription.add(this.userService.exist(query)
      .subscribe(response => {
        if (response.exist) {
          this.registerForm.get('email').setErrors({ 'exist': true });
        }
        //Not subscribing on error because we don't wanna afraid the user for nothing
        //and the existing account is checked on register, so no worries about sanity
      }));
  }

  //Try registering the user
  register(): void {
    this.loading = true;

    this.subscription.add(this.userService.registerUser(this.registerForm.get('username').value,
      this.registerForm.get('passwords').get('password').value,
      this.registerForm.get('email').value )
    .subscribe(response => {
      this.authService.login(response);
      //Close the dialog
      this.dialogRef.close();
      this.loading = false;
    }, error => {
      //Error handling
      if (error.name === 'UndefinedParameter') {
        this.error = this.translateService.instant('error.allFields');
      } else if (error.name === 'BadParameter') {
        this.error = this.translateService.instant('error.invalidEmail');
      } else if (error.name === 'CannotInsert') {
        //This one should never happend, only sanity check
        this.error = this.translateService.instant('error.accountExist');
      } else {
        this.error = this.translateService.instant('error.unexpected');
      }
      this.loading = false;
    }));
  }
}
