export class AddDiscountRequest {
  constructor(
    public concept: string,
    public amount: number,
    public date?: string
  ) { }
}
