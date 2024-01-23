import { AccountBalance, AccountMovement } from "../../models/account-balance";

export interface IAccountMovementService {
  getMovements(clientId: string): Promise<AccountBalance>;
  getMovementById(id: string): Promise<AccountMovement>;
}
