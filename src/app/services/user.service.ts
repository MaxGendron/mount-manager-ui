import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersEndpoint = 'users/'

  constructor(private http: HttpClient) { }

  loginUser(username, password) {
    const userObject = { 'username': username, 'password': password };
    return this.http.post<any>(environment.webApiEndPoint + this.usersEndpoint + 'login', userObject);
  }

  registerUser(username, password, email) {
    const userObject = { 'username': username, 'password': password, 'email': email };
    return this.http.post<any>(environment.webApiEndPoint + this.usersEndpoint, userObject);
  }

  exist(query) {
    return this.http.post<any>(environment.webApiEndPoint + this.usersEndpoint + 'exist', query);
  }
}
