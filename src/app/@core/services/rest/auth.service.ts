import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

import { IAuthService } from '../interfaces/auth-service';
import { BaseService } from './base.service';
import { LoginRequest } from '../../models/request/login-request';
import { AuthUser } from '../../models/auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService implements IAuthService {

  redirectUrl: string = 'inicio';

  private userSubject: BehaviorSubject<AuthUser | null>;
  public user: Observable<AuthUser | null>;


  constructor(_http: HttpClient) {
    super(_http);
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('authUser')!));
    this.user = this.userSubject.asObservable();
  }

  public get authenticatedUser() {
    return this.userSubject.value;
  }

  async login(request: LoginRequest): Promise<AuthUser> {
    try {
      const authUser = await firstValueFrom(this.post<AuthUser>('login', request));
      localStorage.setItem('authUser', JSON.stringify(authUser));
      this.userSubject.next(authUser);

      return authUser;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.post('logout'));
      this.cleanSession();
    } catch (error) {
      return this.handleError(error);
    }
  }

  getToken(): string {
    return this.authenticatedUser?.token.access_token || '';
  }

  cleanSession(): void {
    localStorage.removeItem('authUser');
    this.userSubject.next(null);
  }
}
