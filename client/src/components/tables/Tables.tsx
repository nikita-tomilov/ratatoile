import React, {useCallback, useEffect, useState} from "react";
import "./Tables.css";
import {getAllTablesWithReservations} from "../../api/tables";
import {connect} from "react-redux";
import store from "../../store/store";
import {StateChangeActionType} from "../../store/actions";
import {Table} from "./Table";
import {InfoBox} from "../infoBox/InfoBox";
import {ITablesProps} from "../infoBox/types";
import {TableData, TableState} from "../../api/types";
import {AppState} from "../../types";
import {AppRole} from "../../api/user";

export const Tables = (props: ITablesProps): JSX.Element => {
  const { setTablesData, setLastSelectedTable, tables, roles } = props;
  const [selectedTableData, setSelectedTableData] = useState(
    null as TableData | null
  );

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

  return <div className="hall">
    <div className="panelTitle">Общий зал</div>
    <div className="tablesWrapper">
      {props.tables.map((tableData) => (
          <Table
              key={tableData.id}
              tableData={tableData}
              isManager={roles.includes(AppRole.MANAGER)}
              onTableSelect={tableSelectHandler}
              selectedTableId={selectedTableData && selectedTableData.id}
          />
      ))}
      {selectedTableData && (
          <InfoBox
              onClose={closeInfoBoxHandler}
              selected={selectedTableData}
              isManager={roles.includes(AppRole.MANAGER)}
          />
      )}
    </div>
  </div>;
};

const mapStateToProps = (store: AppState) => {
  return {
    tables: store.tables,
    selectedId: store.lastSelectedTableId,
    roles: store.roles,
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
