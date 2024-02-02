import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './@core/services/rest/auth.service';
import { ConstantsService } from './@core/services/common/constants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _config: PrimeNGConfig,
    private _router: Router,
    private _constantsService: ConstantsService) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!_authService.hasAbilities()) {
          this._authService.refreshUserAbilities();
        }
      }
    });
  }

  ngOnInit() {
    this._config.ripple = true;
    this._config.setTranslation({
      dayNames: this._constantsService.dayNames,
      dayNamesShort: this._constantsService.dayNamesShort,
      dayNamesMin: this._constantsService.dayNamesMin,
      monthNames: this._constantsService.monthNames,
      monthNamesShort: this._constantsService.mothNamesShort
    });
  }
}
