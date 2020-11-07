import React, {useCallback, useEffect, useMemo, useState} from "react";
import {SingleTableProps} from "./types";
import "./SingleTable.css";
import {Button} from "@material-ui/core";
import {TableCheckout} from "./TableCheckout";
import store from "../../store/store";
import {StateChangeActionType} from "../../store/actions";
import {connect} from "react-redux";
import {DishData, GuestOrderInfo, SingleGuestOrder} from "./SingleGuestOrder";
import {AppState, DishStatus, dishStatusMapping, SideMenuType} from "../../types";
import {AddDishToMenu} from "../menu/AddDishToMenu";
import {getAllGuestsDishesByTable} from "../../api/guests";
import {Dialog} from "../dialog/Dialog";
import {keyToCardPrefix, SelectCardDialog} from "./SelectCardDialog";
import {Card} from "../../api/guestCards";
import {getAllDishesInMenuRequest} from "../../api/menu";
import {setUpAnIntervalPollingOfFunction} from "../utils";

enum TableState {
  NO_SELECTED,
  DEFAULT,
  COUNT
}

const SingleTable = (props: SingleTableProps): JSX.Element => {
  const { selectedId, setLastSelectedTable } = props;
  const [currentState, setCurrentState] = useState<TableState>(TableState.NO_SELECTED);
  const [cardDialogVisible, setCardDialogVisible] = useState<boolean>(false);
  const [card, setCard] = useState<Card| null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [data, setData] = useState<GuestOrderInfo[]>();
  const allSelectedDishesServed = useMemo(() =>
    data?.flatMap((el) => el.positions).map(el=>el.status).reduce((prev, curr) => prev && curr === DishStatus.SERVED, true)
  , [data]);

  useEffect(() => {
    const card = localStorage.getItem(keyToCardPrefix+props.selectedId);
    if(card) setCard(JSON.parse(card));
  }, [props.selectedId]);

  const addNewDishToGuestHandler = useCallback(setSelectedGuestId, []);

  const updateGuestsData = useCallback(() => {
    props.selectedId && getAllGuestsDishesByTable(props.selectedId).then((response) => {
      const receivedData = response['guests']?.map((el: any) => {
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

  const onCardDialogOpen = useCallback(() => setCardDialogVisible(true), []);

  useEffect(() => {
    if(selectedId !== null) setCurrentState(TableState.DEFAULT);
    else setCurrentState(TableState.NO_SELECTED);

    return setUpAnIntervalPollingOfFunction(updateGuestsData);
  }, [selectedId]);

  const menuDishListFetch = useCallback(() => getAllDishesInMenuRequest()
      .then((response) => {
        return {
          dishes: response?.menu.filter((el: any) => el['available'] === true).map((el) => el.dish)
        };
      }), []);

  return (
    <div className="singleTablePage">

      {cardDialogVisible && selectedId && <SelectCardDialog
          tableId={selectedId}
          onCancel={() => setCardDialogVisible(false)}
          onAdd={(card) => { setCard(card); setCardDialogVisible(false) }}
      />}

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
          renderBody={() => <AddDishToMenu
              onFinished={updateGuestsData}
              selectedGuestId={selectedGuestId}
              dishRequest={menuDishListFetch}
          />}
      />}

      {currentState === TableState.COUNT && selectedId ?
               <TableCheckout
                 onCardDialogOpen={onCardDialogOpen}
                 tableId={selectedId}
                 card={card}
                 onCancel={() => setCurrentState(TableState.DEFAULT)}
                 onAccept={() => {
                   setCurrentState(TableState.NO_SELECTED);
                   setLastSelectedTable(null);
                 }}
                 setCurrentMenuItem={props.setCurrentMenuItem}
               />
            : currentState === TableState.DEFAULT
                ? <>
                    <div className="headerWrapper">
                      <div className="header panelTitle">Столик № {props.selectedId}</div>
                      <div className="btnHolder">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onCardDialogOpen}
                            style={{marginRight: 10}}
                        >
                          Выбрать карту постоянного клиента
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setCurrentState(TableState.COUNT)}
                            disabled={!allSelectedDishesServed}
                        >
                          Рассчитать столик
                        </Button>
                      </div>
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
                :"Выберите столик"
      }
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
