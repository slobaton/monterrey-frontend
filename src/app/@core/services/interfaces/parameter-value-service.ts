import { ParameterValueUpsertRequest } from "../../models/request/parameter-value-upsert-request";

export interface IParameterValueService {
  assignParameterValue(clientId: string, parameterId: number, request: ParameterValueUpsertRequest): Promise<void>;
  updateParameterValue(clientId: string, parameterId: number, id: number, request: ParameterValueUpsertRequest): Promise<void>;
  deleteParameterValue(clientId: string, parameterId: number, id: number): Promise<void>;
}
