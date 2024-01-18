import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IClientService } from '../interfaces/client-service';
import { HttpClient } from '@angular/common/http';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { Client } from '../../models/client';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { firstValueFrom } from 'rxjs';
import { ClientUpsertRequest } from '../../models/request/client-upsert-request';
import { BaseResponse } from '../../models/response/base-response';
import { AddPaymentRequest } from '../../models/request/add-payment-request';

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

  async addPayment(id: string, washOrderId: string, request: AddPaymentRequest): Promise<void> {
    try {
      await firstValueFrom(this.post<BaseResponse<Client>>(`clients/{${id}}/wash-orders/${washOrderId}/payment`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
