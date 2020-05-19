import { RowData, Scheme } from "../tableForData/types";
import { Button } from "@material-ui/core";
import React from "react";

export const getScheme = (props: any): Scheme => {
  return {
    name: {
      label: "Фамилия, Имя",
    },
    phone: {
      label: "Номер телефона",
    },
    seats: {
      label: "Число гостей",
    },
    tableType: {
      label: "Тип столика",
    },
    tableCandidateId: {
      label: "Номер столика",
    },
    time: {
      label: "Время бронирования",
      formatter: (time: { from: number; to: number }) => {
        return `${new Date(time.from).toLocaleDateString()}, ${new Date(
          time.from
        ).toLocaleTimeString()} - ${new Date(time.to).toLocaleTimeString()}`;
      },
    },
    controls: {
      label: "Управление",
      renderer: (value: RowData, index: number) => {
        return (
          <div className="controls">
            <div className="btnWrapper">
              <Button
                variant="contained"
                color="secondary"
                onClick={props.onDelete}
                value={value.id}
              >
                Удалить
              </Button>
            </div>
            <div className="btnWrapper">
              <Button
                variant="contained"
                color="primary"
                onClick={props.onAccept}
                value={value.id}
              >
                Подтвердить
              </Button>
            </div>
          </div>
        );
      },
    },
  };
};
