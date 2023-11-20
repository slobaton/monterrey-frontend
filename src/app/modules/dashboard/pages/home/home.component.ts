import { Component, OnInit } from '@angular/core';
import { GeneralCountReport } from 'src/app/@core/models/general-report';
import { ReportService } from 'src/app/@core/services/rest/report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  reportResult?: GeneralCountReport;

  constructor(private _reportService: ReportService) { }

  ngOnInit(): void {
    this.retrieveReports();
  }

  async retrieveReports(): Promise<void> {
    this.reportResult = await this._reportService.getGeneralReportCount();
  }
}
