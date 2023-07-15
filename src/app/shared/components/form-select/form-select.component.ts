import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaginatedRequest } from 'src/app/@core/models/request/paginated-request';

import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss']
})
export class FormSelectComponent<TEntity> implements OnInit {

  @Input() form!: FormGroup;
  @Input() id: string = '';
  @Input() controlName: string = '';

  @Input() options: Array<any> = [];
  @Input() optionLabel: string = '';
  @Input() optionValue: string = '';

  @Input() placeholder: string = '';

  @Input() filterEnabled: boolean = false;

  @Input() isLazy: boolean = false;
  @Input() sourceDataService?: IFetchPaginatedData<TEntity>;

  ngOnInit(): void {
    if (this.isLazy && this.sourceDataService) {
      this.fetchData();
    }
  }

  async fetchData(filter = '') {
    const request: PaginatedRequest = {
      filter,
      page: 1,
      pageSize: 1000,
      sort: '',
      sortOrder: ''
    };

    const response = await this.sourceDataService?.fetchPaginatedResource(request)

    this.options = response?.data ?? [];
  }

  public get formControl() {
    return this.form.get(this.controlName);
  }
}
