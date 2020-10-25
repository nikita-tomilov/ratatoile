import React from "react";
import "./SingleGuestOrder.css";
import {Button} from "@material-ui/core";
import {SingeDishOrder} from "./SingleDishOrder";
import {DishStatus} from "../../types";

export type SingleGuestOrderProps = {
    displayId: number;
    dishes: GuestOrderInfo;
    onAddNewDishToGuest: (guestId: number) => void;
    onStatusChange: () => void;
}

export type DishData = { id: number, status: DishStatus, name: string, price: number };

export type GuestOrderInfo = {
    guestId: number;
    positions: DishData[];
    total: number;
}

export const SingleGuestOrder = (props: SingleGuestOrderProps): JSX.Element => {
    return <div className='singleGuestWrapper'>
        <div className="dishControls">
            <div style={{display: "block"}}>
                <div className='title'>Гость {props.displayId}</div>
            </div>
            <Button
                style={{marginLeft: '20px'}}
                size="small"
                variant="contained"
                color="primary"
                onClick={() => props.onAddNewDishToGuest(props.dishes.guestId)}
            >
                Добавить блюдо
            </Button>

        </div>
        <div className='dishes'>
            {props.dishes.positions.map((data) => {return <SingeDishOrder key={data.id}
                dishData={data}
                onStatusChange={props.onStatusChange}/>
            })}
            <div className="status margins" style={{borderRadius: 7}}>
                {
                    props.dishes.positions.length === 0
                        ? 'Блюда отстутствуют'
                        : `Сумма: ${props.dishes.total}`
                }
            </div>
        </div>
    </div>;
}