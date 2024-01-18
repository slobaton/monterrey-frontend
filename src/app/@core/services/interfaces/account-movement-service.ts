import { AccountBalance } from "../../models/account-balance";

export interface IAccountMovementService {
  getMovements(clientId: string, balanceMonth: number, balanceYear: number): Promise<AccountBalance>;
}
