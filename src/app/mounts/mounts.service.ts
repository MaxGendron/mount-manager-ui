import { SearchMountDto } from './models/dtos/search-mount.dto';
import { MountGenderCountResponseDto } from './models/dtos/responses/mount-gender-count.response.dto';
import { MountResponseDto } from './models/dtos/responses/mounts.response.dto';
import { CreateMountDto } from './models/dtos/create-mount.dto';
import { UpdateMountDto } from './models/dtos/update-mount.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MountsService {
  private mountsEndpoint = `${environment.webApiEndPoint}mounts/`;

  constructor(private http: HttpClient) {}

  createMount(createMountDto: CreateMountDto): Observable<MountResponseDto> {
    return this.http.post<MountResponseDto>(`${this.mountsEndpoint}`, createMountDto);
  }

  updateMount(updateMountDto: UpdateMountDto, mountId: string): Observable<MountResponseDto> {
    return this.http.put<MountResponseDto>(`${this.mountsEndpoint}${mountId}`, updateMountDto);
  }

  deleteMount(mountId: string): Observable<any> {
    return this.http.delete<any>(`${this.mountsEndpoint}${mountId}`);
  }

  getMountById(mountId: string): Observable<MountResponseDto> {
    return this.http.get<MountResponseDto>(`${this.mountsEndpoint}${mountId}`);
  }

  //UserId from the Auth Token
  //Can pass a search request if needed
  getMountForUserId(searchMountDto?: SearchMountDto): Observable<MountResponseDto[]> {
    return this.http.get<MountResponseDto[]>(`${this.mountsEndpoint}find/user-id`, {
      params: searchMountDto === undefined ? {} : JSON.parse(JSON.stringify(searchMountDto)),
    });
  }

  //UserId from the Auth Token
  genderCountByTypeForUserId(): Observable<MountGenderCountResponseDto[]> {
    return this.http.get<MountGenderCountResponseDto[]>(`${this.mountsEndpoint}stats/gender-count`);
  }
}
