import { Component } from '@angular/core';
import { DataTableDefinition, DataTableSelectionType } from 'src/app/@core/models/common/data-table-definition';
import { User } from 'src/app/@core/models/user';
import { UserService } from 'src/app/@core/services/rest/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  public tableDef: DataTableDefinition<User> = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, filterable: false },
      { title: 'Username', propertyRef: 'username', sortable: true, filterable: false },
      { title: 'Email', propertyRef: 'email', sortable: true, filterable: false },
    ],
    selectionType: DataTableSelectionType.SINGLE,
    actions: []
  };

  constructor(public userService: UserService) { }
}
