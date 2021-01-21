import { UsersService } from './../users/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../users/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../users/login-dialog/login-dialog.component';
import { Subscription } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

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
  langs: Lang[];
  private subscription: Subscription = new Subscription();
  color: string;
  isContainerOpened: boolean = false;
  appName: string = environment.appName;
  githubTooltip: string;
  discordTooltip: string;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private usersService: UsersService,
  ) {
    translateService.onLangChange.subscribe((e: LangChangeEvent) => {
      this.githubTooltip = this.translateService.instant('navbar.githubTooltip', { username: 'Torbraw#7689' });
      this.discordTooltip = this.translateService.instant('navbar.discordTooltip', { username: 'Torbraw#7689' });
    });
  }

  async ngOnInit(): Promise<void> {
    this.subscription.add(
      this.authService.currentUser.subscribe(() => {
        if (this.authService.currentUserValue !== null) {
          var openSidenav: string = localStorage.getItem('openSidenav');
          if (openSidenav === 'true') {
            this.isContainerOpened = true;
            localStorage.setItem('openSidenav', 'false');
          }
          this.connectedUsername = this.authService.currentUserValue.username;
        } else {
          this.connectedUsername = null;
          this.isContainerOpened = false;
        }
      }),
    );

    this.currentLang = this.translateService.currentLang;
    //TODO when more lang added
    this.langs = [
      { name: 'fr', displayName: 'Français' },
      { name: 'en', displayName: 'English' },
    ];

    /* Do a call to see if the token isn't expired.
    If it is the jwtInterceptor will catch the error.
    We do that here so on page that doesn't have call to the api we still
    validate the user to update the navbar. */
    try {
      await this.usersService.validateJwtToken().toPromise();
    } catch (error) {
      //Do nothing on error
    }
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

  switchLang(): void {
    this.translateService.use(this.currentLang);
    localStorage.setItem('currentLang', JSON.stringify(this.currentLang));
  }
}
