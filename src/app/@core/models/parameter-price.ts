export class ParameterPrice {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public description: string,
    public is_active: boolean,
    public created_at: string,
    public updated_at: string,
    public parameter_price: ParameterPriceDetail
  ) { }
}

export class ParameterPriceDetail {
  constructor(
    public client_id: string,
    public charge_parameter_id: number,
    public id: number,
    public price: number
  ) { }
}
