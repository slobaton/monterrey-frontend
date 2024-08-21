import { Effect } from "../../models/effect";
import { EffectPriceUpsertRequest } from "../../models/request/effect-price-upsert-request";
import { BaseResponse } from "../../models/response/base-response";

export interface IEffectPriceService {
  assignEffectPrice(clientId: string, effectId: string, request: EffectPriceUpsertRequest): Promise<void>;
  updateEffectPrice(clientId: string, effectId: string, id: number, request: EffectPriceUpsertRequest): Promise<void>;
  deleteEffectPrice(clientId: string, effectId: string, id: number): Promise<void>;
  getWithClientPrices(clientId: string): Promise<Array<Effect>>;
}
