import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { firstValueFrom } from 'rxjs';

import { Effect } from '../../models/effect';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { EffectUpsertRequest } from '../../models/request/effect-upsert-request';

@Injectable({
  providedIn: 'root'
})
export class EffectService extends BaseService {

  constructor(_http: HttpClient) {
    super(_http);
  }
  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<Effect>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<Effect>>('effects', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createEffect(request: EffectUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post('effects', request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateEffect(id: string, request: EffectUpsertRequest): Promise<Effect> {
    try {
      return await firstValueFrom(this.put<Effect>(`effects/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteEffect(id: string): Promise<void> {
    try {
      await firstValueFrom(this.delete(`effects/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
