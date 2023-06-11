import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DataTableActionProps, DataTableDefinition } from 'src/app/@core/models/common/data-table-definition';
import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<TEntity> implements OnInit {

  @Input() tableDefinition!: DataTableDefinition<TEntity>;
  @Input() sourceData!: IFetchPaginatedData<TEntity>;

  isLoading: boolean = false;

  data: Array<TEntity> = [];
  totalRecords: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
  }

  loadData(event: LazyLoadEvent) {
    this.isLoading = true;

    const pageCurrentIndex = (event.first ?? 0);
    const pageSize = event.rows ?? 10;
    const page = (pageCurrentIndex / pageSize) + 1;
    const sort = event.sortField ?? '';
    const sortOrder = event.sortOrder?.toString() === '1' ? 'asc' : 'desc';

    setTimeout(() => {
      this.sourceData.fetchPaginatedResource({ filter: '', page, pageSize, sort, sortOrder })
        .then((res) => {
          this.data = res.data;
          this.totalRecords = res.totalCount;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }, 1000);
  }

  hasActions(): boolean {
    return this.tableDefinition.actions && this.tableDefinition.actions.length > 0;
  }

  generateActionColor(action: DataTableActionProps): string {
    const baseClassName = 'p-button-rounded p-button-';
    const defaultName = 'success';

    return baseClassName.concat(action.status ?? defaultName);
  }

  generateActionIcon(action: DataTableActionProps): string {
    const baseIconClassName = 'pi pi-';
    const defaultName = 'eye';

    return baseIconClassName.concat(action.icon ?? defaultName);
  }
}
