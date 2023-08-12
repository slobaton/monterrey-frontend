import { WashTypePriceUpsertRequest } from "../../models/request/wash-type-price-upsert-request";

export interface IWashTypePriceService {
  assignWashTypePrice(request: WashTypePriceUpsertRequest): Promise<void>;
  updateWashTypePrice(id: number, request: WashTypePriceUpsertRequest): Promise<void>;
  deleteWashTypePrice(clientId: string, washTypeId: number, id: number): Promise<void>;
}
