import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserUpsertRequest } from 'src/app/@core/models/request/user-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { UserService } from 'src/app/@core/services/rest/user.service';
import { minSelectedCheckboxes } from 'src/app/shared/validators/min-selected-checkboxes';
import { RoleService } from "src/app/@core/services/rest/role.service";
import { Role } from "src/app/@core/models/role";
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ProtectedComponent } from "src/app/@core/models/common/protected-component";

@Component({
  selector: 'app-upsert-user',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.scss']
})
export class AssignRoleComponent extends ProtectedComponent {
  roleUserForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isThereAUser: boolean = false;
  roles: Array<Role> = [];

  constructor(
    private _userService: UserService,
    private _roleService: RoleService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService,
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    ) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this._roleService.fetchPaginatedResource()
      .then(roles => {
        this.roles = roles;
        console.log(roles)
      })
      .catch(err => this.handleError(err));
    this.initializeForm();
  }

  initializeForm(): void {
    let user = this.config.data?.user;
    let assignedRoles: Array<Role> = [];
    if (user) {
      assignedRoles = [];
    }

    this.roleUserForm = new FormGroup({
      role_ids: new FormControl<Array<Role>>([], minSelectedCheckboxes(1)),
    });
  }

  onSubmitForm(userFormValue: any): void {
    this.formProcessEvent.emit(true);
    const user: UserUpsertRequest = userFormValue;

    if (this.config.data?.user) {
      const USER_ID = this.config.data?.user.id;
      user.id = USER_ID;
      this._userService.update(USER_ID, user)
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
      this._userService.create(user)
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado con éxito',
            detail: 'Usuario creado con éxito'
          });
          this.ref.close(user);
        })
        .catch(err => this.handleError(err))
        .finally(() => this.formProcessEvent.emit(false));
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
