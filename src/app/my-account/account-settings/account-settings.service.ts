import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountSettingDto } from './models/dtos/account-setting.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AccountSettingsService {
  private acountSettingsEndpoint = 'account-settings/';

  constructor(private http: HttpClient) {}

  getAccountSettingByUserId(): Observable<AccountSettingDto> {
    return this.http.get<AccountSettingDto>(
      environment.webApiEndPoint + this.acountSettingsEndpoint + 'find/user-id',
    );
  }

  updateAccountSetting(
    accountSettingDto: AccountSettingDto,
    accountSettingsId: string
  ): Observable<AccountSettingDto> {
    return this.http.post<AccountSettingDto>(
      environment.webApiEndPoint + this.acountSettingsEndpoint + accountSettingsId,
      accountSettingDto,
    );
  }
}
