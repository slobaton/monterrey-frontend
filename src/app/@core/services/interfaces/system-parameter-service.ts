import { SystemParameter } from "../../models/system-parameter";
import { SystemParameterUpdateRequest } from "../../models/request/system-parameter-update-request";
import { CurrencyChangeRate } from "../../models/currency-change-rate";

export interface ISystemParameterService {
  getById(id: number): Promise<SystemParameter>;
  update(id: number, request: SystemParameterUpdateRequest): Promise<SystemParameter>;
  getCurrencyChangeRate(): Promise<CurrencyChangeRate>
}
