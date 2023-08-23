export class EffectPrice {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public description: string,
    public is_active: boolean,
    public created_at: string,
    public updated_at: string,
    public effect_price: EffectPriceDetail
  ) { }
}

export class EffectPriceDetail {
  constructor(
    public client_id: string,
    public effect_id: string,
    public id: number,
    public price: number
  ) { }
}
