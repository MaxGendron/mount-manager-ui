import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from './models/dtos/login.dto';
import { RegisterDto } from './models/dtos/register.dto';
import { ValidateUserPropertyValueDto } from './models/dtos/validate-user-property-value.dto';
import { LoggedUserResponseDto } from './models/dtos/responses/logged-user.response.dto';
import { ExistReponseDto } from './models/dtos/responses/exist.response.dto';
import { UserResponseDto } from './models/dtos/responses/user.response.dto';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  private usersEndpoint = 'users/';

  constructor(private http: HttpClient) {}

  loginUser(loginDto: LoginDto): Observable<LoggedUserResponseDto> {
    return this.http.post<LoggedUserResponseDto>(
      environment.webApiEndPoint + this.usersEndpoint + 'login',
      loginDto,
    );
  }

  registerUser(registerDto: RegisterDto): Observable<LoggedUserResponseDto> {
    return this.http.post<LoggedUserResponseDto>(
      environment.webApiEndPoint + this.usersEndpoint,
      registerDto,
    );
  }

  validatePropertyValue(
    validateUserPropertyValueDto: ValidateUserPropertyValueDto,
  ): Observable<ExistReponseDto> {
    const data = {
      property: validateUserPropertyValueDto.property,
      value: validateUserPropertyValueDto.value,
    };
    return this.http.get<ExistReponseDto>(
      environment.webApiEndPoint + this.usersEndpoint + 'validate',
      { params: data },
    );
  }

  getUserByUserId() : Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(environment.webApiEndPoint + this.usersEndpoint + 'find/user-id');
  }
}
