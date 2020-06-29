import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();
  error : string;
  loading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private translateService: TranslateService,
    private userService: UserService, private authService: AuthService, private fb: FormBuilder) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isDisabled(): boolean {
    return !this.loginForm.valid || this.loading;
  }

  //Try to login the user
  login(): void {
    this.loading = true;

    this.subscription.add(this.userService.validateUser(this.loginForm.value.username, this.loginForm.value.password).subscribe(response => {
      //Look if the user is valid or not
      if (response.isValid !== true) {
        this.error = this.translateService.instant('error.userNotfound');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.authService.currentUserSubject.next(response.user);
        //Close the dialog
        this.dialogRef.close();
      }
      this.loading = false;
    }, error => {
      //Error handling
      if (error.name === 'NotFound') {
        this.error = this.translateService.instant('error.userNotfound');
      } else {
        this.error = this.translateService.instant('error.unexpected');
      }
      this.loading = false;
    }));
  }

  register(): void {
    this.dialogRef.close();
  }
}
