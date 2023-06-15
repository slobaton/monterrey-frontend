export class Client {
  constructor(
    public id: string,
    public nit: string,
    public name: string,
    public paternal_surname: string,
    public maternal_surname: string,
    public phone: string,
    public cellphone: string,
    public address: string,
    public observations: string,
    public is_active: boolean,
    public user_id: string,
    public created_at: string,
    public updated_at: string
  ) { }
}
