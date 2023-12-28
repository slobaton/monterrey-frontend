import { ClientUpsertRequest } from 'src/app/@core/models/request/client-upsert-request';
import { Client } from '../../models/client';
export interface IClientService {
  createClient(request: ClientUpsertRequest): Promise<Client>;
  updateClient(id: string, request: ClientUpsertRequest): Promise<Client>;
  deleteClient(id: string): Promise<void>;
}
