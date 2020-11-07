import React, {useCallback, useEffect, useState} from "react";
import { Button } from "@material-ui/core";
import { TableEstimationDataProps} from "./types";
import "./SingleTable.css";
import {SideMenuType} from "../../types";
import {finishCatering, preCheckout} from "../../api/tables";
import {keyToCardPrefix} from "./SelectCardDialog";
import {DataTable} from "../tableForData/DataTable";

export const TableCheckout = (
  props: TableEstimationDataProps
): JSX.Element => {
  const { setCurrentMenuItem, onCancel, tableId, onAccept, onCardDialogOpen, card } = props;
    const [data, setData] = useState<{guests: any[], totalSum: number}>();

    useEffect(() => {
        preCheckout(tableId, card?.id).then((response) => {
            setData(response);
        });
    }, [tableId, card]);

    const handleAccept = useCallback(() => {
        if(window.confirm('Вы уверены, что нужно рассчитать столик?')){
            finishCatering(tableId, card ? card.id : null)
                .then(() => {
                    onAccept();
                    localStorage.removeItem(keyToCardPrefix + tableId);
                    setCurrentMenuItem(SideMenuType.ALL_TABLES);
                });
        }
  }, [tableId, card, onAccept]);

  return (
    <>
      <div className="receivedData">
          <div className="headerWrapper">
              <div style={{padding: '10px 0px', alignItems: "start", justifyContent: "start", display: 'flex', flexDirection: 'column'}}>
                  <div className="title">Итоговая сумма счета: {data?.totalSum.toFixed(2)}</div>
                  <div className="title">Номер карты: {card ? card.id : '-'}</div>
                  <div className="title">Скидка по карте: {card ? card.percentage + '%': '-'}</div>
              </div>
              <Button
                  variant="outlined"
                  color="primary"
                  onClick={onCancel}
              >
                  Отмена
              </Button>
          </div>
        <div className="guestList">
          {data?.guests.map(oneGuestCheckout)}
        </div>
      </div>
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
                variant="outlined"
                color="secondary"
                onClick={handleAccept}
            >
                Рассчитать
            </Button>
        </div>
    </>
  );
};

const oneGuestCheckout = (guest: any, index: number): JSX.Element => {
    return (
        <div className="singleDishWrapper" style={{border: '2px solid gray'}} key={index}>
            <div className="status" style={{background: 'gray'}}>
                <div className="textForHeader" style={{ color: "white" }}>
                    Гость {index + 1}
                </div>
            </div>
            {guest.positions.length > 0 && <div className="dishList">
                <DataTable scheme={{
                        dishName: {
                            label: "Название блюда"
                        },
                        price: {
                            label: "Цена",
                            formatter: (value => value.toFixed(2))
                        }
                    }
                } data={guest.positions} />
            </div>}

            <div style={{borderTop: '2px solid gray', fontSize: 20, display: 'flex', justifyContent: 'space-between', padding: 10}} >
                <div style={{fontWeight: 'bold'}}>Сумма за гостя:</div>
                <div>{guest.sumPerGuest.toFixed(2)}</div>
            </div>
        </div>
    );
}