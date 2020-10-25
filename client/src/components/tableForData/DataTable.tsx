import React, { useMemo } from "react";
import { DataTableProps } from "./types";
import "./DataTable.css";

export const DataTable = (props: DataTableProps): JSX.Element | null => {
  const { scheme, data } = props;
  const header = useMemo(() => {
    return (
      <div className="headerRow">
        {Object.entries(scheme).map((el) => {
          return (
            <div className="headerCell"
                 key={el[0]}
                 style={ el[1].width ? {flex: `1 0 ${el[1].width}px`} : {}}
            >
              {el[1].label || el[0]}
            </div>
          );
        })}
      </div>
    );
  }, [scheme]);
  const body = useMemo(() => {
    return data ? (
      <>
        {data.map((singleData, index) => {
          return (
            <div className="dataTableRow" key={"dataRow" + index}>
              {Object.entries(scheme).map((field) => {
                const d = singleData[field[0]];
                return (
                  <div
                    className="dataTableCell"
                    key={"data" + index + field[0]}
                    style={ field[1].width ? {flex: `1 0 ${field[1].width}px`} : {}}
                  >
                    {field[1].renderer
                      ? field[1].renderer(singleData, index)
                      : field[1].formatter
                      ? field[1].formatter(d)
                      : d}
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    ) : null;
  }, [scheme, data]);
  return Object.keys(scheme).length > 0 ? (
    <div className="dataTableWrapper">
      {header}
      {body}
    </div>
  ) : null;
};
