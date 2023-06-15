import { Component } from '@angular/core';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent {

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Nit', propertyRef: 'nit', sortable: true },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Ap. Paterno', propertyRef: 'paternal_surname', sortable: true },
      { title: 'Ap. Materno', propertyRef: 'maternal_surname', sortable: true },
      { title: 'Telefono', propertyRef: 'phone' },
      { title: 'Celular', propertyRef: 'cellphone' },
      { title: 'Activo', propertyRef: 'is_active', type: DataTableColumnType.BOOLEAN },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
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

  constructor(public clientService: ClientService) { }

}
