import React, { useCallback, useState } from "react";
import { SingleTableProps, TableEstimateResponse } from "./types";
import "./SingleTable.css";
import { Button } from "@material-ui/core";
import { finishCatering } from "../../api/tables";
import { TableEstimationData } from "./TableEstimationData";
import store, { AppState } from "../../store/store";
import { StateChangeActionType } from "../../store/actions";
import { SideMenuType } from "../SideMenu";
import { connect } from "react-redux";

const SingleTable = (props: SingleTableProps): JSX.Element => {
  const { selectedId, setLastSelectedTable } = props;
  const [
    tableEstimatedData,
    setTableEstimatedData,
  ] = useState<TableEstimateResponse | null>(null);

  const estimateTable = useCallback(() => {
    selectedId &&
      finishCatering(selectedId).then((data) => {
        setLastSelectedTable(null);
        if (data) setTableEstimatedData(data);
      });
  }, [selectedId, setLastSelectedTable]);
  return (
    <div className="singleTablePage">
      {props.selectedId !== null ? (
        <>
          <div className="header panelTitle">Столик № {props.selectedId}</div>
          <div className="body">
            <Button
              disabled={tableEstimatedData !== null}
              variant="contained"
              color="primary"
              onClick={estimateTable}
            >
              Рассчитать столик
            </Button>
          </div>
        </>
      ) : (
        tableEstimatedData === null && "Выберите столик"
      )}

      {tableEstimatedData ? (
        <TableEstimationData
          data={tableEstimatedData}
          setCurrentMenuItem={props.setCurrentMenuItem}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (store: AppState) => {
  return {
    selectedId: store.lastSelectedTableId,
  };
};

const mapDispatchToProps = () => {
  return {
    setLastSelectedTable: (id: number | null) => {
      store.dispatch({
        type: StateChangeActionType.SET_LAST_SELECTED_TABLE_ID,
        payload: id,
      });
    },
    setCurrentMenuItem: (nextMenuItem: SideMenuType) => {
      store.dispatch({
        type: StateChangeActionType.SET_CURRENT_MENU_ITEM,
        payload: nextMenuItem,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SingleTable);
