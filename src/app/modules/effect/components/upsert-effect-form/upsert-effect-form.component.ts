import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { EffectUpsertRequest } from 'src/app/@core/models/request/effect-upsert-request';
import { EffectService } from 'src/app/@core/services/rest/effect.service';
import { ValidationService } from 'src/app/@core/services/common/validation.service';


@Component({
  selector: 'app-upsert-effect-form',
  templateUrl: './upsert-effect-form.component.html',
  styleUrls: ['./upsert-effect-form.component.scss']
})
export class UpsertEffectFormComponent implements OnInit {
  effectForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();
  doesEffectExist: boolean = false;

  constructor(
    private _effectService: EffectService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const effect = this.config.data?.effect;
    this.doesEffectExist = !!effect;

    this.effectForm = new FormGroup({
      name: new FormControl<string>(effect?.name ?? '', [Validators.required]),
      description: new FormControl<string>(effect?.description ?? ''),
      price: new FormControl<string>(effect?.price ?? ''),
      is_active: new FormControl<boolean>({
        value: effect?.is_active ?? true,
        disabled: !this.doesEffectExist
      })
    });
  }

  onSubmitForm(effectFormValue: any): void {
    this.formProcessEvent.emit(true);
    const effect: EffectUpsertRequest = effectFormValue;

    if (this.config.data?.effect) {
      const effectId = this.config.data?.effect.id;
      effect.id = effectId;
      this._effectService.updateEffect(effectId, effect)
        .then((clientUpdated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado con éxito',
            detail: 'Efecto actualizado con éxito'
        });
          this.ref.close(clientUpdated);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.effectForm, err.error.errors);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'La acción no se pudo realizar, intente nuevamente...'
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Error inesperado, intente nuevamente...'
            });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      this._effectService.createEffect(effect)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Cliente creado con éxito' });
          this.ref.close(effect);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.effectForm, err.error.errors);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'La acción no se pudo realizar, intente nuevamente...'
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Error inesperado, intente nuevamente...'
            });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    }
  }
}
