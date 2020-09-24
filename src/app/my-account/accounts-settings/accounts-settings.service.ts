import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountSettingsResponseDto } from './models/dtos/responses/account-settings.response.dto';
import { UpdateAccountSettingsDto } from './models/dtos/update-account-settings.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AccountsSettingsService {
  private acountSettingsEndpoint = `${environment.webApiEndPoint}accounts-settings/`;

  constructor(private http: HttpClient) {}

  getAccountSettingByUserId(): Observable<AccountSettingsResponseDto> {
    return this.http.get<AccountSettingsResponseDto>(`${this.acountSettingsEndpoint}find/user-id`);
  }

  updateAccountSetting(
    updateAccountSettingDto: UpdateAccountSettingsDto,
    accountSettingsId: string,
  ): Observable<AccountSettingsResponseDto> {
    return this.http.put<AccountSettingsResponseDto>(
      `${this.acountSettingsEndpoint}${accountSettingsId}`,
      updateAccountSettingDto,
    );
  }
}
