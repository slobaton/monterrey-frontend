import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashTypeUpsertRequest } from 'src/app/@core/models/request/wash-type-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { WashTypeService } from 'src/app/@core/services/rest/wash-type.service';

@Component({
  selector: 'app-upsert-wash-type',
  templateUrl: './upsert-wash-type.component.html',
  styleUrls: ['./upsert-wash-type.component.scss']
})
export class UpsertWashTypeComponent {
  washTypeForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isExistingWashType: boolean = false;

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
    var existingWashType = this.config.data?.washType;

    if (existingWashType) {
      this.isExistingWashType = true;
    }

    this.washTypeForm = new FormGroup({
      name: new FormControl<string>(existingWashType?.name ?? '', [Validators.required, Validators.maxLength(150)]),
      description: new FormControl<string>(existingWashType?.description ?? ''),
      is_active: new FormControl<boolean>({
        value: existingWashType?.is_active ?? true,
        disabled: !this.isExistingWashType
      })
    });
  }

  onSubmitForm(washTypeFormValue: any): void {
    this.formProcessEvent.emit(true);
    const washType: WashTypeUpsertRequest = washTypeFormValue;

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
              this.validationService.handleValidationErrors(this.washTypeForm, err.error.errors);
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
              this.validationService.handleValidationErrors(this.washTypeForm, err.error.errors);
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
