import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountSettingsDto } from './models/dtos/responses/account-settings.dto';
import { UpdateAccountSettingsDto } from './models/dtos/update-account-settings.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AccountSettingsService {
  private acountSettingsEndpoint = `${environment.webApiEndPoint}accounts-settings/`;

  constructor(private http: HttpClient) {}

  getAccountSettingByUserId(): Observable<AccountSettingsDto> {
    return this.http.get<AccountSettingsDto>(`${this.acountSettingsEndpoint}find/user-id`);
  }

  updateAccountSetting(
    updateAccountSettingDto: UpdateAccountSettingsDto,
    accountSettingsId: string,
  ): Observable<AccountSettingsDto> {
    return this.http.put<AccountSettingsDto>(
      `${this.acountSettingsEndpoint}${accountSettingsId}`,
      updateAccountSettingDto,
    );
  }
}
