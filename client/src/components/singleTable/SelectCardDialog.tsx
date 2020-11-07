import {Dialog} from "../dialog/Dialog";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button} from "@material-ui/core";
import {FormWrapper} from "../inputs/SimpleField";
import {OptionsField} from "../inputs/OptionsField";
import {Card, getAllAvailableCards} from "../../api/guestCards";

export const keyToCardPrefix = 'card ';

export const SelectCardDialog = (props: {tableId: number, onCancel: () => void; onAdd: (card: Card) => void}):JSX.Element => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [cards, setCards] = useState<Card[] | null>(null);

    const ids = useMemo(() => cards?.map(el => el.id.toString()), [cards]);

    const updateCardsData = useCallback(() => {
        getAllAvailableCards()
            .then((response) => response && setCards(response?.cards));
    }, []);

    useEffect(updateCardsData,[]);

    const addHandler = useCallback(() => {
        if(selectedId) {
            const foundCard = cards?.find((el) => el.id === selectedId);
            if(foundCard) props.onAdd(foundCard);
            localStorage.setItem(keyToCardPrefix + props.tableId, JSON.stringify(foundCard));
        }
    }, [props.onAdd, selectedId, props.tableId]);

    const renderHeader = useCallback(() => <div className='titleWrapper'>
        <div className='title'>Выберите карту</div>
        <Button
            style={{marginLeft: 20}}
            size='small'
            variant="outlined"
            color="primary"
            onClick={props.onCancel}
        >
            Отмена
        </Button>
    </div>, [props.onCancel])

    const renderBody = useCallback(() =>
        <FormWrapper inputs={
            [
                <OptionsField
                    label={'Идентификатор карты'}
                    key={'id'}
                    options={ids ?? []}
                    onChange={(v) => setSelectedId(Number(v))}
                />,
                <Button
                    size='medium'
                    variant="contained"
                    color="primary"
                    onClick={addHandler}
                >
                    Выбрать
                </Button>
            ]
        } />, [addHandler, ids]);

    return <Dialog renderHeader={renderHeader} renderBody={renderBody} />;
}