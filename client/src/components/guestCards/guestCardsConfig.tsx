import {RowData, Scheme} from "../tableForData/types";
import {Button} from "@material-ui/core";
import React from "react";

export const getGuestCardsScheme = (props: { onDelete: (cardId: number) => void}): Scheme => {
    return {
        fullName: {
            label: "Имя владельца",
        },
        phone: {
            label: "Номер телефона",
        },
        birthday: {
            label: "Дата рождения",
            formatter: (value: number) => new Date(value).toLocaleDateString("ru")
        },
        controls: {
            label: "Управление",
            renderer: (value: RowData) => {
                return <div className="controls">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => props.onDelete(value.id)}
                    >
                        Удалить
                    </Button>
                </div>
            },
        },
    };
};
