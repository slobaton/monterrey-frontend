export class AddPaymentRequest {
  constructor(
    public amount: number,
    public date?: string
  ) { }
}
