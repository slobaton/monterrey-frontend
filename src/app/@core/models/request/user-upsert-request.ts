export class UserUpsertRequest {
  constructor(
    public name: string,
    public paternal_surname?: string,
    public maternal_surname?: string,
    public username?: string,
    public email?: string,
    public id?: string,
  ) { }
}
