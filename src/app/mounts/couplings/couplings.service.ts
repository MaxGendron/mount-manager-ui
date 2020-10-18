import { CreateCouplingDto } from './models/dtos/create-coupling.dto';
import { SearchCouplingDto } from './models/dtos/search-coupling.dto';
import { CouplingResponseDto } from './models/dtos/responses/coupling.response.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class CouplingsService {
  private couplingEndpoint = `${environment.webApiEndPoint}mounts/couplings/`;

  constructor(private http: HttpClient) {}

  //UserId from the Auth Token
  //Can pass a search request if needed
  getCouplingsForUserId(searchCouplingDto: SearchCouplingDto): Observable<SearchCouplingDto[]> {
    return this.http.get<CouplingResponseDto[]>(`${this.couplingEndpoint}find/user-id`, {
      params: searchCouplingDto === undefined ? {} : JSON.parse(JSON.stringify(searchCouplingDto)),
    });
  }

  createCoupling(createCouplingDto: CreateCouplingDto): Observable<SearchCouplingDto> {
    return this.http.post<CouplingResponseDto>(`${this.couplingEndpoint}`, createCouplingDto);
  }

  deleteCoupling(couplingId: string): Observable<any> {
    return this.http.delete<any>(`${this.couplingEndpoint}${couplingId}`);
  }
}
