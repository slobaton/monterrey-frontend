import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../@core/services/rest/auth.service';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ChangePasswordComponent } from "../modules/user/components/change-password-form/change-password.component";

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
  ref: DynamicDialogRef | undefined;
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  userMenuItems: MenuItem[] = [
    {
      label: 'Cambiar contraseña',
      icon: 'pi pi-key',
      command: () => this.changePassword()
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-lock',
      command: () => this.logout()
    }
  ];

  public logout(): void {
    this._authService.logout()
      .then(() => {
        this._router.navigateByUrl('/auth/login');
      });
  }

  public changePassword(): void {
    this.ref = this.dialogService.open(ChangePasswordComponent, { header: 'Cambiar contraseña' });
  }

  constructor(
    public layoutService: LayoutService,
    private _authService: AuthService,
    private _router: Router,
    private dialogService: DialogService
  ) { }
}
