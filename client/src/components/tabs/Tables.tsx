import React, { useCallback, useEffect, useState } from "react";
import "./Tables.css";
import { getAllTablesWithReservations, TableData } from "../../api/tables";
import { connect } from "react-redux";
import store, { AppState } from "../../store/store";
import { StateChangeActionType } from "../../store/actions";
import { Table } from "./Table";
import { getUserService } from "../../services/userService";
import { InfoBox } from "./InfoBox";

const userService = getUserService();

interface ITablesProps {
  tables: TableData[];
  setTablesData: (tables: TableData[]) => void;
}

export const Tables = (props: ITablesProps): JSX.Element => {
  const [isAdmin, setIsAdmin] = useState(null as boolean | null);
  const [selectedTableData, setSelectedTableData] = useState(
    null as TableData | null
  );

  useEffect(() => {
    userService.hasAdminRole().then((data) => setIsAdmin(data));
  }, []);
  useEffect(() => {
    getAllTablesWithReservations().then((data) => {
      data?.tables && props.setTablesData(data?.tables);
    });
  }, [props, props.setTablesData]);

  const tableSelectHandler = useCallback(
    (tableId: number) => {
      const selected = props.tables.find((el) => el.id === tableId);
      if (selected) {
        setSelectedTableData(selected);
      }
    },
    [props.tables]
  );

  const closeInfoBoxHandler = useCallback(() => {
    setSelectedTableData(null);
  }, []);

  return isAdmin ? (
    <div className={"tablesWrapper"}>
      {props.tables.map((tableData) => (
        <Table
          key={tableData.id}
          tableData={tableData}
          isAdmin={isAdmin}
          onTableSelect={tableSelectHandler}
        />
      ))}
      {selectedTableData && (
        <InfoBox onClose={closeInfoBoxHandler} selected={selectedTableData} />
      )}
    </div>
  ) : (
    <div>Wait for load</div>
  );
};

const mapStateToProps = (store: AppState) => {
  return {
    tables: store.tables,
  };
};

const mapDispatchToProps = () => {
  return {
    setTablesData: (tables: TableData[]) =>
      store.dispatch({
        type: StateChangeActionType.SET_TABLES_DATA,
        payload: tables,
      }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Tables);
