import { WashTypeUpsertRequest } from '../../models/request/wash-type-upsert-request';
import { WashType } from '../../models/wash-type';
export interface IWashTypeService {
  create(request: WashTypeUpsertRequest): Promise<void>;
  update(id: number, request: WashTypeUpsertRequest): Promise<WashType>;
  deleteById(id: number): Promise<void>;
}
