import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WashTypePrice } from 'src/app/@core/models/wash-type-price';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import {
  DataTableActionStatus,
  DataTableColumnType,
  DataTableConfiguration,
  DataTableSelectionType
} from 'src/app/@core/types/data-table-definition';
import { WashTypePriceService } from 'src/app/@core/services/rest/wash-type-price.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpsertWashTypePriceComponent } from '../../components/upsert-wash-type-price/upsert-wash-type-price.component';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Component({
  selector: 'app-client-wash-type-price-list',
  templateUrl: './client-wash-type-price-list.component.html',
  styleUrls: ['./client-wash-type-price-list.component.scss']
})
export class ClientWashTypePriceListComponent extends ProtectedComponent implements OnInit {

  @ViewChild('washPricesTable') table!: DataTableComponent<WashTypePrice>;

  public clientId: string = '';

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Tipo Lavado', propertyRef: 'name', sortable: false },
      { title: 'Precio Original (Bs.)', propertyRef: 'price' },
      {
        title: 'Precio Cliente (Bs.)',
        propertyRef: 'wash_type_price.price',
        type: DataTableColumnType.CUSTOM,
        customValue: (row: WashTypePrice) => `${row.wash_type_price.price}`
      }
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo precio tipo lavado',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        hiddenFn: (selectedRows) => !this.ableTo('create', 'parameter'),
        callback: () => {
          this.ref = this._dialogService.open(UpsertWashTypePriceComponent, { header: 'Asignar Precio', data: { clientId: this.clientId } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar precio tipo lavado',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => !this.ableTo('update', 'parameter'),
        callback: (action, selectedRows) => {
          const washTypePrice = selectedRows[0];
          this.ref = this._dialogService.open(UpsertWashTypePriceComponent, { header: 'Asignar Precio', data: { washTypePrice, clientId: this.clientId } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Usuario',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: (selectedRows) => !this.ableTo('delete', 'parameter'),
        callback: (action, selectedRows) => {
          const washTypeId = selectedRows[0].id;
          const priceId = selectedRows[0].wash_type_price.id;
          this._confirmationService.confirm({
            key: 'confirmWashTypePriceDelete',
            accept: () => {
              this.washTypePriceService.deleteWashTypePrice(this.clientId, washTypeId, priceId)
                .then(() => {
                  this._messageService.add({
                    key: 'confirmWashTypePriceDelete',
                    severity: 'success',
                    summary: 'Eliminado!',
                    detail: 'El precio de lavado para el cliente ha sido eliminado!.'
                  });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this._messageService.add({ key: 'confirmWashTypePriceDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
                })
                .finally(() => action.loading = false);
            },
            reject: () => {
              this._messageService.add({ key: 'confirmWashTypePriceDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' });
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
    public washTypePriceService: WashTypePriceService
  ) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];
    })
  }
}
