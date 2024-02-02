import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityService } from '@casl/angular';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AccountMovementType } from 'src/app/@core/enums/movement-type.enum';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AccountMovementService } from 'src/app/@core/services/rest/account-movement.service';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { SimpleTableActionStatus, SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';
import { WashOrderInfoComponent } from 'src/app/modules/wash-order/components/wash-order-info/wash-order-info.component';
import { AccountMovement, ProcessedAccountMovement } from 'src/app/@core/models/account-balance';
import { Client } from 'src/app/@core/models/client';

@Component({
  selector: 'app-client-movement-list',
  templateUrl: './client-movement-list.component.html',
  styleUrls: ['./client-movement-list.component.scss']
})
export class ClientMovementListComponent extends ProtectedComponent implements OnInit {

  clientId: string = '';
  client: Client | null = null;
  balance: number = 0;

  currentDate: Date = new Date();
  startDate: Date = this.currentDate;
  endDate: Date = this.currentDate;
  processedMovements: ProcessedAccountMovement[] = [];

  public tableConfig: SimpleTableConfiguration = {
    columns: [
      {
        title: 'COD.',
        propertyRef: 'code',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Fecha',
        propertyRef: 'date',
        type: SimpleTableColumnType.DATE
      },
      {
        title: 'N.R.',
        propertyRef: 'receipt_number',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Prenda',
        propertyRef: 'cloth_type',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Tam.',
        propertyRef: 'cloth_size',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Detalle',
        propertyRef: 'description',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Cant.',
        propertyRef: 'quantity',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'P/U',
        propertyRef: 'unit_price',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Total',
        propertyRef: 'subtotal_price',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Pago/C',
        propertyRef: 'amount',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Saldo',
        propertyRef: 'balance_debt',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Tipo',
        propertyRef: 'type',
        type: SimpleTableColumnType.BADGE,
        customValue: (type) => {
          switch (type) {
            case AccountMovementType.CHARGE:
              return 'Deuda'
            case AccountMovementType.PAYMENT:
              return 'Pago'
            case AccountMovementType.DISCOUNT:
              return 'Descuento'
            default:
              return 'Desconocido'
          }
        }
      }
    ],
    identifierPropRef: 'id'
  };

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _dialogService: DialogService,
    private _movementService: AccountMovementService,
    private _clientService: ClientService) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];

      this.fetchClient();

      this._clientService.getMovements(this.clientId)
        .then((accountBalance) => {
          if (accountBalance.start_date) {
            const startDate = new Date(accountBalance.start_date);
            this.startDate = startDate;
          }

          if (accountBalance.end_date) {
            const endDate = new Date(accountBalance.end_date);
            this.endDate = endDate;
          }

          this.balance = accountBalance.final_balance;
          this.getMovements(accountBalance.movements);
        })
        .catch((err) => {
          console.error(err);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Algo ocurrio al cargar los movimientos del cliente.'
          });

          setTimeout(() => this._router.navigate(['/clients']), 2000);
        });
    })
  }

  showMonthlyReport() {
    console.log(this.startDate);
  }

  getTitle(): string {
    return `Cliente: ${this.client?.name} ${this.client?.paternal_surname} ${this.client?.maternal_surname} - Estado de Cuenta`;
  }

  private async fetchClient(): Promise<void> {
    this.client = await this._clientService.getById(this.clientId);
  }

  private getMovements(movements: AccountMovement[]) {
    movements.forEach((movement) => {
      if (movement.details && movement.details.length) {
        const processedDetails = movement.details.map(detail => {
          return {
            id: movement.id,
            code: movement.code,
            date: movement.date,
            receipt_number: null,
            cloth_type: detail.cloth_type,
            cloth_size: detail.cloth_size,
            description: detail.details,
            unit_price: detail.unit_price,
            quantity: detail.quantity,
            subtotal_price: detail.subtotal_price,
            amount: null,
            balance_debt: detail.balance_debt,
            type: movement.type
          };
        });
        this.processedMovements = [...this.processedMovements, ...processedDetails]
      } else {
        this.processedMovements.push({
          id: movement.id,
          code: null,
          date: movement.date,
          receipt_number: movement.receipt_number,
          cloth_type: null,
          cloth_size: null,
          description: movement.concept,
          unit_price: null,
          quantity: null,
          subtotal_price: null,
          amount: Math.abs(movement.amount),
          balance_debt: movement.balance_debt,
          type: movement.type
        });
      }
    });
  }
}
