export interface IReportService {
  getWashOrderPrintReportUrl(washOrderId: string): Promise<string>;
}
