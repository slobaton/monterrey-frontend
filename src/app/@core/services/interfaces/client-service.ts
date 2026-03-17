import { Client } from '../../models/client';
import { ClientUpsertRequest } from 'src/app/@core/models/request/client-upsert-request';
import { AccountBalance } from '../../models/account-balance';
import { AddPaymentRequest } from './../../models/request/add-payment-request';
import { AddDiscountRequest } from '../../models/request/add-discount-request';
export interface IClientService {
  getById(id: string): Promise<Client>;
  createClient(request: ClientUpsertRequest): Promise<Client>;
  updateClient(id: string, request: ClientUpsertRequest): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  getMovements(id: string): Promise<AccountBalance>;
  addPayment(id: string, request: AddPaymentRequest): Promise<void>;
  addDiscount(id: string, request: AddDiscountRequest): Promise<void>;
}
