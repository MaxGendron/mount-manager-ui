import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponseDto } from './models/dtos/responses/server.response.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServersService {
  private serversEndpoint = `${environment.webApiEndPoint}servers/`;

  constructor(private http: HttpClient) {}

  getServers(): Observable<ServerResponseDto[]> {
    return this.http.get<ServerResponseDto[]>(this.serversEndpoint);
  }

  getServerById(serverId: string) {
    return this.http.get<ServerResponseDto>(`${this.serversEndpoint}${serverId}`);
  }
}
