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

  isExistingClient: boolean = false;

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
    var existingClient = this.config.data?.client;

    if (existingClient) {
      this.isExistingClient = true;
    }

    this.clientForm = new FormGroup({
      nit: new FormControl<string>(existingClient?.nit ?? ''),
      name: new FormControl<string>(existingClient?.name ?? '', [Validators.required]),
      paternal_surname: new FormControl<string>(existingClient?.paternal_surname ?? ''),
      maternal_surname: new FormControl<string>(existingClient?.maternal_surname ?? ''),
      address: new FormControl<string>(existingClient?.address ?? ''),
      phone: new FormControl<string>(existingClient?.phone ?? ''),
      cellphone: new FormControl<string>(existingClient?.cellphone ?? ''),
      observations: new FormControl<string>(existingClient?.observations ?? ''),
      is_active: new FormControl<boolean>({
        value: existingClient?.is_active ?? true,
        disabled: !this.isExistingClient
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
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Cliente creado con éxito' });
          this.ref.close(client);
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
