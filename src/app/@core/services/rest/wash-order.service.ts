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

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<WashOrder>> {
    try {
      const includes = ['client', 'wash_type'];
      const response = await firstValueFrom(this.get<PaginatedResponse<WashOrder>>('wash-orders', this.getPaginationParams(request, 'code', includes)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: WashOrderCreateRequest): Promise<WashOrder> {
    try {
      const response = await firstValueFrom(this.post<BaseResponse<WashOrder>>('wash-orders', request));

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await firstValueFrom(this.delete(`wash-orders/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
