import { MountColorGroupedByResponseDto } from './models/dtos/responses/mount-color-grouped-by.response.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class MountColorsService {
  private mountColorsEndpoint = `${environment.webApiEndPoint}mounts/colors/`;

  constructor(private http: HttpClient) {}

  getMountColorsGroupedByMountType(): Observable<MountColorGroupedByResponseDto[]> {
    return this.http.get<MountColorGroupedByResponseDto[]>(`${this.mountColorsEndpoint}group/type`);
  }
}
