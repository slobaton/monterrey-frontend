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
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Usuario', propertyRef: 'username' },
      { title: 'Correo', propertyRef: 'email', sortable: true },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Apellido Pat.', propertyRef: 'paternal_surname' },
      { title: 'Apellido Mat.', propertyRef: 'maternal_surname' }
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.MULTIPLE,
    actions: [
      {
        title: 'Editar',
        tooltip: 'Editar Usuario',
        icon: 'clone',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (selectedIds) => {
          console.log(selectedIds);
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Usuario',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          minSelectedRows: 2
        },
        callback: (selectedIds) => {
          console.log(selectedIds);
        }
      },
      {
        title: 'Exportar',
        tooltip: 'Exportar Usuarios',
        icon: 'file',
        status: DataTableActionStatus.INFO,
        selectionConfig: {
          isRequired: false
        },
        callback: () => {
          console.log('export');
        }
      },
    ]
  };

  constructor(public userService: UserService) { }
}
