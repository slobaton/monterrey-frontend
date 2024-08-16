export class AddIncomeRequest {
  constructor(
    public receipt_number: number,
    public concept: string,
    public client_name: string,
    public amount: number,
    public date?: string,
  ) { }
}
