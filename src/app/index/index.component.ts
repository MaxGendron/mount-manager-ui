import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  appName: string = environment.appName;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {}
}
