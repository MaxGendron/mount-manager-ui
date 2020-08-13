import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Validators, FormBuilder } from '@angular/forms';
import { RegisterPopupComponent } from '../register-popup/register-popup.component';
import { LoginDto } from '../models/dtos/login.dto';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnDestroy, OnInit {

  private subscription: Subscription = new Subscription();
  error : string;
  loading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private translateService: TranslateService,
    private userService: UserService, private authService: AuthService, private fb: FormBuilder,
    public dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    //Listen on value changes to reset error message
    this.loginForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  isDisabled(): boolean {
    return !this.loginForm.valid || this.loading;
  }

  //Try to login the user
  login(): void {
    this.loading = true;
    const loginDto = new LoginDto(this.loginForm.get('username').value, this.loginForm.get('password').value);
    
    this.subscription.add(this.userService.loginUser(loginDto)
      .subscribe(response => {
        this.authService.login(response);
        //Close the dialog
        this.dialogRef.close();
        this.loading = false;
      }, error => {
        //Error handling
        if (error.name === 'NotFound') {
          this.error = this.translateService.instant('error.userNotfound');
        } else if (error.name = 'UndefinedParameter') {
          this.error = this.translateService.instant('error.allFields');
        } else {
          this.error = this.translateService.instant('error.unexpected');
        }
        this.loading = false;
      }));
  }

  register(): void {
    this.dialogRef.close();
    this.dialog.open(RegisterPopupComponent, {
      id: 'register-popup',
      width: '600px',
      data: {
        username: this.loginForm.value.username
      },
      autoFocus: false
    });
  }
}
