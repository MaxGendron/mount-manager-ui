import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminUserService } from '../services/admin-user.service';
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

  constructor(private adminUserService: AdminUserService, private authService: AuthService, private router: Router, private translateService: TranslateService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login() {
    this.loading = true;
    this.subscription.add(this.adminUserService.validateUser(this.username, this.password).subscribe(response => {
      if (response.isValid !== true) {
        this.error = this.translateService.instant('error.userNotfound');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.authService.currentUserSubject.next(response.user);
        this.router.navigate(['schedule']);
      }
      this.loading = false;
    }, error => {
      if (error.name === 'NotFound') {
        this.error = this.translateService.instant('error.userNotfound');
      } else {
        this.error = this.translateService.instant('error.unexpected');
      }
      this.loading = false;
    }));
  }
}
