import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Role } from '../@core/enums/role.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.model = [
      {
        label: 'Configuracion',
        items: [
          { label: 'Parametros', icon: 'pi pi-fw pi-box', routerLink: ['/parameters'] },
        ],
        roles: [Role.ADMIN]
      },
      {
        label: 'Principal',
        items: [
          { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
          { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/users'], roles: [Role.ADMIN] },
          { label: 'Clientes', icon: 'pi pi-fw pi-database', routerLink: ['/clients'], roles: [Role.ADMIN, Role.SECRETARY, Role.RECEPTIONIST] },
          { label: 'Tipos Lavado', icon: 'pi pi-fw pi-sync', routerLink: ['/wash-types'], roles: [Role.ADMIN, Role.SECRETARY] },
          { label: 'Efectos', icon: 'pi pi-fw pi-filter-fill', routerLink: ['/effects'], roles: [Role.ADMIN, Role.SECRETARY] },
          { label: 'Tipos de Prenda', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/cloth-types'], roles: [Role.ADMIN, Role.SECRETARY] },
          { label: 'Tamaños de Ropa', icon: 'pi pi-fw pi-sort-alpha-up-alt', routerLink: ['/cloth-sizes'], roles: [Role.ADMIN, Role.SECRETARY] },
        ]
      },
      {
        label: 'Orden de Lavado',
        items: [
          { label: 'Lista de Ordenes', icon: 'pi pi-fw pi-book', routerLink: ['/wash-orders'] },
          { label: 'Nueva Orden', icon: 'pi pi-fw pi-calculator', routerLink: ['/wash-orders/new'] },
        ],
        roles: [Role.ADMIN, Role.SECRETARY, Role.RECEPTIONIST]
      },
      {
        label: 'Ingresos',
        items: [
          { label: 'Reportes', icon: 'pi pi-fw pi-calendar', routerLink: ['/incomes/list'] },
          { label: 'Recibos', icon: 'pi pi-fw pi-copy', routerLink: ['/incomes/receipts'] },
        ],
        roles: [Role.ADMIN, Role.SECRETARY]
      }
    ];
  }
}
