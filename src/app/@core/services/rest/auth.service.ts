import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

import { IAuthService } from '../interfaces/auth-service';
import { BaseService } from './base.service';
import { LoginRequest } from '../../models/request/login-request';
import { AuthUser } from '../../models/auth-user';
import { AuthRole } from '../../models/auth-role';
import { Role } from '../../enums/role.enum';
import { AuthPublicKey } from '../../models/auth-public-key';
import { AppAbility, defineAbilitiesFor } from '../../auth/ability';

const LSTORAGE_AUTH_USER = 'authUser';
const LSTORAGE_PUBLIC_KEY = 'publicKey';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService implements IAuthService {

  redirectUrl: string = 'dashboard';

  private userSubject: BehaviorSubject<AuthUser | null>;
  public user: Observable<AuthUser | null>;

  constructor(_http: HttpClient, private _ability: AppAbility) {
    super(_http);
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(LSTORAGE_AUTH_USER)!));
    this.user = this.userSubject.asObservable();
  }

  public get authenticatedUser() {
    return this.userSubject.value;
  }

  async login(request: LoginRequest): Promise<AuthUser> {
    try {
      const authUser = await firstValueFrom(this.post<AuthUser>('login', request));
      localStorage.setItem(LSTORAGE_AUTH_USER, JSON.stringify(authUser));
      this.userSubject.next(authUser);
      this.updateAbilities(authUser);

      return authUser;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.post('logout'));
      this.cleanSession();
      this._ability.update([]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPublicKey(): Promise<AuthPublicKey> {
    try {
      const publicKey = localStorage.getItem(LSTORAGE_PUBLIC_KEY);

      if (publicKey) {
        return new AuthPublicKey(publicKey);
      }

      const authPublicKey = await firstValueFrom(this.get<AuthPublicKey>('auth/key'));
      localStorage.setItem(LSTORAGE_PUBLIC_KEY, authPublicKey.key);

      return authPublicKey;
    } catch (error) {
      return this.handleError(error);
    }
  }

  getToken(): string {
    return this.authenticatedUser?.token.access_token || '';
  }

  getRoles(): Array<AuthRole> {
    return this.authenticatedUser?.roles || [];
  }

  hasRole(role: Role): boolean {
    const userRoles = this.getRoles();

    return userRoles.some(r => r.name === role);
  }

  cleanSession(): void {
    localStorage.removeItem(LSTORAGE_AUTH_USER);
    localStorage.removeItem(LSTORAGE_PUBLIC_KEY);
    this.userSubject.next(null);
  }

  hasAbilities(): boolean {
    if (!this.authenticatedUser) {
      return false;
    }

    return this._ability.rules.length > 0;
  }

  refreshUserAbilities(): void {
    const authUser = this.authenticatedUser;

    if (authUser) {
      this.updateAbilities(authUser);
    }
  }

  private updateAbilities(authUser: AuthUser): void {
    const roles = authUser.roles;

    roles.forEach(role => {
      const indexOfRole = Object.values(Role).indexOf(role.name as unknown as Role);
      const keyOfRole = Object.keys(Role)[indexOfRole];
      const selectedRole = Role[keyOfRole as keyof typeof Role];
      this._ability.update(defineAbilitiesFor(selectedRole));
    });
  }


}
