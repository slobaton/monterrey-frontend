import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IClientService } from '../interfaces/client-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { Client } from '../../models/client';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { ClientUpsertRequest } from '../../models/request/client-upsert-request';
import { BaseResponse } from '../../models/response/base-response';
import { AddPaymentRequest } from '../../models/request/add-payment-request';
import { AccountBalance } from '../../models/account-balance';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService implements IClientService, IFetchPaginatedData<Client> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<Client>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<Client>>('clients', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createClient(request: ClientUpsertRequest): Promise<Client> {
    try {
      const response = await firstValueFrom(this.post<BaseResponse<Client>>('clients', request));

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateClient(id: string, request: ClientUpsertRequest): Promise<Client> {
    try {
      const response = await firstValueFrom(this.put<BaseResponse<Client>>(`clients/${id}`, request));

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteClient(id: string): Promise<void> {
    try {
      await firstValueFrom(this.delete(`clients/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMovements(id: string, balanceMonth: number, balanceYear: number): Promise<AccountBalance> {
    try {

      const params = new HttpParams()
        .append('balanceMoth', balanceMonth)
        .append('balanceYear', balanceYear);

      const response = await firstValueFrom(this.get<AccountBalance>(`clients/${id}/movements`, params));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addPayment(id: string, washOrderId: string, request: AddPaymentRequest): Promise<void> {
    try {
      await firstValueFrom(this.post(`clients/${id}/wash-orders/${washOrderId}/payment`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
