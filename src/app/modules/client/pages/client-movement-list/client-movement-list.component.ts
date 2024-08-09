import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityService } from '@casl/angular';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DateTime } from 'luxon';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AccountMovementType } from 'src/app/@core/enums/movement-type.enum';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AccountMovementService } from 'src/app/@core/services/rest/account-movement.service';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';
import { AccountMovement, ProcessedAccountMovement } from 'src/app/@core/models/account-balance';
import { Client } from 'src/app/@core/models/client';
import { DateService } from 'src/app/@core/services/common/date.service';
import { ReportService } from 'src/app/@core/services/rest/report.service';
import { PrintService } from 'src/app/@core/services/common/print.service';

@Component({
  selector: 'app-client-movement-list',
  templateUrl: './client-movement-list.component.html',
  styleUrls: ['./client-movement-list.component.scss']
})
export class ClientMovementListComponent extends ProtectedComponent implements OnInit {

  clientId: string = '';
  client: Client | null = null;
  balance: number = 0;

  currentDate: Date = this._dateService.getCurrentDate();
  startDate: Date = this.currentDate;
  endDate: Date = this.currentDate;
  processedMovements: ProcessedAccountMovement[] = [];

  isProcessingReport: boolean = false;

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
    ],
    identifierPropRef: 'id',
  };

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _dialogService: DialogService,
    private _movementService: AccountMovementService,
    private _clientService: ClientService,
    private _reportService: ReportService,
    private _dateService: DateService,
    private _printService: PrintService) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];

      this.fetchClient();

      this._clientService.getMovements(this.clientId)
        .then((accountBalance) => {
          if (accountBalance.start_date) {
            const startDate = DateTime.fromISO(accountBalance.start_date, { zone: 'America/La_Paz' });
            this.startDate = startDate.toJSDate();
          }

          if (accountBalance.end_date) {
            const endDate = DateTime.fromISO(accountBalance.end_date, { zone: 'America/La_Paz' });
            this.endDate = endDate.toJSDate();
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

  async printMonthlyReport() {
    this.isProcessingReport = true;
    const reportUrl = await this._reportService.getAccountMovementsPrintReportUrl(
      this.clientId,
      this._dateService.getOnlyDateString(this.startDate),
      this._dateService.getOnlyDateString(this.endDate)
    );

    this._printService.printPdf(reportUrl, () => this.isProcessingReport = false);
  }

  getTitle(): string {
    return `Cliente: ${this.client?.name ?? ''} ${this.client?.paternal_surname ?? ''} ${this.client?.maternal_surname ?? ''} - Estado de Cuenta`;
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
