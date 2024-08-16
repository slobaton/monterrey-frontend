export class AddDiscountRequest {
  constructor(
    public receipt_number: number,
    public concept: string,
    public amount: number,
    public date?: string
  ) { }
}
