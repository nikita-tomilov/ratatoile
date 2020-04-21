import React from "react";
import { TableData, TableState } from "../../api/tables";
import "./Tables.css";

export interface ITableProps {
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
  return (
    <div
      style={{
        width: `${props.tableData.guiW * 100}%`,
        height: `${props.tableData.guiH * 100}%`,
        top: `${props.tableData.guiY * 100}%`,
        left: `${props.tableData.guiX * 100}%`,
        background: props.isAdmin
          ? colorMapAdmin[props.tableData.state]
          : colorMapUser[props.tableData.state],
      }}
      className={"singleTable"}
    >
      {props.tableData.id}
    </div>
  );
};
