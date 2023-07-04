import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IWashTypeService } from '../interfaces/wash-type-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { WashTypeUpsertRequest } from '../../models/request/wash-type-upsert-request';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { WashType } from '../../models/wash-type';

@Injectable({
  providedIn: 'root'
})
export class WashTypeService extends BaseService implements IWashTypeService, IFetchPaginatedData<WashType> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<WashType>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<WashType>>('wash-types', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: WashTypeUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post('wash-types', request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, request: WashTypeUpsertRequest): Promise<WashType> {
    try {
      return await firstValueFrom(this.put<WashType>(`wash-types/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`wash-types/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
