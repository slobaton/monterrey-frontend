import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { UserService } from 'src/app/@core/services/rest/user.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { User } from 'src/app/@core/models/user';
import { UpsertUserComponent } from '../../components/upsert-user-form/upsert-user.component';
import { AssignRoleComponent } from "../../components/assign-role-form/assign-role.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @ViewChild('userTable') table!: DataTableComponent<User>;
  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Usuario', propertyRef: 'username' },
      { title: 'Correo', propertyRef: 'email', sortable: true },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Apellido Pat.', propertyRef: 'paternal_surname' },
      { title: 'Apellido Mat.', propertyRef: 'maternal_surname' },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Crear usuario',
        icon: 'user-plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        callback: () => {
          this.ref = this.dialogService.open(UpsertUserComponent, { header: 'Crear usuario' });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar Usuario',
        icon: 'user-edit',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (action, selectedId) => {
          const USER = selectedId[0];
          this.ref = this.dialogService.open(UpsertUserComponent, { header: 'Editar Tipo lavado', data: { user: USER } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Usuario',
        icon: 'user-minus',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (action, selectedId) => {
          const userId = selectedId[0].id;
          this.confirmationService.confirm({
            key: 'confirmDelete',
            accept: () => {
              this.userService.deleteById(userId)
                .then(() => {
                  this.messageService.add({
                    key: 'confirmDelete',
                    severity: 'success',
                    summary: 'Eliminado!',
                    detail: 'El usuario ha sido eliminado!.'
                  });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this.messageService.add({
                    key: 'confirmDelete',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo completar la accion.'
                  })
                });
            },
            reject: () => {
              this.messageService.add({
                key: 'confirmDelete',
                severity: 'error',
                summary: 'Cancelado',
                detail: 'Operacion cancelada!'
              })
            }
          });
        }
      },
      {
        title: 'Asignar rol',
        tooltip: 'Asignar rol al usuario',
        icon: 'user',
        status: DataTableActionStatus.INFO,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (action, selectedId) => {
          const USER = selectedId[0];
          this.ref = this.dialogService.open(AssignRoleComponent, { header: 'Asignar rol al usuario', data: { user: USER } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
    ]
  };

  constructor(
    public userService: UserService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }
}
