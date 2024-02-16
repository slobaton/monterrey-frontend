import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { SystemParameter } from '../../models/system-parameter';
import { SystemParameterUpdateRequest } from '../../models/request/system-parameter-update-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { ISystemParameterService } from '../interfaces/system-parameter-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { PaginatedRequest } from '../../models/request/paginated-request';

@Injectable({
  providedIn: 'root'
})
export class SystemParameterService extends BaseService implements ISystemParameterService, IFetchPaginatedData<SystemParameter> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<SystemParameter>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<SystemParameter>>('parameters', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: number): Promise<SystemParameter> {
    try {
      return await firstValueFrom(this.get(`parameters/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, request: SystemParameterUpdateRequest): Promise<SystemParameter> {
    try {
      return await firstValueFrom(this.patch(`parameters/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
