import {RowData, Scheme} from "../tableForData/types";
import {Button} from "@material-ui/core";
import React from "react";
import {AppRole} from "../../api/user";
import {statusToTitleMapping} from "../singleTable/SingleDishOrder";
import {DishStatus} from "../../types";
import {sendDishToCookingFromQueue, setDishIsReady, setDishIsServed} from "../../api/kitchen";

const dishStatusToKitchenControlsMappingForChef: {[key: string]: any} = {
    [DishStatus.IN_QUEUE.toString()]: [
        {
            label: 'Выбрано на приготовление',
            handler: sendDishToCookingFromQueue
        },
    ],
    [DishStatus.COOKING.toString()]: [
        {
            label: 'Готово к подаче',
            handler: setDishIsReady
        },
    ],
};

const dishStatusToKitchenControlsMappingForWaiter: {[key: string]: any} = {
    [DishStatus.READY.toString()]: [
        {
            label: 'Выдано клиенту',
            handler: setDishIsServed
        },
    ],
};

export const getKitchenScheme = (props: {selectedRole: AppRole, onActionFinished: () => void}): Scheme => {
    const mapping = props.selectedRole === AppRole.WAITER
        ? dishStatusToKitchenControlsMappingForWaiter : dishStatusToKitchenControlsMappingForChef;
    const scheme = {
        name: {
            label: "Название блюда",
        },
        status: {
            label: "Статус",
            renderer: (value: RowData) => {
                return <div style={{flex: 1, flexDirection: 'column'}}>
                    <div className='itemTitle'>{statusToTitleMapping[value.status as DishStatus]}</div>
                    {value.ingredientsMissingList && <div>{value.ingredientsMissingList}</div>}
                </div>
            }
        },
        controls: {
            label: "Управление",
            renderer: (value: RowData) => {
                return <div className="controls">
                    {mapping[value.status as DishStatus]?.map((control: any, index: number) => {
                        return <div className="btnWrapper" key={'kitchen' + index}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => control.handler(value.id).then(props.onActionFinished)}
                            >
                                {control.label}
                            </Button>
                        </div>
                    })}
                </div>
            },
        },
    };

    return props.selectedRole === AppRole.WAITER ? {
        tableId: {
            label: "Номер стола",
        },
        ...scheme
    } : scheme;
};
