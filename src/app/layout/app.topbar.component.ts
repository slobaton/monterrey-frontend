import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../@core/services/rest/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  userMenuItems: MenuItem[] = [
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-logout',
      command: () => this.logout()
    }
  ];

  public logout(): void {
    this._authService.logout()
      .then(() => {
        this._router.navigateByUrl('/auth/login');
      });
  }

  constructor(public layoutService: LayoutService, private _authService: AuthService, private _router: Router) { }
}
