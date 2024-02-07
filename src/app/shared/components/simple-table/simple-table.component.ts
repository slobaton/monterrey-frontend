import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SimpleTableActionProps, SimpleTableColumnProps, SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent<TEntity> implements OnInit {
  @Input() tableConfig!: SimpleTableConfiguration;

  @Input() rowDetails: TemplateRef<any> | null = null;

  @Input() data: Array<TEntity> = [];

  @ViewChild('simpleTableRef') simpleTable!: Table;

  public columnType = SimpleTableColumnType;

  constructor() { }

  ngOnInit(): void {
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
