import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { WashOrderDetail } from '../../models/wash-order';
import { BaseService } from './base.service';
import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';
import { IWashOrderDetailService } from '../interfaces/wash-order-detail-service';
import { WashOrderDetailCreateRequest } from '../../models/request/wash-order-detail-create-request';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { BaseResponse } from '../../models/response/base-response';
import { WashOrderDetailCalculateRequest } from '../../models/request/wash-order-detail-calculate-request';
import { WashOrderDetailCalcResult } from '../../models/wash-order-detail-calc-result';
import { WashOrderDetailUpdateRequest } from '../../models/request/wash-order-detail-update-request';

@Injectable({
  providedIn: 'root'
})
export class WashOrderDetailService extends BaseService implements IWashOrderDetailService, IFetchPaginatedData<WashOrderDetail> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<WashOrderDetail>> {
    try {
      const includes = ['cloth_size', 'cloth_type', 'effects'];
      const response = this.get<PaginatedResponse<WashOrderDetail>>('wash-order-details', this.getPaginationParams(request, 'wash_order_id', includes));
      return await firstValueFrom(response);

    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: WashOrderDetailCreateRequest): Promise<WashOrderDetail> {
    try {
      const response = await firstValueFrom(this.post<BaseResponse<WashOrderDetail>>('wash-order-details', request));

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, request: WashOrderDetailUpdateRequest): Promise<WashOrderDetail> {
    try {
      const response = await firstValueFrom(this.put<BaseResponse<WashOrderDetail>>(`wash-order-details/${id}`, request));

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await firstValueFrom(this.delete(`wash-order-details/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async calculatePrices(request: WashOrderDetailCalculateRequest): Promise<WashOrderDetailCalcResult> {
    try {
      return await firstValueFrom(this.post<WashOrderDetailCalcResult>('wash-order-details/calculate', request))
    } catch (error) {
      return this.handleError(error);
    }
  }
}
