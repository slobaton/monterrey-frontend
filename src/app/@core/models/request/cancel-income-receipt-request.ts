export class CancelIncomeReceiptRequest {
  constructor(
    public receipt_number: number,
    public date: string,
    public canceled_reason: string
  ) { }
}
