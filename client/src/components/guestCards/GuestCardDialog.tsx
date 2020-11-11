import {Dialog} from "../dialog/Dialog";
import React, {useCallback, useState} from "react";
import {
    FormWrapper, percentageError, phoneError,
    SimpleField,
    someDataNotProvided,
    validatePercentage,
    validatePhoneNumber
} from "../inputs/SimpleField";
import {Button} from "@material-ui/core";
import {Card, createNewCard, editCard} from "../../api/guestCards";

export const GuestCardDialog = (props: {onCancel: () => void, selected: Card | null, onUpdate: () => void}):JSX.Element => {
    const [name, setName] = useState<string | null>(props.selected ? props.selected.fullName : null);
    const [phone, setPhone] = useState<string | null>(props.selected ? props.selected.phone :null);
    const [birthday, setBirthday] = useState<string | null>(props.selected ? props.selected.birthday.toString() : null);
    const [percentage, setPercentage] = useState<number | null>(props.selected ? props.selected.percentage :null);
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

    const handleEditNewCard = useCallback(() => {
        if (name === null || phone === null || birthday === null || percentage === null)
            setShowErrorMessage(true);
        else {
            props.selected && editCard(props.selected.id, name, phone, Date.parse(birthday), percentage).then(props.onUpdate);
            setShowErrorMessage(false);
        }
    }, [props.selected, props.onUpdate, name, phone, birthday, percentage]);

    const handleAddNewCard = useCallback(() => {
        if (name === null || phone === null || birthday === null || percentage === null)
            setShowErrorMessage(true);
        else {
            createNewCard(name, phone, Date.parse(birthday), percentage).then(props.onUpdate);
            setShowErrorMessage(false);
        }
    }, [props.onUpdate, name, phone, birthday, percentage]);

    const renderHeader = useCallback(() => <div className='titleWrapper'>
        <div className='title'>{props.selected ? "Измените" : "Добавьте" } данные карты</div>
        <Button
            style={{marginLeft: 20}}
            size='small'
            variant="outlined"
            color="primary"
            onClick={props.onCancel}
        >
            Отмена
        </Button>
    </div>, [props.selected, props.onCancel])

    const renderBody = useCallback(() =>
        <FormWrapper inputs={
            [
                <SimpleField label="ФИО"
                             id="name"
                             onChange={setName}
                             type='text'
                             validator={(value) => value.length > 0}
                             isRequired={true}
                             startValue={name}
                />,
                <SimpleField label="Телефон"
                             id="phone"
                             onChange={setPhone}
                             type='phone'
                             validationText={phoneError}
                             validator={(value) => value.length > 0 && validatePhoneNumber(value)}
                             isRequired={true}
                             startValue={phone}
                />,
                <SimpleField label="Дата рождения"
                             id="birthday"
                             onChange={setBirthday}
                             type='date'
                             isRequired={true}
                             startValue={birthday}
                             validationText={'Вы не можете зарегистрировать карту на человека младше 14 лет'}
                             validator={(value) => value.length > 0 && new Date().getUTCFullYear() - Number(value.split('-')[0]) > 13}
                />,
                <SimpleField label="Процент скидки"
                             id="percentage"
                             onChange={setPercentage}
                             type='number'
                             isRequired={true}
                             startValue={percentage}
                             validationText={percentageError}
                             validator={validatePercentage}
                />,
                <>
                    {
                        showErrorMessage
                        && <div className="error">{someDataNotProvided}</div>
                    }
                </>,
                <Button
                    size='medium'
                    variant="contained"
                    color="primary"
                    onClick={props.selected ? handleEditNewCard : handleAddNewCard}
                >
                    {props.selected ? "Изменить" : "Добавить" }
                </Button>
            ]
        } />, [props.selected, name, birthday, phone, percentage, handleAddNewCard, showErrorMessage]);

    return <Dialog
        renderHeader={renderHeader}
        renderBody={renderBody}
    />
}