export class WashTypePrice {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public description: string,
    public is_active: boolean,
    public created_at: string,
    public updated_at: string,
    public wash_type_price: WashTypePriceDetail
  ) { }
}

export class WashTypePriceDetail {
  constructor(
    public client_id: string,
    public wash_type_id: number,
    public id: number,
    public price: number
  ) { }
}
