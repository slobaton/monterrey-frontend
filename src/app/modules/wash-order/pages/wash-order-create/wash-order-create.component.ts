import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { WashOrderCreateRequest } from 'src/app/@core/models/request/wash-order-create-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { WashOrderService } from 'src/app/@core/services/rest/wash-order.service';
import { WashTypeService } from 'src/app/@core/services/rest/wash-type.service';

@Component({
  selector: 'app-wash-order-create',
  templateUrl: './wash-order-create.component.html',
  styleUrls: ['./wash-order-create.component.scss']
})
export class WashOrderCreateComponent implements OnInit {

  washOrderForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isProcessing: boolean = false;

  code: string = '';
  washOrderCreated: boolean = false;

  constructor(
    public clientService: ClientService,
    public washTypeService: WashTypeService,
    private _washOrderService: WashOrderService,
    private messageService: MessageService,
    private _validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const todayDate = new Date();

    this.washOrderForm = new FormGroup({
      client_id: new FormControl<string>('', [Validators.required]),
      date: new FormControl<Date>(todayDate, [Validators.required]),
      wash_type_id: new FormControl<number>(0, [Validators.required]),
      total_quantity: new FormControl<number>(0, [Validators.required]),
      total_price: new FormControl<number>(0, [Validators.required]),
      observations: new FormControl<string>('', [])
    })
  }

  onSubmitForm(washOrderFormValue: any): void {
    this.formProcessEvent.emit(true);
    this.isProcessing = true;

    const washOrder: WashOrderCreateRequest = {
      ...washOrderFormValue,
      total_price: washOrderFormValue.total_price.toFixed(2),
      date: formatDate(washOrderFormValue.date, 'yyyy/MM/dd', 'en_US'),
    }

    this._washOrderService.create(washOrder)
      .then((createdWashOrder) => {
        console.log(createdWashOrder);
        this.code = createdWashOrder.code.toString();
        this.washOrderCreated = true;
        this.messageService.add({ severity: 'success', summary: `Orden COD: ${createdWashOrder.code}`, detail: 'Orden de Lavado creado con éxito', life: 3500 });
      })
      .catch(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this._validationService.handleValidationErrors(this.washOrderForm, err.error.errors);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
        }
      })
      .finally(() => {
        this.formProcessEvent.emit(false);
        this.isProcessing = false;
      });
  }

  addWashOrderDetail(): void {
    alert('detail added');
    //Show the modal, to add the detail
  }
}
