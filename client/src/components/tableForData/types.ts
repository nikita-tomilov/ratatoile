export type DataTableProps = {
  scheme: Scheme;
  data: RowData[] | null;
};

export type RowData = {
  [key: string]: any;
};

export type Scheme = {
  [key: string]: {
    label?: string;
    formatter?: (value: any) => any;
    renderer?: (data: RowData, rowNumber: number) => JSX.Element;
  };
};
