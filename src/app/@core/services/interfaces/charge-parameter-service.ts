import { ChargeParameter } from "../../models/charge-parameter";
import { ChargeParameterUpdateRequest } from "../../models/request/charge-parameter-update-request";

export interface IChargeParameterService {
  getById(id: number): Promise<ChargeParameter>;
  update(id: number, request: ChargeParameterUpdateRequest): Promise<ChargeParameter>;
}
