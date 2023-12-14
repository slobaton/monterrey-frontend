export type DataTableConfiguration = {
  columns: Array<DataTableColumnProps>;
  identifierPropRef: string,
  selectionType?: DataTableSelectionType;
  actions?: Array<DataTableActionProps>;
}

export type DataTableColumnProps = {
  title: string;
  propertyRef: string;
  customValue?: (row: any) => string,
  visible?: boolean;
  sortable?: boolean;
  type?: DataTableColumnType;
}

export type DataTableActionProps = {
  title?: string,
  tooltip?: string,
  icon?: string,
  status?: DataTableActionStatus,
  selectionConfig?: DataTableActionSelectionConfig,
  hasLoadingEnabled?: boolean,
  loading?: boolean,
  hidden?: boolean,
  disabled?: boolean,
  callback: (action: DataTableActionProps, selectedRows: Array<any>) => void
}

export type DataTableActionSelectionConfig = {
  isRequired?: boolean,
  minSelectedRows?: number
  maxSelectedRows?: number
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

export enum DataTableColumnType {
  TEXT,
  BOOLEAN,
  DATE,
  DATETIME,
  BADGE,
  CUSTOM
}
