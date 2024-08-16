import { Injectable } from '@angular/core';
import { IncomeReport } from '../../models/income';
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

  async getMonthlyIncomes(month: number, year: number): Promise<IncomeReport> {
    try {
      const response = await firstValueFrom(this.get<IncomeReport>(`incomes?month=${month}&year=${year}`));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getYearlyIncomes(year: number): Promise<IncomeReport> {
    try {
      const response = await firstValueFrom(this.get<IncomeReport>(`incomes?year=${year}`));

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addIncome(request: AddIncomeRequest): Promise<void> {
    try {
      await firstValueFrom(this.post(`incomes`, request));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
