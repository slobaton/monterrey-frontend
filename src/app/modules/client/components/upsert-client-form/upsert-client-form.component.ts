import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientUpsertRequest } from 'src/app/@core/models/request/client-upsert-request';
import { ClientService } from 'src/app/@core/services/rest/client.service';

@Component({
  selector: 'app-upsert-client-form',
  templateUrl: './upsert-client-form.component.html',
  styleUrls: ['./upsert-client-form.component.scss'],
  providers: [MessageService]
})
export class UpsertClientFormComponent implements OnInit {

  clientForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private _clientService: ClientService, public messageService: MessageService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.clientForm = new FormGroup({
      nit: new FormControl<string>(''),
      name: new FormControl<string>('', [Validators.required]),
      paternal_surname: new FormControl<string>(''),
      maternal_surname: new FormControl<string>(''),
      address: new FormControl<string>(''),
      phone: new FormControl<string>(''),
      cellphone: new FormControl<string>(''),
      observations: new FormControl<string>('')
    });
  }

  onSubmitForm(clientFormValue: any): void {
    this.formProcessEvent.emit(true);
    const client: ClientUpsertRequest = clientFormValue;
    this._clientService.createClient(client)
      .then(() => {
        this.messageService.add({ summary: 'Creado con exito', detail: 'Cliente creado con exito' });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => this.formProcessEvent.emit(false));
  }

}
