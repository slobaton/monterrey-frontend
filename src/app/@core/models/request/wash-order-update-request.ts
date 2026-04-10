export class WashOrderUpdateRequest {
  constructor(
    public client_id: string,
    public wash_type_id: number,
    public date: string,
    public observations: string
  ) { }
}
