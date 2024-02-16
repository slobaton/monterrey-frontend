import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { IParameterValueService } from '../interfaces/parameter-value-service';
import { ParameterValue } from '../../models/parameter-value';
import { ParameterValueUpsertRequest } from '../../models/request/parameter-value-upsert-request';

@Injectable({
  providedIn: 'root'
})
export class ParameterValueService extends BaseService implements IParameterValueService, IFetchPaginatedData<ParameterValue> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async assignParameterValue(clientId: string, parameterId: number, request: ParameterValueUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post(`clients/${clientId}/parameters/${parameterId}/values`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateParameterValue(clientId: string, parameterId: number, id: number, request: ParameterValueUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.patch(`clients/${clientId}/parameters/${parameterId}/values/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteParameterValue(clientId: string, parameterId: number, id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`clients/${clientId}/parameters/${parameterId}/values/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<ParameterValue>> {
    try {
      const response = await firstValueFrom(
        this.get<PaginatedResponse<ParameterValue>>(
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
