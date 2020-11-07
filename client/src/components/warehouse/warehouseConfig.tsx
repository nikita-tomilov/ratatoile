import { RowData, Scheme } from "../tableForData/types";
import { Button } from "@material-ui/core";
import React from "react";

export const getWarehouseScheme = (props: any): Scheme => {
    return {
        name: {
            label: "Название ингредиента",
        },
        amount: {
            label: "Количество на складе" ,
            renderer: (value: RowData) => {
                return (
                    <div className="dataTableCell">
                        {value.warehouseAmount} {value.uom}
                    </div>
                );
            }
        },
        controls: {
            label: "Управление",
            renderer: (value: RowData) => {
                return (
                    <div className="controls">
                        <div className="btnWrapper">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={props.onEdit}
                                value={value.id}
                            >
                                Редактировать
                            </Button>
                        </div>
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
