import { AddPaymentRequest } from './../../models/request/add-payment-request';
import { ClientUpsertRequest } from 'src/app/@core/models/request/client-upsert-request';
import { Client } from '../../models/client';
import { AccountBalance } from '../../models/account-balance';
export interface IClientService {
  createClient(request: ClientUpsertRequest): Promise<Client>;
  updateClient(id: string, request: ClientUpsertRequest): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  getMovements(id: string, balanceMonth: number, balanceYear: number): Promise<AccountBalance>;
  addPayment(id: string, washOrderId: string, request: AddPaymentRequest): Promise<void>;
}
