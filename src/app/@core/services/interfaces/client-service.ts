import { ClientUpsertRequest } from 'src/app/@core/models/request/client-upsert-request';
export interface IClientService {
  createClient(request: ClientUpsertRequest): Promise<void>;
  deleteClient(id: string): Promise<void>;
}
