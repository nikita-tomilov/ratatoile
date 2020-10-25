import { RowData, Scheme } from "../tableForData/types";
import { Button } from "@material-ui/core";
import React from "react";

export const getDishIngredientsScheme = (props: any): Scheme => {
  return {
    name: {
      label: "Название ингредиента",
    },
    amount: {
      label: "Количество",
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
                value={value.entryId}
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
