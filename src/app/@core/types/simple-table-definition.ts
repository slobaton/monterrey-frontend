export type SimpleTableConfiguration = {
  columns: Array<SimpleTableColumnProps>;
  identifierPropRef: string,
}

export type SimpleTableColumnProps = {
  title: string;
  propertyRef: string;
  customValue?: (row: any) => string,
  visible?: boolean;
  sortable?: boolean;
  type?: SimpleTableColumnType;
}

export enum SimpleTableColumnType {
  TEXT,
  BOOLEAN,
  DATE,
  DATETIME,
  CUSTOM
}
