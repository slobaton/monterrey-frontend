import { Injectable } from '@angular/core';
import { Income, MonthlyIncome } from '../../models/income';
import { PaginatedRequest } from '../../models/request/paginated-request';
import { PaginatedResponse } from '../../models/response/paginated-response';
import { IIncomeService } from '../interfaces/income-service';
import { AddIncomeRequest } from '../../models/request/add-income-request';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService extends BaseService implements IIncomeService {

  constructor(_http: HttpClient) {
    super(_http);
  }

  async getMonthlyIncomes(month: number, year: number): Promise<MonthlyIncome> {
    try {
      const response = await firstValueFrom(this.get<MonthlyIncome>(`incomes?month=${month}&year=${year}`));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  addIncome(request: AddIncomeRequest): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
