import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { IParameterPriceService } from '../interfaces/parameter-price-service';
import { ParameterPrice } from '../../models/parameter-price';
import { ParameterPriceUpsertRequest } from '../../models/request/parameter-price-upsert-request';

@Injectable({
  providedIn: 'root'
})
export class ParameterPriceService extends BaseService implements IParameterPriceService, IFetchPaginatedData<ParameterPrice> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async assignParameterPrice(clientId: string, parameterId: number, request: ParameterPriceUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post(`clients/${clientId}/parameters/${parameterId}/prices`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateParameterPrice(clientId: string, parameterId: number, id: number, request: ParameterPriceUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.patch(`clients/${clientId}/parameters/${parameterId}/prices/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteParameterPrice(clientId: string, parameterId: number, id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`clients/${clientId}/parameters/${parameterId}/prices/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<ParameterPrice>> {
    try {
      const response = await firstValueFrom(
        this.get<PaginatedResponse<ParameterPrice>>(
          `clients/${request.extraParams}/parameters`,
          this.getPaginationParams(request)
        )
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
