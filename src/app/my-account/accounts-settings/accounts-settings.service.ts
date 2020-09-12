import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountSettingsDto } from './models/dtos/account-settings.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AccountSettingsService {
  private acountSettingsEndpoint = 'accounts-settings/';

  constructor(private http: HttpClient) {}

  getAccountSettingByUserId(): Observable<AccountSettingsDto> {
    return this.http.get<AccountSettingsDto>(environment.webApiEndPoint + this.acountSettingsEndpoint + 'find/user-id');
  }

  updateAccountSetting(accountSettingDto: AccountSettingsDto, accountSettingsId: string): Observable<AccountSettingsDto> {
    return this.http.post<AccountSettingsDto>(
      environment.webApiEndPoint + this.acountSettingsEndpoint + accountSettingsId,
      accountSettingDto,
    );
  }
}
