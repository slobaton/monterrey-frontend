import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { WashOrder } from '../../models/wash-order';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import {WashOrderService} from "./wash-order.service";

@Injectable({
  providedIn: 'root'
})
export class WashOrderByClientService extends WashOrderService {

  constructor(_http: HttpClient) {
    super(_http);
  }

  override async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<WashOrder>> {
    try {
      const includes = ['client', 'wash_type'];
      return await firstValueFrom(
        this.get<PaginatedResponse<WashOrder>>(
          `wash-orders/${request.extraParams}/by-client`,
          this.getPaginationParams(request, 'code', includes)
        )
      );

    } catch (error) {
      return this.handleError(error);
    }
  }
}
