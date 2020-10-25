import { TableData } from "../../api/types";
import {AppRole} from "../../api/user";

export interface ITableProps {
  onTableSelect: (tableId: number) => void;
  tableData: TableData;
  isManager: boolean;
  selectedTableId: number | null;
}

export interface ITablesProps {
  tables: TableData[];
  selectedId: number | null;
  roles: AppRole[];
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
  isManager: boolean;
};
