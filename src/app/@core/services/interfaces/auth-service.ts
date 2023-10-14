import { LoginRequest } from "../../models/request/login-request";
import { AuthUser } from "../../models/auth-user";
import { AuthPublicKey } from "../../models/auth-public-key";

export interface IAuthService {
  login(request: LoginRequest): Promise<AuthUser>
  logout(): Promise<void>
  getToken(): string;
  cleanSession(): void;
  getPublicKey(): Promise<AuthPublicKey>;
}
