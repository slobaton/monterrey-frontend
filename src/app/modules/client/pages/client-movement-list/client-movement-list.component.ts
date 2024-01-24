import { AccountBalance } from './../../../../@core/models/account-balance';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityService } from '@casl/angular';
import { MessageService } from 'primeng/api';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AccountMovementType } from 'src/app/@core/enums/movement-type.enum';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AccountMovementService } from 'src/app/@core/services/rest/account-movement.service';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';

@Component({
  selector: 'app-client-movement-list',
  templateUrl: './client-movement-list.component.html',
  styleUrls: ['./client-movement-list.component.scss']
})
export class ClientMovementListComponent extends ProtectedComponent implements OnInit {

  clientId: string = '';
  accountBalance: AccountBalance | null = null;
  balance: number = 0;

  currentDate: Date = new Date();
  selectedDate: string = `${(this.currentDate.getMonth() + 1)}/${this.currentDate.getFullYear()}`;

  public tableConfig: SimpleTableConfiguration = {
    columns: [
      {
        title: 'Fecha',
        propertyRef: 'date',
        type: SimpleTableColumnType.DATE
      },
      {
        title: '# Orden',
        propertyRef: 'code',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Tipo Movimiento',
        propertyRef: 'type',
        type: SimpleTableColumnType.BADGE,
        customValue: (type) => type === AccountMovementType.PAYMENT ? 'Pago' : 'Deuda'
      },
      {
        title: 'Monto',
        propertyRef: 'amount',
        type: SimpleTableColumnType.TEXT
      },
      {
        title: 'Balance',
        propertyRef: 'balance_debt',
        type: SimpleTableColumnType.TEXT
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
    private _movementService: AccountMovementService,
    private _clientService: ClientService) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];
      this._movementService.getMovements(this.clientId)
        .then((accountBalance) => {
          this.accountBalance = accountBalance;
          this.balance = accountBalance.final_balance;
        })
        .catch((err) => {
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
    console.log(this.selectedDate);
  }
}
