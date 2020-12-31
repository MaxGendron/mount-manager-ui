import { CreateMountsDto } from './models/dtos/create-mounts.dto';
import { SearchMountDto } from './models/dtos/search-mount.dto';
import { MountGenderCountResponseDto } from './models/dtos/responses/mount-gender-count.response.dto';
import { MountResponseDto } from './models/dtos/responses/mount.response.dto';
import { CreateMountDto } from './models/dtos/create-mount.dto';
import { UpdateMountDto } from './models/dtos/update-mount.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MountTypeEnum } from './models/enum/mount-type.enum';
import { GetMountsResponseDto } from './models/dtos/responses/get-mounts.response.dto';

@Injectable({
  providedIn: 'root',
})
export class MountsService {
  private mountsEndpoint = `${environment.webApiEndPoint}mounts/`;

  constructor(private http: HttpClient) {}

  createMount(createMountDto: CreateMountDto): Observable<MountResponseDto> {
    return this.http.post<MountResponseDto>(this.mountsEndpoint, createMountDto);
  }

  createMounts(createMountsDto: CreateMountsDto): Observable<MountResponseDto[]> {
    return this.http.post<MountResponseDto[]>(`${this.mountsEndpoint}bulk-add`, createMountsDto);
  }

  updateMount(updateMountDto: UpdateMountDto, mountId: string): Observable<MountResponseDto> {
    return this.http.put<MountResponseDto>(`${this.mountsEndpoint}${mountId}`, updateMountDto);
  }

  deleteMount(mountId: string): Observable<any> {
    return this.http.delete<any>(`${this.mountsEndpoint}${mountId}`);
  }

  //UserId from the Auth Token
  //Can pass a search request if needed
  getMountForUserId(searchMountDto?: SearchMountDto): Observable<GetMountsResponseDto> {
    return this.http.get<GetMountsResponseDto>(`${this.mountsEndpoint}find/user-id`, {
      params: searchMountDto === undefined ? {} : JSON.parse(JSON.stringify(searchMountDto)),
    });
  }

  //UserId from the Auth Token
  genderCountByTypeForUserId(): Observable<MountGenderCountResponseDto[]> {
    return this.http.get<MountGenderCountResponseDto[]>(`${this.mountsEndpoint}stats/gender-count`);
  }

  //Given the mountType, return the max number of child this mount can have
  getMaxNumberOfChildForMountType(mountType: MountTypeEnum): number {
    switch (mountType) {
      case MountTypeEnum.Dragodinde:
        return 5;
      case MountTypeEnum.Muldo:
        return 4;
      case MountTypeEnum.Volkorne:
        return 2;
    }
  }

  //Given the mountType, return the min number of child this mount can have
  getMinNumberOfChildForMountType(mountType: MountTypeEnum): number {
    switch (mountType) {
      case MountTypeEnum.Dragodinde:
        return 5;
      case MountTypeEnum.Muldo:
        return 2;
      case MountTypeEnum.Volkorne:
        return 1;
    }
  }
}
