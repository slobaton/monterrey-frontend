import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<User>> {
    var users: Array<User> = [
      {
        id: '11111111111111',
        username: 'topx777',
        email: 'topx777@gmail.com'
      },
      {
        id: '11122222222222',
        username: 'topx222',
        email: 'topx222@gmail.com'
      },
      {
        id: '33333333333333',
        username: 'topx333',
        email: 'topx333@gmail.com'
      },
      {
        id: '44444444444444',
        username: 'topx444',
        email: 'topx444@gmail.com'
      },
      {
        id: '55555555555555',
        username: 'topx555',
        email: 'topx555@gmail.com'
      },
    ];

    var response: PaginatedResponse<User> = {
      data: users,
      totalCount: 100,
      pages: 4,
      currentPage: 1
    };

    return Promise.resolve(response);
  }
}
