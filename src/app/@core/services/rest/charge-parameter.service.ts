import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { ChargeParameter } from '../../models/charge-parameter';
import { ChargeParameterUpdateRequest } from '../../models/request/charge-parameter-update-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { IChargeParameterService } from '../interfaces/charge-parameter-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { PaginatedRequest } from '../../models/request/paginated-request';

@Injectable({
  providedIn: 'root'
})
export class ChargeParameterService extends BaseService implements IChargeParameterService, IFetchPaginatedData<ChargeParameter> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<ChargeParameter>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<ChargeParameter>>('parameters', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: number): Promise<ChargeParameter> {
    try {
      return await firstValueFrom(this.get(`parameters/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, request: ChargeParameterUpdateRequest): Promise<ChargeParameter> {
    try {
      return await firstValueFrom(this.patch(`parameters/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
