import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserUpsertRequest } from 'src/app/@core/models/request/user-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { UserService } from 'src/app/@core/services/rest/user.service';
import { passwordMatchValidator } from 'src/app/shared/validators/password-match-validator';

@Component({
  selector: 'app-upsert-user',
  templateUrl: './upsert-user.component.html',
  styleUrls: ['./upsert-user.component.scss']
})
export class UpsertUserComponent {
  userForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isThereAUser: boolean = false;

  constructor(
    private _userService: UserService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    var user = this.config.data?.user;

    if (user) {
      this.isThereAUser = true;
    }

    this.userForm = new FormGroup({
      name: new FormControl<string>(user?.name ?? '', [Validators.required, Validators.maxLength(150)]),
      paternal_surname: new FormControl<string>(user?.paternal_surname ?? '', [Validators.required, Validators.maxLength(150)]),
      maternal_surname: new FormControl<string>(user?.maternal_surname ?? '', [Validators.maxLength(150)]),
      username: new FormControl<string>(user?.username ?? '', [Validators.required, Validators.maxLength(150)]),
      email: new FormControl<string>(user?.email ?? '', [Validators.maxLength(150), Validators.email]),
      password: new FormControl<string>(user?.password ?? '', !this.isThereAUser ? [Validators.required] : []),
      password_confirmation: new FormControl<string>(user?.password ?? '', !this.isThereAUser ? [Validators.required] : []),
    }, { validators: passwordMatchValidator() });
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
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.userForm, err.error.errors);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
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
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.userForm, err.error.errors);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    }
  }
}
