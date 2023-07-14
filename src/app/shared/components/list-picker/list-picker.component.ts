import { Component, Input, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { PaginatedRequest } from 'src/app/@core/models/request/paginated-request';
import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';

@Component({
  selector: 'app-list-picker',
  templateUrl: './list-picker.component.html',
  styleUrls: ['./list-picker.component.scss']
})
export class ListPickerComponent<TEntity> implements OnInit {

  @Input() sourceOptions: Array<TEntity> = [];

  @Input() filterEnabled: boolean = false;
  @Input() filterBy: string = '';
  @Input() filterPlaceholder: string = 'Buscar...';

  @Input() isLazy: boolean = false;
  @Input() sourceDataService?: IFetchPaginatedData<TEntity>;

  @Input() sourceHeader: string = '';
  @Input() targetHeader: string = '';

  @Input() isDragDropEnabled: boolean = false;

  @Input() item: TemplateRef<any> | null = null;

  @Output() onChangeSelection: EventEmitter<Array<TEntity>> = new EventEmitter<Array<TEntity>>();

  selectedOptions: Array<TEntity> = [];

  constructor() { }

  ngOnInit(): void {
    if (this.isLazy && this.sourceDataService) {
      this.fetchData();
    }
  }

  async fetchData() {
    const request: PaginatedRequest = {
      filter: '',
      page: 1,
      pageSize: 1000,
      sort: '',
      sortOrder: ''
    };

    const response = await this.sourceDataService?.fetchPaginatedResource(request)

    this.sourceOptions = response?.data ?? [];
  }

  changeSelection($event: any): void {
    this.onChangeSelection.emit(this.selectedOptions);
  }
}
