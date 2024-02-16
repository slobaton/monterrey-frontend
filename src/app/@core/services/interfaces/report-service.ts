import { GeneralCountReport } from "../../models/general-report";

export interface IReportService {
  getWashOrderPrintReportUrl(washOrderId: string): Promise<string>;
  getAccountMovementsPrintReportUrl(clientId: string, startDate: string, endDate: string): Promise<string>;
  getGeneralReportCount(): Promise<GeneralCountReport>;
}
