import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  username;
  password;
  error;
  loading = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //Try to login the user
  login(): void {
    this.loading = true;

    this.subscription.add(this.userService.validateUser(this.username, this.password).subscribe(response => {
      //Look if the user is valid or not
      if (response.isValid !== true) {
        this.error = this.translateService.instant('error.userNotfound');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.authService.currentUserSubject.next(response.user);
        this.router.navigate(['index']);
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
}
