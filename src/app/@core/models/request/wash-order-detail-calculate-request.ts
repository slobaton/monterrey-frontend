export class WashOrderDetailCalculateRequest {
  constructor(
    public wash_order_id: string,
    public is_focalizado_active: boolean,
    public is_nevado_active: boolean,
    public quantity: number,
    public num_buttonholes: number,
    public buttonholes_price: number,
    public effects: Array<string>
  ) { }
}
