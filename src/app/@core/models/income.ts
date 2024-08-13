import { IncomeType } from "../enums/income-type.enum";

export class Income {
  constructor(
    public id: number,
    public date: string,
    public receipt_number: number,
    public concept: string,
    public type: IncomeType,
    public amount: number,
    public created_at: string,
    public updated_at: string,
    public sub_total: number
  ) { }
}

export class IncomeReport {
  constructor(
    public total_income: number,
    public total_real_income: number,
    public lost_income: number,
    public incomes: Array<Income>
  ) { }
}
