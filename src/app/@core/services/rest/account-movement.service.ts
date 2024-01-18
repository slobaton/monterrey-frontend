import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IAccountMovementService } from '../interfaces/account-movement-service';
import { AccountBalance } from '../../models/account-balance';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountMovementService extends BaseService implements IAccountMovementService {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async getMovements(clientId: string, balanceMonth: number, balanceYear: number): Promise<AccountBalance> {
    try {

      const params = new HttpParams()
        .append('clientId', clientId)
        .append('balanceMoth', balanceMonth)
        .append('balanceYear', balanceYear);

      const response = await firstValueFrom(this.get<AccountBalance>('clients', params));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
