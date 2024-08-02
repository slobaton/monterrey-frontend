import { IncomeReceiptStatus } from "../enums/income-receipt-status.enum";

export class IncomeReceipt {
  constructor(
    public id: number,
    public date: string,
    public status: IncomeReceiptStatus,
    public user_id: string,
    public canceled_reason: string | null,
    public created_at: string,
    public updated_at: string
  ) { }

  public static getFriendlyStatusName(status: IncomeReceiptStatus): string {
    let statusLabel = 'Activo';

    switch (status) {
      case IncomeReceiptStatus.ACTIVE: statusLabel = 'Activo';
        break;
      case IncomeReceiptStatus.CANCELED: statusLabel = 'Cancelado';
        break;
    }

    return statusLabel;
  }
}
