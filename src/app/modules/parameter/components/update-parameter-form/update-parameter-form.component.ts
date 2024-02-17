import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SystemParameterUpdateRequest } from 'src/app/@core/models/request/system-parameter-update-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { SystemParameterService } from 'src/app/@core/services/rest/system-parameter.service';

@Component({
  selector: 'app-update-parameter-form',
  templateUrl: './update-parameter-form.component.html',
  styleUrls: ['./update-parameter-form.component.scss']
})
export class UpdateParameterFormComponent {
  parameterForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _parameterService: SystemParameterService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const parameter = this._config.data?.parameter;

    if (!parameter) {
      throw new Error("Unable to update");
    }

    this.parameterForm = new FormGroup({
      name: new FormControl<string>(parameter?.name ?? '', [Validators.required]),
      description: new FormControl<string>(parameter?.description ?? '', [Validators.required]),
      value: new FormControl<number>(parameter?.value ?? 0, [Validators.required]),
    });
  }

  onSubmitForm(parameterFormValue: any): void {
    this.formProcessEvent.emit(true);
    const parameter: SystemParameterUpdateRequest = {
      name: parameterFormValue.name,
      description: parameterFormValue.description,
      value: parameterFormValue.value
    };

    if (!this._config.data?.parameter) {
      throw new Error("Unable to update");
    }

    const id = this._config.data?.parameter.id;
    this._parameterService.update(id, parameter)
      .then(() => {
        this._messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Parametro actualizado con éxito' });
        this._ref.close(parameter);
      })
      .catch(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this._validationService.handleValidationErrors(this.parameterForm, err.error.errors);
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
