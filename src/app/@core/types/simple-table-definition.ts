export type SimpleTableConfiguration = {
  columns: Array<SimpleTableColumnProps>;
  identifierPropRef: string,
  actions?: Array<SimpleTableActionProps>
}

export type SimpleTableColumnProps = {
  title: string;
  propertyRef: string;
  customValue?: (row: any) => string,
  visible?: boolean;
  sortable?: boolean;
  type?: SimpleTableColumnType;
}

export type SimpleTableActionProps = {
  title?: string,
  tooltip?: string,
  icon?: string,
  status?: SimpleTableActionStatus,
  hasLoadingEnabled?: boolean,
  loading?: boolean,
  hiddenFn?: (selectedRow: any) => boolean,
  disabledFn?: (selectedRow: any) => boolean,
  callback: (action: SimpleTableActionProps, selectedRow: any) => void
}

export enum SimpleTableActionStatus {
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  DANGER = 'danger',
}

export enum SimpleTableColumnType {
  TEXT,
  BOOLEAN,
  DATE,
  DATETIME,
  CUSTOM,
  BADGE
}
