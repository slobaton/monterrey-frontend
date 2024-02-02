import { AccountMovementType } from "../enums/movement-type.enum";

export class AccountBalance {
  constructor(
    public start_balance: number,
    public final_balance: number,
    public start_date: string | null,
    public end_date: string | null,
    public movements: Array<AccountMovement>
  ) { }
}

export class AccountMovement {
  constructor(
    public id: number,
    public client_id: string,
    public receipt_number: number | null,
    public date: string,
    public concept: string,
    public type: AccountMovementType,
    public code: number | null,
    public wash_order_id: string | null,
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
