import { ClothType } from '../../models/cloth-type';
import { ClothTypeUpsertRequest } from '../../models/request/cloth-type-upsert-request';

export interface IClothTypeService {
  create(request: ClothTypeUpsertRequest): Promise<void>;
  update(id: number, request: ClothTypeUpsertRequest): Promise<ClothType>;
  deleteById(id: number): Promise<void>;
}
