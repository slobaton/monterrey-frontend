import { AuthRole } from "./auth-role";
import { AuthToken } from "./auth-token";

export class AuthUser {
  constructor(
    public id: string,
    public name: string,
    public paternal_surname: string,
    public maternal_surname: string,
    public username: string,
    public email: string,
    public email_verified_at: string,
    public created_at: string,
    public updated_at: string,
    public token: AuthToken,
    public roles: Array<AuthRole>
  ) { }
}
