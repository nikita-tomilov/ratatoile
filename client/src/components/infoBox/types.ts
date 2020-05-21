import { TableData } from "../../api/types";

export interface ITableProps {
  onTableSelect: (tableId: number) => void;
  tableData: TableData;
  isAdmin: boolean;
  selectedTableId: number | null;
}

export interface ITablesProps {
  tables: TableData[];
  selectedId: number | null;
  isAdmin: boolean | null;
  setTablesData: (tables: TableData[]) => void;
  setLastSelectedTable: (id: number | null) => void;
}

export type SimpleObjectType = { [key: string]: any };
export type TableConfig = {
  title: string;
  fields: string[];
};

export type InfoBoxProps = {
  onClose: () => void;
  selected: TableData;
  isAdmin: boolean;
};
