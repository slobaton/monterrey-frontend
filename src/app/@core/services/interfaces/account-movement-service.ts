import { AccountMovement } from "../../models/account-balance";

export interface IAccountMovementService {
  getMovementById(id: string): Promise<AccountMovement>;
}
