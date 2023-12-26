import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { ClientUpsertRequest } from 'src/app/@core/models/request/client-upsert-request';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upsert-client-form',
  templateUrl: './upsert-client-form.component.html',
  styleUrls: ['./upsert-client-form.component.scss'],
})
export class UpsertClientFormComponent implements OnInit {

  clientForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  doesClientExists: boolean = false;

  constructor(
    private _clientService: ClientService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const client = this.config.data?.client;
    this.doesClientExists = client!!;

    this.clientForm = new FormGroup({
      nit: new FormControl<string>(client?.nit ?? ''),
      name: new FormControl<string>(client?.name ?? '', [Validators.required]),
      paternal_surname: new FormControl<string>(client?.paternal_surname ?? ''),
      maternal_surname: new FormControl<string>(client?.maternal_surname ?? ''),
      address: new FormControl<string>(client?.address ?? ''),
      phone: new FormControl<string>(client?.phone ?? ''),
      cellphone: new FormControl<string>(client?.cellphone ?? ''),
      observations: new FormControl<string>(client?.observations ?? ''),
      is_active: new FormControl<boolean>({
        value: client?.is_active ?? true,
        disabled: !this.doesClientExists
      })
    });
  }

  onSubmitForm(clientFormValue: any): void {
    this.formProcessEvent.emit(true);
    const client: ClientUpsertRequest = clientFormValue;

    if (this.config.data?.client) {
      const clientId = this.config.data?.client.id;
      client.id = clientId;
      this._clientService.updateClient(clientId, client)
        .then((clientUpdated) => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Cliente actualizado con éxito' });
          this.ref.close(clientUpdated);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.clientForm, err.error.errors);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      this._clientService.createClient(client)
        .then((clientCreated) => {
          this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Cliente creado con éxito' });
          this.ref.close(clientCreated);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.clientForm, err.error.errors);
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
