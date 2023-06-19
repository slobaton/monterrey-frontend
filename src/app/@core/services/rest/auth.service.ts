import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { IAuthService } from '../interfaces/auth-service';
import { BaseService } from './base.service';
import { LoginRequest } from '../../models/request/login-request';
import { LoginResponse } from '../../models/response/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService implements IAuthService {

  isLoggedIn: boolean = false;
  redirectUrl: string | null = 'inicio';

  constructor(_http: HttpClient) {
    super(_http);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(this.post<LoginResponse>('login', request));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.post<LoginResponse>('logout'));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
