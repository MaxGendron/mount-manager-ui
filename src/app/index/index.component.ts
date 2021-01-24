import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  appName: string = environment.appName;
  githubTooltip: string;
  discordTooltip: string;

  constructor(private translateService: TranslateService) {
    translateService.onLangChange.subscribe((e: LangChangeEvent) => {
      this.githubTooltip = this.translateService.instant('navbar.githubTooltip', { username: 'Torbraw#7689' });
      this.discordTooltip = this.translateService.instant('navbar.discordTooltip', { username: 'Torbraw#7689' });
    });
  }

  ngOnInit(): void {}
}
