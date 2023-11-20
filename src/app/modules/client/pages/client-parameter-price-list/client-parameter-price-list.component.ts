import { Component, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParameterPrice } from 'src/app/@core/models/parameter-price';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpsertParameterPriceComponent } from '../../components/upsert-parameter-price/upsert-parameter-price.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParameterPriceService } from 'src/app/@core/services/rest/parameter-price.service';

@Component({
  selector: 'app-client-parameter-price-list',
  templateUrl: './client-parameter-price-list.component.html',
  styleUrls: ['./client-parameter-price-list.component.scss']
})
export class ClientParameterPriceListComponent {
  @ViewChild('parameterPricesTable') table!: DataTableComponent<ParameterPrice>;

  public clientId: string = '';

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Parametero', propertyRef: 'name', sortable: false },
      { title: 'Precio Original (Bs.)', propertyRef: 'price' },
      {
        title: 'Precio Cliente (Bs.)',
        propertyRef: 'parameter_price.price',
        type: DataTableColumnType.CUSTOM,
        customValue: (row: ParameterPrice) => `${row.parameter_price.price}`
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
        callback: () => {
          this.ref = this._dialogService.open(UpsertParameterPriceComponent, { header: 'Asignar Precio', data: { clientId: this.clientId } });
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
        callback: (action, selectedRows) => {
          const parameterPrice = selectedRows[0];
          this.ref = this._dialogService.open(UpsertParameterPriceComponent, { header: 'Asignar Precio', data: { parameterPrice, clientId: this.clientId } });
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
        callback: (action, selectedRows) => {
          const parameterId = selectedRows[0].id;
          const priceId = selectedRows[0].parameter_price.id;
          this._confirmationService.confirm({
            key: 'confirmParameterPriceDelete',
            accept: () => {
              this.parameterPriceService.deleteParameterPrice(this.clientId, parameterId, priceId)
                .then(() => {
                  this._messageService.add({
                    key: 'confirmParameterPriceDelete',
                    severity: 'success',
                    summary: 'Eliminado!',
                    detail: 'El precio del parametro para el cliente ha sido eliminado!.'
                  });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this._messageService.add({ key: 'confirmParameterPriceDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
                })
                .finally(() => action.loading = false);
            },
            reject: () => {
              this._messageService.add({ key: 'confirmParameterPriceDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' });
              action.loading = false
            }
          });
        }
      }
    ]
  };

  constructor(
    private _route: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _dialogService: DialogService,
    private _messageService: MessageService,
    public parameterPriceService: ParameterPriceService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];
    })
  }
}
