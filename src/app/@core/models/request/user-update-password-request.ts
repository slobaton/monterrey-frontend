export class UserUpdatePassword {
  constructor(
    public current_password: string,
    public new_password: string,
    public new_password_confirmation : string
  ) { }
}
