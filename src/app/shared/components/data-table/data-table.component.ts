import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DataTableActionProps, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<TEntity> implements OnInit {

  @Input() tableConfig!: DataTableConfiguration;
  @Input() sourceDataService!: IFetchPaginatedData<TEntity>;

  public isLoading: boolean = false;

  public data: Array<TEntity> = [];
  public totalRecords: number = 0;

  public selectedRecords?: any;

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
  }

  loadData(event: LazyLoadEvent): void {
    this.isLoading = true;

    const pageCurrentIndex = (event.first ?? 0);
    const pageSize = event.rows ?? 10;
    const page = (pageCurrentIndex / pageSize) + 1;
    const sort = event.sortField ?? '';
    const sortOrder = event.sortOrder?.toString() === '1' ? 'asc' : 'desc';

    this.sourceDataService.fetchPaginatedResource({ filter: '', page, pageSize, sort, sortOrder })
      .then((res) => {
        this.data = res.data;
        this.totalRecords = res.totalCount;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  executeActionCallback(action: DataTableActionProps, selectedId?: string): void {
    if (!this.requireSelectedRows(action)) {
      action.callback([]);
      return;
    }

    if (!this.isSelectionEnabled() && selectedId) {
      action.callback([selectedId]);
      return;
    }

    if (this.isMultipleSelection()) {
      const selectedRows = this.selectedRecords ?? [];
      const selectedIds = selectedRows.map((record: any) => record[this.tableConfig.identifierName]);
      action.callback(selectedIds);
      return;
    }

    const selectedIds = [this.selectedRecords[this.tableConfig.identifierName] ?? ''];
    action.callback(selectedIds);
  }

  hasActions(): boolean {
    const actions = this.tableConfig.actions ?? [];

    return actions && actions.length > 0;
  }

  requireSelectedRows(action: DataTableActionProps): boolean {
    return action.requireSelectedRows ?? false;
  }

  isSelectionEnabled(): boolean {
    const selectionType = this.tableConfig.selectionType ?? DataTableSelectionType.NONE;

    return selectionType === DataTableSelectionType.SINGLE || selectionType === DataTableSelectionType.MULTIPLE;
  }

  isMultipleSelection(): boolean {
    const selectionType = this.tableConfig.selectionType ?? DataTableSelectionType.SINGLE;

    return selectionType === DataTableSelectionType.MULTIPLE;
  }

  getSelectionMode(): string {
    const selectionType = this.tableConfig.selectionType ?? DataTableSelectionType.NONE;

    return selectionType;
  }

  generateActionColor(action: DataTableActionProps): string {
    const baseClassName = 'p-button-';
    const defaultName = 'success';

    return baseClassName.concat(action.status ?? defaultName);
  }

  generateActionIcon(action: DataTableActionProps): string {
    const baseIconClassName = 'pi pi-';
    const defaultName = 'eye';

    return baseIconClassName.concat(action.icon ?? defaultName);
  }
}
