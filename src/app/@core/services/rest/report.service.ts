import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IReportService } from '../interfaces/report-service';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';
import { GeneralCountReport } from '../../models/general-report';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService implements IReportService {

  constructor(_http: HttpClient, private _authService: AuthService) {
    super(_http);
  }

  async getWashOrderPrintReportUrl(washOrderId: string): Promise<string> {
    return await this.getValidReportUrl(`washOrder/${washOrderId}`);
  }

  async getAccountMovementsPrintReportUrl(clientId: string, startDate: string, endDate: string): Promise<string> {
    const params = new HttpParams()
      .append('startDate', startDate)
      .append('endDate', endDate);

    return await this.getValidReportUrl(`clients/${clientId}/accountMovements`, params);
  }

  async getGeneralReportCount(): Promise<GeneralCountReport> {
    try {
      const data = await firstValueFrom(this.get<GeneralCountReport>('reports/general-count'));

      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getValidReportUrl(reportUrlSection: string, params?: HttpParams): Promise<string> {
    const publickey = await this._authService.getPublicKey();

    const reqParams = params
      ? params.append('key', publickey.key)
      : new HttpParams().append('key', publickey.key);

    return `${this.baseUrl}/reports/${reportUrlSection}?${reqParams.toString()}`;
  }
}
