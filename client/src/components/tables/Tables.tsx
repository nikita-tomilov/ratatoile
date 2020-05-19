import React, { useCallback, useEffect, useState } from "react";
import "./Tables.css";
import { getAllTablesWithReservations } from "../../api/tables";
import { connect } from "react-redux";
import store, { AppState } from "../../store/store";
import { StateChangeActionType } from "../../store/actions";
import { Table } from "./Table";
import { getUserService } from "../../services/userService";
import { InfoBox } from "../infoBox/InfoBox";
import { ITablesProps } from "../infoBox/types";
import { TableData, TableState } from "../../api/types";

const userService = getUserService();

export const Tables = (props: ITablesProps): JSX.Element => {
  const { setTablesData, setLastSelectedTable, tables } = props;
  const [isAdmin, setIsAdmin] = useState(null as boolean | null);
  const [selectedTableData, setSelectedTableData] = useState(
    null as TableData | null
  );

  useEffect(() => {
    userService.hasAdminRole().then((data) => {
      setIsAdmin(data)
    });
  }, []);

  useEffect(() => {
    getAllTablesWithReservations().then((data) => {
      data?.tables && setTablesData(data?.tables);
    });
  }, [setTablesData, selectedTableData]);

  const tableSelectHandler = useCallback(
    (tableId: number) => {
      const selected = tables.find((el) => el.id === tableId);
      if (selected) {
        setSelectedTableData(selected);
        if (selected.state === TableState.BUSY_BY_YOU)
          setLastSelectedTable(tableId);
      }
    },
    [tables, setLastSelectedTable]
  );

  const closeInfoBoxHandler = useCallback(() => {
    setSelectedTableData(null);
  }, []);

  return isAdmin !== null ? (
    <div className="panelWrapper">
      <div className="panelTitle">Общий зал</div>
      <div className="tablesWrapper">
        {props.tables.map((tableData) => (
          <Table
            key={tableData.id}
            tableData={tableData}
            isAdmin={isAdmin}
            onTableSelect={tableSelectHandler}
            selectedTableId={selectedTableData && selectedTableData.id}
          />
        ))}
        {selectedTableData && (
          <InfoBox
            onClose={closeInfoBoxHandler}
            selected={selectedTableData}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  ) : (
    <div>Wait for load</div>
  );
};

const mapStateToProps = (store: AppState) => {
  return {
    tables: store.tables,
    selectedId: store.lastSelectedTableId,
  };
};

const mapDispatchToProps = () => {
  return {
    setTablesData: (tables: TableData[]) =>
      store.dispatch({
        type: StateChangeActionType.SET_TABLES_DATA,
        payload: tables,
      }),
    setLastSelectedTable: (id: number | null) => {
      store.dispatch({
        type: StateChangeActionType.SET_LAST_SELECTED_TABLE_ID,
        payload: id,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Tables);
