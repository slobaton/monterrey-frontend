import { WashTypePriceUpsertRequest } from "../../models/request/wash-type-price-upsert-request";

export interface IWashTypePriceService {
  assignWashTypePrice(clientId: string, washTypeId: number, request: WashTypePriceUpsertRequest): Promise<void>;
  updateWashTypePrice(clientId: string, washTypeId: number, id: number, request: WashTypePriceUpsertRequest): Promise<void>;
  deleteWashTypePrice(clientId: string, washTypeId: number, id: number): Promise<void>;
}
