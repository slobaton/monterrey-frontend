import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, AfterViewInit, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { PaginatedRequest } from 'src/app/@core/models/request/paginated-request';
import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';

@Component({
  selector: 'app-list-picker',
  templateUrl: './list-picker.component.html',
  styleUrls: ['./list-picker.component.scss']
})
export class ListPickerComponent<TEntity> implements OnInit, OnChanges {

  @Input() key: string = 'id';

  @Input() sourceOptions: Array<TEntity> = [];
  @Input() selectedOptions: Array<TEntity> = [];

  @Input() filterEnabled: boolean = false;
  @Input() filterBy: string = '';
  @Input() filterPlaceholder: string = 'Buscar...';

  @Input() isLazy: boolean = false;
  @Input() sourceDataService?: IFetchPaginatedData<TEntity>;

  @Input() sourceHeader: string = '';
  @Input() targetHeader: string = '';

  @Input() isDragDropEnabled: boolean = false;

  @Input() item: TemplateRef<any> | null = null;

  @Input() onReset?: EventEmitter<void>;

  @Output() onChangeSelection: EventEmitter<Array<TEntity>> = new EventEmitter<Array<TEntity>>();

  private _originalOptions: Array<TEntity> = [];
  private _optionsAlreadyInitialized: boolean = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._optionsAlreadyInitialized) {
      return;
    }

    const sourceOptions = changes['sourceOptions'];

    if (sourceOptions.currentValue && sourceOptions.currentValue.length > 0) {
      this._originalOptions = [...sourceOptions.currentValue];
      this._optionsAlreadyInitialized = true;
    }
  }

  ngOnInit(): void {
    if (this.isLazy && this.sourceDataService) {
      this.fetchData();
    }

    if (this.onReset) {
      this.onReset.subscribe(() => {
        this.resetSelection();
      });
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
    const data = response?.data.filter((item: any) => !this.selectedOptions.some((x: any) => x[this.key] === item[this.key]));

    this.sourceOptions = data ?? [];
  }

  changeSelection($event: any): void {
    this.onChangeSelection.emit(this.selectedOptions);
  }

  private resetSelection(): void {
    if (this.isLazy && this.sourceDataService) {
      this.fetchData();
    } else {
      this.sourceOptions = [...this._originalOptions];
    }

    this.selectedOptions = [];
  }
}
