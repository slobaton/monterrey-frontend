import { CancelIncomeReceiptRequest } from "../../models/request/cancel-income-receipt-request";

export interface IIncomeReceiptService {
  cancelReceipt(request: CancelIncomeReceiptRequest): Promise<void>;
}
