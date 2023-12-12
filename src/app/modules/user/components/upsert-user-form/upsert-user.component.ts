import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashTypeUpsertRequest } from 'src/app/@core/models/request/wash-type-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { WashTypeService } from 'src/app/@core/services/rest/wash-type.service';
import { passwordMatchValidator } from 'src/app/shared/helpers/form-helpers';

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
    private _washTypeService: WashTypeService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    var user = this.config.data?.washType;

    if (user) {
      this.isThereAUser = true;
    }

    this.userForm = new FormGroup({
      name: new FormControl<string>(user?.name ?? '', [Validators.required, Validators.maxLength(150)]),
      paternal_surname: new FormControl<string>(user?.paternal_surname ?? '', [Validators.required, Validators.maxLength(150)]),
      maternal_surname: new FormControl<string>(user?.maternal_surname ?? '', [Validators.maxLength(150)]),
      username: new FormControl<string>(user?.username ?? '', [Validators.required, Validators.maxLength(150)]),
      email: new FormControl<string>(user?.email ?? '', [Validators.required, Validators.maxLength(150), Validators.email]),
      description: new FormControl<string>(user?.description ?? ''),
      password: new FormControl<string>(user?.password ?? '', !this.isThereAUser ? [Validators.required] : []),
      password_confirmation : new FormControl<string>(user?.password ?? '', !this.isThereAUser ? [Validators.required] : []),
      is_active: new FormControl<boolean>({
        value: user?.is_active ?? true,
        disabled: !this.isThereAUser
      })
    }, { validators: passwordMatchValidator });
  }

  onSubmitForm(userFormValue: any): void {
    this.formProcessEvent.emit(true);
    const washType: WashTypeUpsertRequest = userFormValue;

    if (this.config.data?.washType) {
      const washTypeId = this.config.data?.washType.id;
      washType.id = washTypeId;
      this._washTypeService.update(washTypeId, washType)
        .then((washTypeUpdated) => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Tipo lavado actualizado con éxito' });
          this.ref.close(washTypeUpdated);
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
      this._washTypeService.create(washType)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Tipo lavado creado con éxito' });
          this.ref.close(washType);
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
