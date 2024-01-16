import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IUserService } from '../interfaces/user-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { User } from '../../models/user';
import { Role } from "../../models/role";

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService implements IUserService, IFetchPaginatedData<User> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(): Promise<any> {
    try {
      const response: Role[] = await firstValueFrom(this.get<Array<Role>>('roles'));
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
