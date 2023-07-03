import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClothSizeUpsertRequest } from 'src/app/@core/models/request/cloth-size-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClothSizeService } from 'src/app/@core/services/rest/cloth-size.service';

@Component({
  selector: 'app-upsert-cloth-size',
  templateUrl: './upsert-cloth-size.component.html',
  styleUrls: ['./upsert-cloth-size.component.scss']
})
export class UpsertClothSizeComponent {
  clothSizeForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  doesClothSizeExists: boolean = false;

  constructor(
    private _clothSizeService: ClothSizeService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const clothSize = this.config.data?.clothSize;
    this.doesClothSizeExists = clothSize!!;

    this.clothSizeForm = new FormGroup({
      name: new FormControl<string>(clothSize?.name ?? '', [Validators.required, Validators.maxLength(150)]),
      description: new FormControl<string>(clothSize?.description ?? ''),
      wash_price: new FormControl<number>(clothSize?.wash_price ?? 0, [Validators.required, Validators.min(0), Validators.max(99999999.99)]),
      wash_special_price: new FormControl<number>(clothSize?.wash_special_price ?? 0, [Validators.min(0), Validators.max(99999999.99)]),
      is_active: new FormControl<boolean>({
        value: clothSize?.is_active ?? true,
        disabled: !this.doesClothSizeExists
      })
    });
  }

  onSubmitForm(clothSizeFormValue: any): void {
    this.formProcessEvent.emit(true);
    const clothSize: ClothSizeUpsertRequest = clothSizeFormValue;

    if (this.config.data?.clothSize) {
      const clothSizeId = this.config.data?.clothSize.id;
      clothSize.id = clothSizeId;
      this._clothSizeService.update(clothSizeId, clothSize)
        .then((clothSizeUpdated) => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Tamaño de ropa actualizado con éxito' });
          this.ref.close(clothSizeUpdated);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.clothSizeForm, err.error.errors);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      this._clothSizeService.create(clothSize)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Tamaño de ropa creado con éxito' });
          this.ref.close(clothSize);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.clothSizeForm, err.error.errors);
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
