import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import ValidatorUtil from '../utils/validator-util';

@Component({
  selector: 'app-register-popup',
  templateUrl: './register-popup.component.html',
  styleUrls: ['./register-popup.component.scss']
})
export class RegisterPopupComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  error : string;
  loading = false;

  registerForm = this.fb.group({
    username: [this.data.username, Validators.required],
    passwords: this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validators: ValidatorUtil.matchPasswords})
  });

  constructor(public dialogRef: MatDialogRef<RegisterPopupComponent>, private translateService: TranslateService,
    private userService: UserService, private authService: AuthService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    //Listen on value changes to display an error message if the password doesn't match, 
    //otherwise wipe it
    this.registerForm.get("passwords").valueChanges.subscribe(value => {
      if (this.registerForm.get("passwords").hasError("notSame") && value.confirmPassword !== "") {
        this.error = this.translateService.instant('error.matchPassword');
      } else {
        this.error = ""
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isDisabled(): boolean {
    return !this.registerForm.valid || this.loading;
  }

  //Try registering the user
  register(): void {
    this.loading = true;

    this.subscription.add(this.userService.registerUser(this.registerForm.get("username").value,
      this.registerForm.get("passwords").get("password").value)
    .subscribe(response => {
      this.authService.login(response.user);
      //Close the dialog
      this.dialogRef.close();
      this.loading = false;
    }, () => {
      //Error handling
      this.error = this.translateService.instant('error.unexpected');
      this.loading = false;
    }));
  }
}
