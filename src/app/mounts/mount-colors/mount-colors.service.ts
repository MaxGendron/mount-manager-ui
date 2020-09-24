import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { MountTypeEnum } from '../models/enum/mount-type.enum';
import { MountColorsResponseDto } from './models/dtos/responses/mount-colors.response.dto'

@Injectable()
export class MountColorsService {
  private mountsColorEndpoint = `${environment.webApiEndPoint}mounts/colors/`;

  constructor(private http: HttpClient) {}

  getMountColorsByMountType(mountType: MountTypeEnum): Observable<MountColorsResponseDto> {
    return this.http.get<MountColorsResponseDto>(`${this.mountsColorEndpoint}find/type/${mountType}`);
  }
}