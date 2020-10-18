import { RowData, Scheme } from "../tableForData/types";
import { Button } from "@material-ui/core";
import React from "react";

export const getWarehouseScheme = (props: any): Scheme => {
    return {
        name: {
            label: "Название ингридиента",
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
