import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerDto } from './models/dtos/responses/server.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private serversEndpoint = `${environment.webApiEndPoint}servers/`;

  constructor(private http: HttpClient) { }

  getServers(): Observable<ServerDto[]> {
    return this.http.get<ServerDto[]>(this.serversEndpoint);
  }

  getServerById(serverId: string) {
    return this.http.get<ServerDto>(`${this.serversEndpoint}${serverId}`);
  }
}
