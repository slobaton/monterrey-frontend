import { AccountMovementType } from "../enums/movement-type.enum";

export class AccountBalance {
  constructor(
    public start_balance: number,
    public movements: Array<AccountMovement>
  ) { }
}

export class AccountMovement {
  constructor(
    public date: string,
    public code: number,
    public type: AccountMovementType,
    public wash_order_id: string,
    public amount: number,
    public details: Array<AccountMovementDetail> | null,
    public balance_debt: number
  ) { }
}

export class AccountMovementDetail {
  constructor(
    public id: string,
    public unit_price: number,
    public quantity: number,
    public subtotal_price: number,
    public cloth_type: string,
    public cloth_size: string,
    public details: string,
    public balance_debt: number
  ) { }
}
