import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoggedUserResponseDto } from './models/dtos/responses/logged-user.response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<LoggedUserResponseDto>;
  public currentUser: Observable<LoggedUserResponseDto>;

  //Add user into storage and keep a reference
  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<LoggedUserResponseDto>(
      JSON.parse(localStorage.getItem('currentUser')),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  //Set the user in the localStorage & currentUser
  login(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  //Remove user from localStorage
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }
}
