import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DataTableDefinition } from 'src/app/@core/models/common/data-table-definition';
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
    console.log(this.tableDefinition);
  }

  loadData($event: LazyLoadEvent) {
    this.isLoading = true;

    setTimeout(() => {
      console.log($event);
      this.sourceData.fetchPaginatedResource({ filter: '', page: $event.first ?? 0 + 1, pageSize: $event.rows ?? 10, sort: $event.sortField ?? '', sortOrder: $event.sortOrder?.toString() ?? '' })
    }, 1000);
  }
}
