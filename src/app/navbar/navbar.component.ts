import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  private subscription: Subscription = new Subscription();
  username;
  password;
  error;
  loading = false;

  connectedUsername: string;

  constructor(private userService: UserService, private authService: AuthService, 
    private translateService: TranslateService, private router: Router) { }

  logout(): void {
    this.authService.logout();
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
        this.connectedUsername = this.authService.currentUserValue;
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
