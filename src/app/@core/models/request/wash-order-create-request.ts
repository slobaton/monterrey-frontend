export class WashOrderCreateRequest {
  constructor(
    public client_id: string,
    public date: string,
    public wash_type_id: number,
    public total_quantity: number,
    public total_price: string,
    public observations: string
  ) { }
}
