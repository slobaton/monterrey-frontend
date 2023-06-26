import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClothTypeUpsertRequest } from 'src/app/@core/models/request/cloth-type-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClothTypeService } from 'src/app/@core/services/rest/cloth-type.service';

@Component({
  selector: 'app-upsert-cloth-type',
  templateUrl: './upsert-cloth-type.component.html',
  styleUrls: ['./upsert-cloth-type.component.scss']
})
export class UpsertClothTypeComponent {
  clothTypeForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isExistingClothType: boolean = false;

  constructor(
    private _clothTypeService: ClothTypeService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    var existingClothType = this.config.data?.clothType;

    if (existingClothType) {
      this.isExistingClothType = true;
    }

    this.clothTypeForm = new FormGroup({
      name: new FormControl<string>(existingClothType?.name ?? '', [Validators.required, Validators.maxLength(150)]),
      description: new FormControl<string>(existingClothType?.description ?? ''),
      is_active: new FormControl<boolean>({
        value: existingClothType?.is_active ?? true,
        disabled: !this.isExistingClothType
      })
    });
  }

  onSubmitForm(clothTypeFormValue: any): void {
    this.formProcessEvent.emit(true);
    const clothType: ClothTypeUpsertRequest = clothTypeFormValue;

    if (this.config.data?.clothType) {
      const clothTypeId = this.config.data?.clothType.id;
      clothType.id = clothTypeId;
      this._clothTypeService.update(clothTypeId, clothType)
        .then((clothTypeUpdated) => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Tipo de ropa actualizado con éxito' });
          this.ref.close(clothTypeUpdated);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.clothTypeForm, err.error.errors);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      this._clothTypeService.create(clothType)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Tipo de ropa creado con éxito' });
          this.ref.close(clothType);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.clothTypeForm, err.error.errors);
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
