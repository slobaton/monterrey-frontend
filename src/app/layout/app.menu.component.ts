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
        label: 'Home',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
          { label: 'Users', icon: 'pi pi-fw pi-user', routerLink: ['/users'], roles: [Role.ADMIN] },
          { label: 'Clients', icon: 'pi pi-fw pi-database', routerLink: ['/clients'], roles: [Role.ADMIN, Role.SECRETARY] },
          { label: 'Tipos Lavado', icon: 'pi pi-fw pi-sync', routerLink: ['/wash-types'], roles: [Role.ADMIN, Role.SECRETARY] },
          { label: 'Effects', icon: 'pi pi-fw pi-filter-fill', routerLink: ['/effects'] },
          { label: 'Tipos de Ropa', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/cloth-types'] },
          { label: 'Tamaños de Ropa', icon: 'pi pi-fw pi-sort-alpha-up-alt', routerLink: ['/cloth-sizes'] },
        ]
      },
      {
        label: 'Orden de Lavado',
        items: [
          { label: 'Lista de Ordenes', icon: 'pi pi-fw pi-book', routerLink: ['/wash-orders'] },
          { label: 'Nueva Orden', icon: 'pi pi-fw pi-calculator', routerLink: ['/wash-orders/new'] },
        ],
      }
    ];
  }
}
