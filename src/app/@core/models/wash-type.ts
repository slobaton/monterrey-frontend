export class WashType {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public description: string,
    public is_active: boolean,
    public created_at: string,
    public updated_at: string
  ) { }
}
