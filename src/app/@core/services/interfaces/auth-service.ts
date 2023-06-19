import { LoginRequest } from "../../models/request/login-request";
import { AuthUser } from "../../models/auth-user";

export interface IAuthService {
  login(request: LoginRequest): Promise<AuthUser>
  logout(): Promise<void>
  getToken(): string;
}
