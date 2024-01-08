import { Component, OnInit } from '@angular/core';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { GeneralCountReport } from 'src/app/@core/models/general-report';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ReportService } from 'src/app/@core/services/rest/report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ProtectedComponent implements OnInit {
  reportResult?: GeneralCountReport;

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    private _reportService: ReportService
  ) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    if (this.hasAdminRole()) {
      this.retrieveReports();
    }
  }

  async retrieveReports(): Promise<void> {
    this.reportResult = await this._reportService.getGeneralReportCount();
  }
}
