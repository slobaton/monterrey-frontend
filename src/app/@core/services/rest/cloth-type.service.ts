import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { IClothTypeService } from '../interfaces/cloth-type-service';
import { ClothType } from '../../models/cloth-type';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { ClothTypeUpsertRequest } from '../../models/request/cloth-type-upsert-request';

@Injectable({
  providedIn: 'root'
})
export class ClothTypeService extends BaseService implements IFetchPaginatedData<ClothType>, IClothTypeService {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async create(request: ClothTypeUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post('cloth-types', request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, request: ClothTypeUpsertRequest): Promise<ClothType> {
    try {
      return await firstValueFrom(this.put<ClothType>(`cloth-types/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`cloth-types/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<ClothType>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<ClothType>>('cloth-types', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
