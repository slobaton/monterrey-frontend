import { SystemParameter } from "../../models/system-parameter";
import { SystemParameterUpdateRequest } from "../../models/request/system-parameter-update-request";

export interface ISystemParameterService {
  getById(id: number): Promise<SystemParameter>;
  update(id: number, request: SystemParameterUpdateRequest): Promise<SystemParameter>;
}
