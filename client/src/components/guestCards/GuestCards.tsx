import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Card, deleteCard, getAllAvailableCards} from "../../api/guestCards";
import {getGuestCardsScheme} from "./guestCardsConfig";
import {DataTable} from "../tableForData/DataTable";
import {Button} from "@material-ui/core";
import {GuestCardDialog} from "./GuestCardDialog";

export const GuestCards = ():JSX.Element => {
    const [data, setData] = useState<Card[] | null>(null);
    const [selected, setSelected] = useState<Card | null>(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const updateCardsData = useCallback(() => {
        getAllAvailableCards().then((response) => response && setData(response?.cards));
    }, []);

    const onDelete = useCallback((cardId: number) => {
        if(window.confirm("Вы уверены, что хотите удалить карту гостя?"))
            deleteCard(cardId).then(updateCardsData);
    }, []);


    const onAdd = useCallback(() => setShowDialog(true), []);

    const onEdit = useCallback((id) => {
        const tmp = data?.find((el) => el.id === id);
        if(tmp) {
            setSelected(tmp);
            setShowDialog(true);
        }
    }, [data]);

    const scheme = useMemo(() => getGuestCardsScheme({ onDelete, onEdit }), [data]);

    useEffect(updateCardsData,[]);

    return (
        <div className="panelWrapper">
            <div className="header">
                <div className="panelTitle">Список карт</div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onAdd}
                >
                    Добавить новую
                </Button>
            </div>
            <div className="tablesWrapper">
                <DataTable scheme={scheme} data={data} />
            </div>

            {showDialog && <GuestCardDialog
                onCancel={() => {
                    setSelected(null);
                    setShowDialog(false);
                }}
                onUpdate={() => {
                    updateCardsData();
                    setShowDialog(false);
                }}
                selected={selected}
            />}
        </div>
    )
}