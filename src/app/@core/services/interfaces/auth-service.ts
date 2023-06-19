import { LoginRequest } from "../../models/request/login-request";
import { LoginResponse } from "../../models/response/login-response";

export interface IAuthService {
  isLoggedIn: boolean;
  login(request: LoginRequest): Promise<LoginResponse>
  logout(): Promise<void>
}
