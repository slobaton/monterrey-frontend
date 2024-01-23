import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { IAccountMovementService } from '../interfaces/account-movement-service';
import { AccountBalance, AccountMovement } from '../../models/account-balance';

@Injectable({
  providedIn: 'root'
})
export class AccountMovementService extends BaseService implements IAccountMovementService {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async getMovementById(id: string): Promise<AccountMovement> {
    try {
      return await firstValueFrom(this.get<AccountMovement>(`account-movements/${id}`));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMovements(clientId: string | null): Promise<AccountBalance> {
    try {
      let params = new HttpParams();

      if (clientId !== null) {
        params = params.append('clientId', clientId);
      }

      return await firstValueFrom(this.get<AccountBalance>('account-movements', params));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
