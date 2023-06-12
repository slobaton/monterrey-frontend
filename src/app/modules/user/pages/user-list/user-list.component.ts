import { Component } from '@angular/core';
import { DataTableActionStatus, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { UserService } from 'src/app/@core/services/rest/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true },
      { title: 'Username', propertyRef: 'username', sortable: true },
      { title: 'Email', propertyRef: 'email', sortable: true },
    ],
    identifierName: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Editar',
        tooltip: 'Editar Usuario',
        icon: 'clone',
        status: DataTableActionStatus.WARNING,
        requireSelectedRows: true,
        callback: (selectedIds) => {
          console.log(selectedIds);
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Usuario',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        requireSelectedRows: true,
        callback: (selectedIds) => {
          console.log(selectedIds);
        }
      },
      {
        title: 'Exportar',
        tooltip: 'Exportar Usuarios',
        icon: 'file',
        status: DataTableActionStatus.INFO,
        callback: () => {
          console.log('export');
        }
      },
    ]
  };

  constructor(public userService: UserService) { }
}
