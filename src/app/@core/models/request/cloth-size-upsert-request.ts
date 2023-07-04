export class ClothSizeUpsertRequest {
  constructor(
    public name: string,
    public wash_price: number,
    public wash_special_price?: number,
    public description?: string,
    public is_active?: boolean,
    public id?: string,
  ) { }
}
