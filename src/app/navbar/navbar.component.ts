import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../users/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../users/login-dialog/login-dialog.component';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  connectedUsername: string;
  private subscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser.subscribe(u => {
        if (this.authService.currentUserValue != null) {
          this.connectedUsername = this.authService.currentUserValue.username;
        } else {
          this.connectedUsername = null;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  openLoginPopup(): void {
    this.dialog.open(LoginDialogComponent, {
      id: 'login-popup',
      width: '600px',
      autoFocus: false,
    });
  }

  //Only have 2 lang
  switchLang() {
    if (this.translateService.getDefaultLang() === 'fr') {
      this.translateService.setDefaultLang('en');
    } else {
      this.translateService.setDefaultLang('fr');
    }
  }
}
