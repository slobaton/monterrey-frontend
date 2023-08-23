import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IWashTypePriceService } from '../interfaces/wash-type-price-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { WashTypePrice } from '../../models/wash-type-price';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { HttpClient } from '@angular/common/http';
import { WashTypePriceUpsertRequest } from '../../models/request/wash-type-price-upsert-request';

@Injectable({
  providedIn: 'root'
})
export class WashTypePriceService extends BaseService implements IWashTypePriceService, IFetchPaginatedData<WashTypePrice> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async assignWashTypePrice(clientId: string, washTypeId: number, request: WashTypePriceUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post(`clients/${clientId}/wash-types/${washTypeId}/prices`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateWashTypePrice(clientId: string, washTypeId: number, id: number, request: WashTypePriceUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.patch(`clients/${clientId}/wash-types/${washTypeId}/prices/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteWashTypePrice(clientId: string, washTypeId: number, id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`clients/${clientId}/wash-types/${washTypeId}/prices/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<WashTypePrice>> {
    try {
      const response = await firstValueFrom(
        this.get<PaginatedResponse<WashTypePrice>>(
          `clients/${request.extraParams}/wash-types`,
          this.getPaginationParams(request)
        )
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
