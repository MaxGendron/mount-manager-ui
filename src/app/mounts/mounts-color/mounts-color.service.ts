import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { MountTypeEnum } from '../models/enum/mount-type.enum';

@Injectable()
export class MountsColorService {
  private mountsColorEndpoint = `${environment.webApiEndPoint}mounts/colors/`;

  constructor(private http: HttpClient) {}

  getMountColorsByMountType(mountType: MountTypeEnum) {
    
  }
}
