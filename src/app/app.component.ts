import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { AppAbility } from './@core/auth/ability';
import { AuthService } from './@core/services/rest/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _primengConfig: PrimeNGConfig,
    private _router: Router) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!_authService.hasAbilities()) {
          this._authService.refreshUserAbilities();
        }
      }
    });
  }

  ngOnInit() {
    this._primengConfig.ripple = true;
  }
}
