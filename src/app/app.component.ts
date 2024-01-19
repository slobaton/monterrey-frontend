import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './@core/services/rest/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _config: PrimeNGConfig,
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
    this._config.ripple = true;
    this._config.setTranslation({
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    });
  }
}
