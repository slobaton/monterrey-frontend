import { Component, OnInit } from '@angular/core';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthUser } from 'src/app/@core/models/auth-user';
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
  authUser: AuthUser | null = null;

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    private _reportService: ReportService
  ) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this.authUser = this.authService.authenticatedUser;

    if (this.hasAdminRole()) {
      this.retrieveReports();
    }
  }

  getUserFullName() {
    if (!this.authUser) {
      return '';
    }
    const parts = [this.authUser.name, this.authUser.paternal_surname, this.authUser.maternal_surname]
      .filter(p => p !== null && p !== undefined)
      .map(p => (typeof p === 'string' ? p.trim() : ''))
      .filter(p => p.length > 0);
    return parts.length ? parts.join(' ') : '';
  }

  async retrieveReports(): Promise<void> {
    this.reportResult = await this._reportService.getGeneralReportCount();
  }
}
