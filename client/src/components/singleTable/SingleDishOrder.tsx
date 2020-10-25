import {Button} from "@material-ui/core";
import {removeDishFromGuest} from "../../api/guests";
import {sendDishToKitchen} from "../../api/kitchen";
import React from "react";
import {DishData} from "./SingleGuestOrder";
import {DishStatus} from "../../types";

export const SingeDishOrder = (props: { dishData:  DishData, onStatusChange: () => void}): JSX.Element => {
    return <div className='singleDishWrapper' style={{border: `2px solid ${statusToColorMapping[props.dishData.status]}`}}>
        <div className='status' style={{background: statusToColorMapping[props.dishData.status]}}>
            {statusToTitleMapping[props.dishData.status]}
        </div>
        <div className='line dishControls'>
            <div className='dishName'>Блюдо "{props.dishData.name}"</div>
            <div className='dishName'>{props.dishData.price}</div>
        </div>
        <div className='line dishControls'>
            <Button
                style={{marginRight: '5px'}}
                disabled={props.dishData.status != DishStatus.AWAITING_FOR_ACCEPTANCE
                    && props.dishData.status != DishStatus.INGREDIENTS_MISSING}
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => removeDishFromGuest(props.dishData.id).then(props.onStatusChange)}
            >
                Отменить
            </Button>
            <Button
                style={{marginLeft: '5px'}}
                disabled={props.dishData.status != DishStatus.AWAITING_FOR_ACCEPTANCE}
                size="small"
                variant="contained"
                color="primary"
                onClick={() => sendDishToKitchen(props.dishData.id).then(props.onStatusChange)}
            >
                На кухню
            </Button>
        </div>
    </div>
}

const statusToColorMapping = {
    [DishStatus.COOKING]: 'orange',
    [DishStatus.READY]: 'green',
    [DishStatus.SERVED]: 'grey',
    [DishStatus.AWAITING_FOR_ACCEPTANCE]: 'red',
    [DishStatus.IN_QUEUE]: 'darkRed',
    [DishStatus.INGREDIENTS_MISSING]: 'black',
}

export const statusToTitleMapping = {
    [DishStatus.COOKING]: 'Готовится',
    [DishStatus.READY]: 'Готово к подаче',
    [DishStatus.SERVED]: 'Выдано',
    [DishStatus.AWAITING_FOR_ACCEPTANCE]: 'Ожидание подтверждения',
    [DishStatus.IN_QUEUE]: 'В очереди на готовку',
    [DishStatus.INGREDIENTS_MISSING]: 'Нет ингредиентов',
}