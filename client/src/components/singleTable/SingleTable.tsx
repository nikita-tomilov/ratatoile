import React, {useCallback, useEffect, useState} from "react";
import {SingleTableProps, TableEstimateResponse} from "./types";
import "./SingleTable.css";
import {Button} from "@material-ui/core";
import {finishCatering} from "../../api/tables";
import {TableEstimationData} from "./TableEstimationData";
import store from "../../store/store";
import {StateChangeActionType} from "../../store/actions";
import {connect} from "react-redux";
import {DishData, GuestOrderInfo, SingleGuestOrder} from "./SingleGuestOrder";
import {AppState, dishStatusMapping, SideMenuType} from "../../types";
import {AddDishToMenu} from "../menu/AddDishToMenu";
import {getAllGuestsDishesByTable} from "../../api/guests";
import {Dialog} from "../dialog/Dialog";

const SingleTable = (props: SingleTableProps): JSX.Element => {
  const { selectedId, setLastSelectedTable } = props;
  const [
    tableEstimatedData,
    setTableEstimatedData,
  ] = useState<TableEstimateResponse | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [data, setData] = useState<GuestOrderInfo[]>();

  const estimateTable = useCallback(() => {
    selectedId &&
      finishCatering(selectedId).then((data) => {
        setLastSelectedTable(null);
        if (data) setTableEstimatedData(data);
      });
  }, [selectedId, setLastSelectedTable]);

  const addNewDishToGuestHandler = useCallback(setSelectedGuestId, []);

  const updateGuestsData = useCallback(() => {
    props.selectedId && getAllGuestsDishesByTable(props.selectedId).then((response) => {
      const receivedData = response['guests'].map((el: any) => {
        return {
          guestId: el['guestId'],
          positions: el['positions'].map((p: any) => {
            return {
              name: p['dishName'],
              id: p['orderItem']['id'],
              price: p['price'],
              status: dishStatusMapping(p['orderItem']['status'])
            } as DishData
          }),
          total: el['sumPerGuest']} as GuestOrderInfo;
      });
      setData(receivedData);
    });
  }, [props.selectedId]);

  useEffect(updateGuestsData, []);

  return (
    <div className="singleTablePage">
      {props.selectedId !== null ? (
        <>
          <div className="headerWrapper">
            <div className="header panelTitle">Столик № {props.selectedId}</div>
            <Button
                disabled={tableEstimatedData !== null}
                variant="contained"
                color="primary"
                onClick={estimateTable}
            >
              Рассчитать столик
            </Button>
          </div>
          <div className="body">
            <div className="allGuests">
              {data?.map((guest, index) =>
                  <SingleGuestOrder
                      displayId={index + 1}
                      dishes={guest}
                      onAddNewDishToGuest={addNewDishToGuestHandler}
                      onStatusChange={updateGuestsData}
                  />)}
            </div>
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

      {selectedGuestId && <Dialog
          renderHeader={() => <div className='titleWrapper'>
            <div className='title'>Выберите блюдо</div>
            <Button
                size='small'
                variant="outlined"
                color="primary"
                onClick={() => setSelectedGuestId(null)}
            >
              Отмена
            </Button>
          </div>
          }
          renderBody={() => <AddDishToMenu onFinished={updateGuestsData} selectedGuestId={selectedGuestId}/>}
      />}
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
