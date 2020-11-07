import {RowData, Scheme} from "../tableForData/types";
import {Button} from "@material-ui/core";
import React from "react";

export const getGuestCardsScheme = (props: { onDelete: (cardId: number) => void, onEdit: (cardId: number) => void}): Scheme => {
    return {
        id: {
            label: "ID карты",
        },
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
        percentage: {
            label: "Процент скидки, %",
        },
        controls: {
            label: "Управление",
            renderer: (value: RowData) => {
                return <div className="controls">
                    <div style={{marginRight: 10}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => props.onEdit(value.id)}
                        >
                            Редактировать
                        </Button>
                    </div>
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
