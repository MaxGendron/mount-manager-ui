import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersEndpoint = 'users/'

  constructor(private http: HttpClient) { }

  validateUser(username, password) {
    const userObject = { 'username': username, 'password': password };
    return this.http.post<any>(environment.webApiEndPoint + this.usersEndpoint + 'validate', userObject);
  }
}
