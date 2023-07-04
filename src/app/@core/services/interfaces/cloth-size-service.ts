import { ClothSize } from "../../models/cloth-size";
import { ClothSizeUpsertRequest } from "../../models/request/cloth-size-upsert-request";

export interface IClothSizeService {
  create(request: ClothSizeUpsertRequest): Promise<void>;
  update(id: number, request: ClothSizeUpsertRequest): Promise<ClothSize>;
  deleteById(id: number): Promise<void>;
}
