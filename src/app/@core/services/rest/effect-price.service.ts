import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { IEffectPriceService } from '../interfaces/effect-price-service';
import { EffectPrice } from '../../models/effect-price';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { EffectPriceUpsertRequest } from '../../models/request/effect-price-upsert-request';

@Injectable({
  providedIn: 'root'
})
export class EffectPriceService extends BaseService implements IEffectPriceService, IFetchPaginatedData<EffectPrice> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async assignEffectPrice(clientId: string, effectId: string, request: EffectPriceUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post(`clients/${clientId}/effects/${effectId}/prices`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateEffectPrice(clientId: string, effectId: string, id: number, request: EffectPriceUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.patch(`clients/${clientId}/effects/${effectId}/prices/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteEffectPrice(clientId: string, effectId: string, id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`clients/${clientId}/effects/${effectId}/prices/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<EffectPrice>> {
    try {
      const response = await firstValueFrom(
        this.get<PaginatedResponse<EffectPrice>>(
          `clients/${request.extraParams}/effects`,
          this.getPaginationParams(request)
        )
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
