import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IUserService } from '../interfaces/user-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { User } from '../../models/user';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { UserUpsertRequest } from '../../models/request/user-upsert-request';
import { UserUpdatePassword } from "../../models/request/user-update-password-request";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService implements IUserService, IFetchPaginatedData<User> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<User>> {
    try {
     return await firstValueFrom(this.get<PaginatedResponse<User>>('users', this.getPaginationParams(request)));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: UserUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post('users', request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, request: UserUpsertRequest): Promise<User> {
    try {
      return await firstValueFrom(this.put<User>(`users/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`users/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updatePassword(request: UserUpdatePassword): Promise<void> {
    try {
      await firstValueFrom(this.post('users/update-password', request))
    } catch (error) {
      return this.handleError(error);
    }
  }
}
