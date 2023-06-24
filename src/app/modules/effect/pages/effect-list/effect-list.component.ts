import { Component, ViewChild } from '@angular/core';
import { Effect } from 'src/app/@core/models/effect';
import {
  DataTableActionStatus,
  DataTableColumnType,
  DataTableConfiguration,
  DataTableSelectionType
} from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

@Component({
  selector: 'app-effect-list',
  templateUrl: './effect-list.component.html',
  styleUrls: ['./effect-list.component.scss']
})
export class EffectListComponent {
  // @ViewChild('clientTable') table!: DataTableComponent<Client>;

}
