export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public name: string,
    public paternal_surname: string,
    public maternal_surname: string,
    public created_at: string,
    public updated_at: string
  ) { }
}
