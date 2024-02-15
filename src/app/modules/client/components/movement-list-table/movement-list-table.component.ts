import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SimpleTableActionProps, SimpleTableColumnProps, SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';
import { ProcessedAccountMovement } from 'src/app/@core/models/account-balance';
import { ConstantsService } from 'src/app/@core/services/common/constants.service';
import { DateService } from 'src/app/@core/services/common/date.service';

@Component({
  selector: 'app-movement-list-table',
  templateUrl: './movement-list-table.component.html',
  styleUrls: ['./movement-list-table.component.scss']
})
export class MovementListTableComponent implements OnInit, OnChanges {
  @Input() tableConfig!: SimpleTableConfiguration;

  @Input() data: Array<ProcessedAccountMovement> = [];

  @ViewChild('simpleTableRef') simpleTable!: Table;

  public columnType = SimpleTableColumnType;

  processedData: Array<any> = [];

  constructor(
    private _constantsService: ConstantsService,
    private _dateService: DateService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data && this.data.length) {
      if (this.data && this.data.length) {
        const groupedItems = this.data.reduce((prev, current) => {
          const date = this._dateService.getDateFromString(current.date);
          const month = date.getMonth();
          const year = date.getFullYear();

          const key = `Mes de ${this._constantsService.monthNames[month]} del ${year}`

          if (!prev[key]) {
            prev[key] = [];
          }

          prev[key].push(current);

          return prev;
        }, {} as { [key: string]: ProcessedAccountMovement[] });

        var months = Object.keys(groupedItems);

        let balancePrevMonth = 0;

        months.forEach(month => {
          const items = groupedItems[month] ?? [];

          this.processedData.push({
            monthHeader: month,
            monthBalanceDebt: balancePrevMonth
          });

          this.processedData.push(...items);

          balancePrevMonth = items[items.length - 1]?.balance_debt ?? 0;
        })
      }
    }
  }

  hasActions(): boolean {
    const actions = this.tableConfig.actions ?? [];

    return actions && actions.length > 0;
  }

  getColumnStyleByType(type: SimpleTableColumnType): string {
    let classStyles = '';

    switch (type) {
      case SimpleTableColumnType.BOOLEAN:
        classStyles = 'text-center'
        break;
    }

    return classStyles;
  }

  getColumnCustomValue(col: SimpleTableColumnProps, row: any) {
    if (col.type === SimpleTableColumnType.CUSTOM && col.customValue) {
      const value = col.customValue(row);
      return value;
    }

    if (col.type === SimpleTableColumnType.BADGE && col.customValue) {
      const value = col.customValue(row[col.propertyRef]);
      return value;
    }

    return '';
  }

  generateActionColor(action: SimpleTableActionProps): string {
    const baseClassName = 'p-button-';
    const defaultName = 'success';

    return baseClassName.concat(action.status ?? defaultName);
  }

  generateActionIcon(action: SimpleTableActionProps): string {
    const baseIconClassName = 'pi pi-';
    const defaultName = 'eye';

    return baseIconClassName.concat(action.icon ?? defaultName);
  }

  executeActionCallback(action: SimpleTableActionProps, selectedRow?: any): void {

    if (action.hasLoadingEnabled) {
      action.loading = true;
    }

    action.callback(action, selectedRow);
  }
}
