export class SystemParameter {
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public value: number,
    public description: string,
    public created_at: string,
    public updated_at: string
  ) { }
}
