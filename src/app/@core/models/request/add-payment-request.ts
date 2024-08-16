export class AddPaymentRequest {
  constructor(
    public receipt_number: number,
    public amount: number,
    public date?: string
  ) { }
}
