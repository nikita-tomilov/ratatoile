import React, { useCallback } from "react";
import "./Tables.css";
import { colorMapAdmin, colorMapUser } from "./constants";
import { ITableProps } from "../infoBox/types";

export const Table = (props: ITableProps): JSX.Element => {
  const { tableData, selectedTableId } = props;
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
        background: props.isManager
          ? colorMapAdmin[tableData.state]
          : colorMapUser[tableData.state],
        opacity: selectedTableId && selectedTableId !== tableData.id ? 0.25 : 1,
      }}
      className={selectedTableId ? "selectedTable" : "singleTable"}
      onMouseDown={onMouseDown}
    />
  );
};
