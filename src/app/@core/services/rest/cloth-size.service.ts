import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IClothSizeService } from '../interfaces/cloth-size-service';
import { IFetchPaginatedData } from '../interfaces/fetch-paginated-data';
import { ClothSize } from '../../models/cloth-size';
import { ClothSizeUpsertRequest } from '../../models/request/cloth-size-upsert-request';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class ClothSizeService extends BaseService implements IClothSizeService, IFetchPaginatedData<ClothSize> {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<ClothSize>> {
    try {
      const response = await firstValueFrom(this.get<PaginatedResponse<ClothSize>>('cloth-sizes', this.getPaginationParams(request)));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: ClothSizeUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.post('cloth-sizes', request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, request: ClothSizeUpsertRequest): Promise<ClothSize> {
    try {
      return await firstValueFrom(this.put<ClothSize>(`cloth-sizes/${id}`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await firstValueFrom(this.delete(`cloth-sizes/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
