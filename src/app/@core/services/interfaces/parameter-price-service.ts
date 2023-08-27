import { ParameterPriceUpsertRequest } from "../../models/request/parameter-price-upsert-request";

export interface IParameterPriceService {
  assignParameterPrice(clientId: string, parameterId: number, request: ParameterPriceUpsertRequest): Promise<void>;
  updateParameterPrice(clientId: string, parameterId: number, id: number, request: ParameterPriceUpsertRequest): Promise<void>;
  deleteParameterPrice(clientId: string, parameterId: number, id: number): Promise<void>;
}
