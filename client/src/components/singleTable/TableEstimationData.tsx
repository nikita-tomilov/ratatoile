import React from "react";
import { Button } from "@material-ui/core";
import { TableEstimationDataProps } from "./types";
import "./SingleTable.css";
import {SideMenuType} from "../../types";

export const TableEstimationData = (
  props: TableEstimationDataProps
): JSX.Element => {
  const { data, setCurrentMenuItem } = props;
  return (
    <>
      <div className="receivedData">
        <div className="title">Итоговая сумма счета: {data.totalSum}</div>
        <div className="guestList">
          {data.guests.map((guest, index) => {
            return (
              <div className="guest" key={index}>
                <div className="title" style={{ color: "blue" }}>
                  Гость {index + 1}
                </div>
                <div className="title">
                  Сумма счета за гостя: {guest.sumPerGuest}
                </div>
                <div className="title">Блюда гостя:</div>
                <div className="dishList">
                  {guest.positions.map((dish) => {
                    return (
                      <div className="dish" key={dish.dishName}>
                        <div className="title">Название: {dish.dishName}</div>
                        <div className="title">Цена: {dish.price}</div>
                        <div className="title">Количество: {dish.quantity}</div>
                        <div className="title">
                          <b>ИТОГО:</b> {dish.total}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCurrentMenuItem(SideMenuType.ALL_TABLES)}
      >
        Ок
      </Button>
    </>
  );
};
