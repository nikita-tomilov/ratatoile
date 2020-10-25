import {RowData, Scheme} from "../tableForData/types";
import {Button} from "@material-ui/core";
import React from "react";

export const getScheme = (props: any): Scheme => {
  return {
    amount: {
      label: "Сумма",
    },
    reason: {
      label: "Причина",
    },
    date: {
      label: "Дата",
      formatter: (date: number) => {
        return `${new Date(date).toLocaleDateString()}`;
      },
    },
    controls: {
      label: "Управление",
      renderer: (value: RowData) => {
        return (
          <div className="controls">
            <div className="btnWrapper">
              <Button
                variant="outlined"
                color="secondary"
                onClick={props.onDelete}
                value={value.id}
              >
                Удалить
              </Button>
            </div>
          </div>
        );
      },
    },
  };
};
