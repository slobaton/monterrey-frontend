export class ClothSize {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public wash_price: number,
    public wash_special_price: number,
    public is_active: boolean,
    public created_at: string,
    public updated_at: string
  ) { }
}
