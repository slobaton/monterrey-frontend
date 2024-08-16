import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParameterValueUpsertRequest } from 'src/app/@core/models/request/parameter-value-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { SystemParameterService } from 'src/app/@core/services/rest/system-parameter.service';
import { ParameterValueService } from 'src/app/@core/services/rest/parameter-value.service';

@Component({
  selector: 'app-upsert-parameter-value',
  templateUrl: './upsert-parameter-value.component.html',
  styleUrls: ['./upsert-parameter-value.component.scss']
})
export class UpsertParameterValueComponent {
  parameterValueForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  doesParameterValueExists: boolean = false;

  constructor(
    public parameterService: SystemParameterService,
    private _parameterValueService: ParameterValueService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const parameterValue = this._config.data?.parameterValue;
    this.doesParameterValueExists = parameterValue!!;

    this.parameterValueForm = new FormGroup({
      id: new FormControl<number | null>(parameterValue?.parameter_value.id),
      system_parameter_id: new FormControl<number | null>({
        value: parameterValue?.id,
        disabled: this.doesParameterValueExists
      }, [Validators.required]),
      value: new FormControl<number>(parameterValue?.parameter_value.value ?? 0, [Validators.required]),
    });
  }

  onSubmitForm(parameterValueFormValue: any): void {
    this.formProcessEvent.emit(true);
    const parameterValue: ParameterValueUpsertRequest = {
      value: parameterValueFormValue.value
    };
    const clientId = this._config.data.clientId;

    if (this._config.data?.parameterValue) {
      const parameterId = parameterValueFormValue.system_parameter_id ?? this._config.data?.parameterValue.id;
      const id = parameterValueFormValue.id;
      this._parameterValueService.updateParameterValue(clientId, parameterId, id, parameterValue)
        .then(() => {
          this._messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Precio actualizado con éxito' });
          this._ref.close(parameterValue);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.parameterValueForm, err.error.errors);
            } else {
              this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      const parameterId = parameterValueFormValue.system_parameter_id;
      this._parameterValueService.assignParameterValue(clientId, parameterId, parameterValue)
        .then(() => {
          this._messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Precio asignado con éxito' });
          this._ref.close(parameterValue);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.parameterValueForm, err.error.errors);
            } else {
              this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    }
  }
}
