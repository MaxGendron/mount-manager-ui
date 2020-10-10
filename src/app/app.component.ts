import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(translate: TranslateService) {
    let currentLang = JSON.parse(localStorage.getItem('currentLang')) ?? 'fr';
    localStorage.setItem('currentLang', JSON.stringify(currentLang));

    translate.use(currentLang);
    translate.setDefaultLang('fr');
  }
}
