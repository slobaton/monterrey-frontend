import { GeneralCountReport } from "../../models/general-report";

export interface IReportService {
  getWashOrderPrintReportUrl(washOrderId: string): Promise<string>;
  getGeneralReportCount(): Promise<GeneralCountReport>;
}
