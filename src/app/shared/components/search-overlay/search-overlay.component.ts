import { Component, EventEmitter, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';
import { DataTableActionStatus, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';

@Component({
  selector: 'app-search-overlay',
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.scss']
})
export class SearchOverlayComponent<TEntity> implements OnInit {

  public tableConfig!: DataTableConfiguration;
  public service!: IFetchPaginatedData<TEntity>;

  onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig) { }

  ngOnInit(): void {
    const tableConfig = this._config.data?.tableConfig;
    const service = this._config.data?.service;
    const onSelectEvent = this._config.data?.onSelectEvent;

    if (tableConfig && service) {
      this.tableConfig = tableConfig;
      this.service = service;
      this.onSelect = onSelectEvent;

      this.tableConfig.selectionType = DataTableSelectionType.SINGLE;
      this.tableConfig.actions = [
        {
          title: 'Seleccionar',
          icon: 'pi pi-check-circle',
          status: DataTableActionStatus.PRIMARY,
          callback: (action, selectedRows) => {
            const selectedRow = selectedRows[0];
            this.onSelect.emit(selectedRow);
            this._ref?.close();
          }
        }
      ];

      return;
    }

    throw new Error('overlay doesn\'t have the necessary arguments.');
  }
}
