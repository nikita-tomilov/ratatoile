import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Card, createNewCard, deleteCard, getAllAvailableCards} from "../../api/guestCards";
import {getGuestCardsScheme} from "./guestCardsConfig";
import {DataTable} from "../tableForData/DataTable";
import {Button} from "@material-ui/core";
import {Dialog} from "../dialog/Dialog";
import TextField from "@material-ui/core/TextField";

export const GuestCards = ():JSX.Element => {
    const [data, setData] = useState<Card[] | null>(null);
    const [isDialogVisible, setDialogVisible] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');

    const updateCardsData = useCallback(() => {
        getAllAvailableCards().then((response) => response && setData(response?.cards));
    }, []);

    const onDelete = useCallback((cardId: number) => {
        deleteCard(cardId).then(updateCardsData);
    }, []);

    const onAdd = useCallback(() => setDialogVisible(true), []);

    const scheme = useMemo(() => getGuestCardsScheme({ onDelete }), []);

    const renderHeader = useCallback(() => <div className='titleWrapper'>
            <div className='title'>Добавьте данные карты</div>
            <Button
                style={{marginLeft: 20}}
                size='small'
                variant="outlined"
                color="primary"
                onClick={() => setDialogVisible(false)}
            >
                Отмена
            </Button>
        </div>, [])

    const handleAddNewCard = useCallback(() =>
        createNewCard(name, phone, Date.parse(birthday)).then(() => {
            updateCardsData();
            setDialogVisible(false);
        }), [name, phone, birthday]);

    const renderBody = useCallback(() => <div className='controlsVertical' >
        <TextField
            fullWidth
            type="text"
            variant="outlined"
            margin="normal"
            required
            id="name"
            label="ФИО"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
        />
        <TextField
            fullWidth
            type="text"
            variant="outlined"
            margin="normal"
            required
            id="phone"
            label="Телефон"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
        />
        <TextField
            fullWidth
            type="date"
            variant="outlined"
            margin="normal"
            required
            id="birthday"
            label="Дата рождения"
            name="birthday"
            value={birthday}
            onChange={(e) => {
                setBirthday(e.currentTarget.value)
            }}
        />
        <Button
            size='medium'
            variant="contained"
            color="primary"
            onClick={handleAddNewCard}
        >
            Добавить
        </Button>
    </div> , [name, birthday, phone, handleAddNewCard]);

    useEffect(updateCardsData,[]);

    return (
        <div className="panelWrapper">
            <div className="header">
                <div className="panelTitle">Список карт постоянного покупателя</div>
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

            {isDialogVisible && <Dialog
                renderHeader={renderHeader}
                renderBody={renderBody}
            />}
        </div>
    )
}