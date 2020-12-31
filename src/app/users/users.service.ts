import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from './models/dtos/login.dto';
import { RegisterDto } from './models/dtos/register.dto';
import { ValidateUserPropertyValueDto } from './models/dtos/validate-user-property-value.dto';
import { LoggedUserResponseDto } from './models/dtos/responses/logged-user.response.dto';
import { ExistReponseDto } from './models/dtos/responses/exist.response.dto';
import { UserResponseDto } from './models/dtos/responses/user.response.dto';
import { UpdateUserDto } from './models/dtos/update-user.dto';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  private usersEndpoint = `${environment.webApiEndPoint}users/`;

  constructor(private http: HttpClient) {}

  loginUser(loginDto: LoginDto): Observable<LoggedUserResponseDto> {
    return this.http.post<LoggedUserResponseDto>(`${this.usersEndpoint}login`, loginDto);
  }

  registerUser(registerDto: RegisterDto): Observable<LoggedUserResponseDto> {
    return this.http.post<LoggedUserResponseDto>(this.usersEndpoint, registerDto);
  }

  validatePropertyValue(validateUserPropertyValueDto: ValidateUserPropertyValueDto): Observable<ExistReponseDto> {
    return this.http.get<ExistReponseDto>(`${this.usersEndpoint}validate`, {
      params: JSON.parse(JSON.stringify(validateUserPropertyValueDto)),
    });
  }

  getUserByUserId(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.usersEndpoint}find/user-id`);
  }

  updateUser(updateUserDto: UpdateUserDto, userId: string): Observable<UserResponseDto> {
    return this.http.put<UserResponseDto>(`${this.usersEndpoint}${userId}`, updateUserDto);
  }

  validateJwtToken(): Observable<string> {
    return this.http.get<string>(`${this.usersEndpoint}validateJwtToken`);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.usersEndpoint}${userId}`);
  }
}
