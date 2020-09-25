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

  updateMount(updateMountDto: UpdateMountDto, mountId: string) {
    return this.http.put<MountResponseDto>(`${this.mountsEndpoint}/${mountId}`, updateMountDto);
  }

  deleteMount(mountId: string) {
    return this.http.delete<MountResponseDto>(`${this.mountsEndpoint}/${mountId}`);
  }

  getMountById(mountId: string) {
    return this.http.get<MountResponseDto>(`${this.mountsEndpoint}/${mountId}`);
  }

  //UserId from the Auth Token
  getMountForUserId() {
    return this.http.get<MountResponseDto>(`${this.mountsEndpoint}/find/user-id`);
  }

  //UserId from the Auth Token
  genderCountByTypeForUserId() {
    return this.http.get<MountResponseDto>(`${this.mountsEndpoint}/stats/gender-count`);
  }
}
