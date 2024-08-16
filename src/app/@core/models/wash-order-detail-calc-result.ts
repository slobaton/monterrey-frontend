export class WashOrderDetailCalcResult {
  constructor(
    public wash_price: number,
    public focalizado_price: number,
    public nevado_price: number,
    public price_per_buttonhole: number,
    public min_buttonholes: number,
    public buttonholes_total_price: number,
    public effect_total_price: number,
    public unit_price: number,
    public subtotal_price: number
  ) { }
}
