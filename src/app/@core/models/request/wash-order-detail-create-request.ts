export class WashOrderDetailCreateRequest {
  constructor(
    public wash_order_id: string,
    public cloth_type_id: number,
    public cloth_size_id: number,
    public is_special_wash: boolean,
    public wash_price: number,
    public quantity: number,
    public num_buttonholes: number,
    public effects: Array<string>,
    public observations?: string
  ) { }
}
