export class WashOrder {
  constructor(
    public id: string,
    public client_id: string,
    public wash_type_id: number,
    public code: number,
    public date: Date,
    public total_quantity: number,
    public total_price: number,
    public status: number,
    public deliver_date: Date,
    public deliver_quantity: number,
    public observations: string,
    public user_id: string,
    public created_at: string,
    public updated_at: string,
    public wash_order_details: Array<WashOrderDetail>
  ) { }
}

export class WashOrderDetail {
  constructor(
    public id: string,
    public wash_order_id: string,
    public cloth_type_id: number,
    public cloth_size_id: number,
    public is_special_wash: boolean,
    public wash_price: number,
    public effect_price: number,
    public num_buttonholes: number,
    public buttonholes_price: number,
    public additional_price: number,
    public additional_price_desc: number,
    public unit_price: number,
    public quantity: number,
    public subtotal_price: number,
    public observations: string
  ) { }
}

export class WashOrderDetailEffect {
  constructor(
    public id: number,
    public wash_order_detail_id: string,
    public effect_id: number,
    public price: number
  ) { }
}
