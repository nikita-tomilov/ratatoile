import { RowData, Scheme } from "../tableForData/types";
import { Button } from "@material-ui/core";
import React from "react";

export const getMenuScheme = (props: any): Scheme => {
    return {
        name: {
            label: "Название блюда",
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
                                value={value.menuItemId}
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
