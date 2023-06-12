export type DataTableConfiguration = {
  columns: Array<DataTableColumnProps>;
  identifierPropRef: string,
  selectionType?: DataTableSelectionType;
  actions?: Array<DataTableActionProps>;
}

export type DataTableColumnProps = {
  title: string;
  propertyRef: string;
  sortable: boolean;
}

export type DataTableActionProps = {
  title?: string,
  tooltip?: string,
  icon?: string,
  status?: DataTableActionStatus,
  requireSelectedRows?: boolean,
  callback: (selectedIds: Array<string>) => void
}

export enum DataTableActionStatus {
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  DANGER = 'danger',
}

export enum DataTableSelectionType {
  NONE = 'none',
  SINGLE = 'single',
  MULTIPLE = 'multiple'
}
