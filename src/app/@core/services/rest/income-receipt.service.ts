import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { BaseService } from './base.service';
import { IIncomeReceiptService } from '../interfaces/income-receipt-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { IncomeReceipt } from '../../models/income-receipt';
import { CancelIncomeReceiptRequest } from '../../models/request/cancel-income-receipt-request';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class IncomeReceiptService extends BaseService implements IIncomeReceiptService, IFetchPaginatedData<IncomeReceipt> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<IncomeReceipt>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<IncomeReceipt>>('income-receipts', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async cancelReceipt(request: CancelIncomeReceiptRequest): Promise<void> {
    try {
      await firstValueFrom(this.post('income-receipts/cancel', request));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
