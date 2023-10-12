import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SimpleTableColumnProps, SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';

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

    return '';
  }
}
