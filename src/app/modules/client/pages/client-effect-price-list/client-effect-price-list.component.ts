import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EffectPrice } from 'src/app/@core/models/effect-price';
import { EffectPriceService } from 'src/app/@core/services/rest/effect-price.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpsertEffectPriceComponent } from '../../components/upsert-effect-price/upsert-effect-price.component';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Component({
  selector: 'app-client-effect-price-list',
  templateUrl: './client-effect-price-list.component.html',
  styleUrls: ['./client-effect-price-list.component.scss']
})
export class ClientEffectPriceListComponent extends ProtectedComponent implements OnInit {
  @ViewChild('effectPricesTable') table!: DataTableComponent<EffectPrice>;

  public clientId: string = '';

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Efecto', propertyRef: 'name', sortable: false },
      { title: 'Precio Original ($)', propertyRef: 'price' },
      {
        title: 'Precio Cliente ($)',
        propertyRef: 'effect_price.price',
        type: DataTableColumnType.CUSTOM,
        customValue: (row: EffectPrice) => `${row.effect_price.price}`
      }
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo precio efecto',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        hiddenFn: (selectedRows) => !this.ableTo('create', 'parameter'),
        callback: () => {
          this.ref = this._dialogService.open(UpsertEffectPriceComponent, { header: 'Asignar Precio', data: { clientId: this.clientId } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar precio efecto',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => !this.ableTo('update', 'parameter'),
        callback: (action, selectedRows) => {
          const effectPrice = selectedRows[0];
          this.ref = this._dialogService.open(UpsertEffectPriceComponent, { header: 'Asignar Precio', data: { effectPrice, clientId: this.clientId } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Precio efecto',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: (selectedRows) => !this.ableTo('delete', 'parameter'),
        callback: (action, selectedRows) => {
          const effectId = selectedRows[0].id;
          const priceId = selectedRows[0].effect_price.id;
          this._confirmationService.confirm({
            key: 'confirmEffectPriceDelete',
            accept: () => {
              this.effectPriceService.deleteEffectPrice(this.clientId, effectId, priceId)
                .then(() => {
                  this._messageService.add({
                    key: 'confirmEffectPriceDelete',
                    severity: 'success',
                    summary: 'Eliminado!',
                    detail: 'El precio de efecto para el cliente ha sido eliminado!.'
                  });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this._messageService.add({ key: 'confirmEffectPriceDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
                })
                .finally(() => action.loading = false);
            },
            reject: () => {
              this._messageService.add({ key: 'confirmEffectPriceDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' });
              action.loading = false;
            }
          });
        }
      }
    ]
  };

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    private _route: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _dialogService: DialogService,
    private _messageService: MessageService,
    public effectPriceService: EffectPriceService
  ) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];
    })
  }
}
