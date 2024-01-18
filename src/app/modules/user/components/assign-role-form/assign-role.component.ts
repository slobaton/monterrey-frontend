import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { minSelectedCheckboxes } from 'src/app/shared/validators/min-selected-checkboxes';
import { RoleService } from "src/app/@core/services/rest/role.service";
import { Role } from "src/app/@core/models/role";
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';

@Component({
  selector: 'app-upsert-user',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.scss']
})
export class AssignRoleComponent extends ProtectedComponent {
  roleUserForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  roles: Array<Role> = [];
  assignedRoles: Array<Role> = [];
  roleIdsToIndexMap: Map<number, string> = new Map();

  constructor(
    private _roleService: RoleService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService,
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    ) {
    super(abilityService, authService);
    this.initializeForm();
  }

  ngOnInit(): void { }

  getRoles () {
    this._roleService.fetchPaginatedResource()
      .then(({ data }) => {
        this.roles = data;
        this.addRoleControls();
      })
      .catch(err => this.handleError(err));
  }

  initializeForm(): void {
    let user = this.config.data?.user;
    if (user) {
      this._roleService.getUserRoles(user.id)
        .then(({ data }: any) => {
          this.assignedRoles = data;
          this.getRoles();
        })
        .catch(err => {
          this.handleError(err);
        });
    }

    this.roleUserForm = new FormGroup({
      roleIds: new FormArray([], minSelectedCheckboxes(1)),
    });
  }

  private addRoleControls(): void {
    this.roles.forEach((role: Role, index: number): void => {
      this.roleIdsToIndexMap.set(index, role.id);
      const assignedRoleIds: Array<string> = this.assignedRoles.map(role => role.id);
      this.rolesFormArray.push(new FormControl(assignedRoleIds.includes(role.id)))
    });
  }

  get rolesFormArray(): FormArray {
    return this.roleUserForm.get('roleIds') as FormArray;
  }
  get rolesFormControl(): FormControl[] {
    return (this.roleUserForm.get('roleIds') as FormArray).controls as FormControl[];
  }

  onSubmitForm({roleIds}: any): void {
    this.formProcessEvent.emit(true);
    const selectedIds = roleIds
      .map((selectedId: boolean, index: number) => selectedId ? this.roleIdsToIndexMap.get(index) : false)
      .filter((selected: string|boolean) => selected)

    if (this.config.data?.user) {
      const USER_ID = this.config.data?.user.id;

      this._roleService.assignRolesToUser(USER_ID, selectedIds)
        .then((userUpdated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización realizada',
            detail: 'Usuario actualizado con éxito'
          });
          this.ref.close(userUpdated);
        })
        .catch(err => this.handleError(err))
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      this.showErrorMessage('No se tiene un usuario seleccionado')
    }
  }

  // Función para manejar errores
  handleError(err: any): void {
    if (this.isHttpErrorResponse(err)) {
      this.handleHttpError(err);
    } else {
      this.showErrorMessage('Error inesperado, intente nuevamente...');
    }
  }

  // Verifica si el error es una instancia de HttpErrorResponse
  isHttpErrorResponse(err: any): boolean {
    return err instanceof HttpErrorResponse;
  }

  // Maneja errores específicos de HTTP
  handleHttpError(err: any): void {
    const UNPROCESSABLE_ENTITY = 422;
    if (err.status === UNPROCESSABLE_ENTITY) {
      this.validationService.handleValidationErrors(this.roleUserForm, err.error.errors);
    } else {
      this.showErrorMessage('La acción no se pudo realizar, intente nuevamente...');
    }
  }

  // Función para mostrar mensajes de error
  showErrorMessage(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail });
  }
}
