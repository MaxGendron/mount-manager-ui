import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../users/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../users/login-dialog/login-dialog.component';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface Lang {
  name: string;
  displayName: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  connectedUsername: string;
  currentLang: string;
  langs: Lang[]
  private subscription: Subscription = new Subscription();
  color: string;
  constructor(public authService: AuthService, public dialog: MatDialog, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser.subscribe(() => {
        if (this.authService.currentUserValue !== null) {
          this.connectedUsername = this.authService.currentUserValue.username;
        } else {
          this.connectedUsername = null;
        }
      }),
    );
    this.currentLang = this.translateService.currentLang;
    //TODO when more lang added
    this.langs = [
      { name: 'fr', displayName: 'Français' },
      { name: 'en', displayName: "English" }
    ]
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
  //TODO when more lang added
  switchLang(): void {
    this.translateService.use(this.currentLang);
    localStorage.setItem('currentLang', JSON.stringify(this.currentLang));
  }
}
