import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { BaseService } from './base.service';
import { IWashOrderService } from '../interfaces/wash-order-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { WashOrder } from '../../models/wash-order';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { WashOrderCreateRequest } from '../../models/request/wash-order-create-request';
import { BaseResponse } from '../../models/response/base-response';

@Injectable({
  providedIn: 'root'
})
export class WashOrderService extends BaseService implements IWashOrderService, IFetchPaginatedData<WashOrder> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<WashOrder>> {
    throw new Error('Method not implemented.');
  }

  async create(request: WashOrderCreateRequest): Promise<WashOrder> {
    try {
      const response = await firstValueFrom(this.post<BaseResponse<WashOrder>>('wash-orders', request));

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
