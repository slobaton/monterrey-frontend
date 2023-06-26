export class ClothTypeUpsertRequest {
  constructor(
    public name: string,
    public description?: string,
    public is_active?: boolean,
    public id?: string,
  ) { }
}
