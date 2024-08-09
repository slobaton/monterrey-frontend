import { MonthlyIncome } from "../../models/income";
import { AddIncomeRequest } from "../../models/request/add-income-request";

export interface IIncomeService {
  getMonthlyIncomes(month: number, year: number): Promise<MonthlyIncome>
  addIncome(request: AddIncomeRequest): Promise<void>
}
