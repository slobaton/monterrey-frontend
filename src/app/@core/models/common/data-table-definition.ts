export class DataTableDefinition<TEntity> {
  public columns: Array<DataTableColumnProps> = [];
  public selectionType: DataTableSelectionType = DataTableSelectionType.NONE;
  public actions: Array<DataTableActionProps> = [];
}

export class DataTableColumnProps {
  constructor(
    public title: string,
    public propertyRef: string,
    public sortable: boolean,
    public filterable: boolean
  ) { }
}

export class DataTableActionProps {
  constructor(
    public tooltip: string,
    public icon: string,
    public status: DataTableActionStatus,
    public callback: (id: string) => void
  ) { }
}

export enum DataTableActionStatus {
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  DANGER = 'danger'
}

export enum DataTableSelectionType {
  NONE,
  SINGLE,
  MULTIPLE
}
