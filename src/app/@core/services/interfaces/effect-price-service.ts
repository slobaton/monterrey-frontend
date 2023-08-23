import { EffectPriceUpsertRequest } from "../../models/request/effect-price-upsert-request";

export interface IEffectPriceService {
  assignEffectPrice(clientId: string, effectId: string, request: EffectPriceUpsertRequest): Promise<void>;
  updateEffectPrice(clientId: string, effectId: string, id: number, request: EffectPriceUpsertRequest): Promise<void>;
  deleteEffectPrice(clientId: string, effectId: string, id: number): Promise<void>;
}
