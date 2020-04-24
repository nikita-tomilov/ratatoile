import React, { useCallback } from "react";
import { TableData, TableState } from "../../api/tables";
import "./Tables.css";

export interface ITableProps {
  onTableSelect: (tableId: number) => void;
  tableData: TableData;
  isAdmin: boolean;
}

const colorMapUser = {
  [TableState.FREE]: "green",
  [TableState.FREE_BUT_BOOKED]: "yellow",
  [TableState.SUPPOSED_TO_BE_BUSY]: "orange",
  [TableState.BUSY]: "red",
  [TableState.BUSY_BY_YOU]: "blue",
};

const colorMapAdmin = {
  ...colorMapUser,
  [TableState.BUSY]: "lightblue",
  [TableState.BUSY_BY_YOU]: "lightblue",
};

export const Table = (props: ITableProps): JSX.Element => {
  const { tableData } = props;
  const onMouseDown = useCallback(() => {
    props.onTableSelect(tableData.id);
  }, [props, tableData]);

  return (
    <div
      style={{
        width: `${tableData.guiW * 100}%`,
        height: `${tableData.guiH * 100}%`,
        top: `${tableData.guiY * 100}%`,
        left: `${tableData.guiX * 100}%`,
        background: props.isAdmin
          ? colorMapAdmin[tableData.state]
          : colorMapUser[tableData.state],
      }}
      className={"singleTable"}
      onMouseDown={onMouseDown}
    >
      {tableData.id}
    </div>
  );
};
