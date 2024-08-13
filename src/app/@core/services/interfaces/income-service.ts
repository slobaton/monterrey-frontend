import { IncomeReport } from "../../models/income";
import { AddIncomeRequest } from "../../models/request/add-income-request";

export interface IIncomeService {
  getMonthlyIncomes(month: number, year: number): Promise<IncomeReport>
  getYearlyIncomes(year: number): Promise<IncomeReport>
  addIncome(request: AddIncomeRequest): Promise<void>
}
