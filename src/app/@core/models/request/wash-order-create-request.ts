export class WashOrderCreateRequest {
  constructor(
    public client_id: string,
    public wash_type_id: number,
    public date: string,
    public observations: string,
    public is_special_price: boolean
  ) { }
}
