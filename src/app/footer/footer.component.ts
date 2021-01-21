import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  years: string;

  constructor(public translateService: TranslateService) {
    const minYear: number = 2021;
    const currentYear: number = new Date().getFullYear();
    if (minYear === currentYear) {
      this.years = minYear.toString();
    } else {
      this.years = `${minYear} - ${currentYear}`;
    }
  }

  ngOnInit(): void {}
}
