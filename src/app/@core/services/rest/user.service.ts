import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IUserService } from '../interfaces/user-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { User } from '../../models/user';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService implements IUserService, IFetchPaginatedData<User> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<User>> {
    try {
      const sortOrder = request.sortOrder === 'desc' ? '-' : '';
      const params = new HttpParams()
        .append('filter', request.filter)
        .append('page[size]', request.pageSize)
        .append('page[number]', request.page)
        .append('sort', `${sortOrder}${request.sort}`);

      const response = await firstValueFrom(this.get<PaginatedResponse<User>>('users', params));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
