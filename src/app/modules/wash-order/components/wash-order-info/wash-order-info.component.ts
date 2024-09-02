import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbilityService } from '@casl/angular';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppAbility } from 'src/app/@core/auth/ability';
import { OrderStatus } from 'src/app/@core/enums/order-status.enum';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { WashOrder, WashOrderDetail } from 'src/app/@core/models/wash-order';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { WashOrderDetailService } from 'src/app/@core/services/rest/wash-order-detail.service';
import { WashOrderService } from 'src/app/@core/services/rest/wash-order.service';
import { SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';

@Component({
  selector: 'app-wash-order-info',
  templateUrl: './wash-order-info.component.html',
  styleUrls: ['./wash-order-info.component.scss']
})
export class WashOrderInfoComponent extends ProtectedComponent implements OnInit {

  loading: boolean = true;

  washOrder: WashOrder | null = null;
  washOrderDetails: Array<WashOrderDetail> = [];

  washOrderDetailsTableConfig: SimpleTableConfiguration = {
    columns: [
      {
        title: 'T. Ropa',
        type: SimpleTableColumnType.CUSTOM,
        propertyRef: 'cloth_type.name',
        customValue: (row) => row.cloth_type.name,
      },
      {
        title: 'Tam. Ropa',
        type: SimpleTableColumnType.CUSTOM,
        propertyRef: 'cloth_size.name',
        customValue: (row) => row.cloth_size.name,
      },
      {
        title: 'Precio L. ($)',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'wash_price',
        visible: !this.hasReceptionistRole()
      },
      {
        title: 'Precio Ef. ($)',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'effect_price',
        visible: !this.hasReceptionistRole()
      },
      {
        title: 'Precio Foc. ($)',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'focalizado_price',
        visible: !this.hasReceptionistRole()
      },
      {
        title: 'Precio Nev. ($)',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'nevado_price',
        visible: !this.hasReceptionistRole()
      },
      {
        title: 'Precio Oj. ($)',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'buttonhole_unit_price',
        visible: !this.hasReceptionistRole()
      },
      {
        title: 'Precio U. ($)',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'unit_price',
        visible: !this.hasReceptionistRole()
      },
      {
        title: 'Cantidad',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'quantity'
      },
      {
        title: 'Subtotal ($)',
        type: SimpleTableColumnType.TEXT,
        propertyRef: 'subtotal_price',
        visible: !this.hasReceptionistRole()
      }
    ],
    identifierPropRef: 'id'
  }

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    private _washOrderService: WashOrderService,
    private _washOrderDetailService: WashOrderDetailService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    const washOrderId = this._config.data?.washOrderId;

    if (!washOrderId) {
      throw new Error('invalid wash order ID');
    }

    this._washOrderService.getById(washOrderId)
      .then(async (washOrder: WashOrder) => {
        this.washOrder = washOrder;
        this.washOrderDetails = (await this._washOrderDetailService.fetchPaginatedResource({
          filter: this.washOrder.id,
          page: 1,
          pageSize: 1000,
          sort: '',
          sortOrder: ''
        })).data;

        this.loading = false;
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 404) {
            this._messageService.add({
              severity: 'error',
              summary: `Orden invalida`,
              detail: 'La Orden de Lavado es invalida o no existe',
              life: 2000
            });
          }
        } else {
          this._messageService.add({
            severity: 'error',
            summary: `Error inesperado`,
            detail: 'Ocurrio un error inesperado al intentar obtener la order de lavado.',
            life: 2000
          });
        }

        setTimeout(() => {
          this._ref.close();
        }, 2000);
      });
  }

  getClientFullName() {
    const client = this.washOrder?.client;

    return `${client?.name} ${client?.paternal_surname ?? ''} ${client?.maternal_surname ?? ''}`;
  }

  getStatusName() {
    return WashOrder.getStatusFriendlyName(this.washOrder?.status ?? OrderStatus.UNKNOWN);
  }
}
