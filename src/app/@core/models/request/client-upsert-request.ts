export class ClientUpsertRequest {
  constructor(
    public name: string,
    public nit?: string,
    public paternal_surname?: string,
    public maternal_surname?: string,
    public address?: string,
    public phone?: string,
    public cellphone?: string,
    public observations?: string,
    public is_active?: boolean,
    public id?: string,
  ) { }
}
