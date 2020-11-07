import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DataTable} from "../tableForData/DataTable";
import {getKitchenScheme} from "./kitchenConfig";
import {DishStatus} from "../../types";
import {getKitchenQueue} from "../../api/kitchen";
import {AppRole} from "../../api/user";
import {getAllDishesRequest, UpdateDishRequestData} from "../../api/dishes";
import {setUpAnIntervalPollingOfFunction} from "../utils";

export type KitchenData = {
    ingredientsMissingList: string[];
    tableId: number;
    name: string;
    guestId: number;
    id: number;
    status: DishStatus;
}

export const Kitchen = (props: {selectedRole: AppRole}): JSX.Element => {
    const [data, setData] = useState<KitchenData[] | null>(null);
    const [dataForWaiter, setDataForWaiter] = useState<KitchenData[] | null>(null);
    const updateKitchenQueueData = useCallback(() => {
        Promise.all([getAllDishesRequest(), getKitchenQueue(props.selectedRole)])
            .then((responses) => {
                const dishes = responses[0]?.dishes;
                const orders = responses[1]?.items.map((el: any) => {
                    const dishId =  el['entry']['dishId'];
                    return {
                        id: el['entry']['id'],
                        name: dishes?.find((el: UpdateDishRequestData) => el.id === dishId)?.name || '',
                        guestId: el['entry']['guestId'],
                        tableId: el['tableId'],
                        status: el['entry']['status'],
                        ingredientsMissingList: el['ingredientsMissingList'],
                    } as KitchenData;
                });
                props.selectedRole === AppRole.CHEF ? setData(orders) : setDataForWaiter(orders);
            });
    }, [props.selectedRole]);

    const scheme = useMemo(() => getKitchenScheme({
        selectedRole: props.selectedRole,
        onActionFinished: updateKitchenQueueData
    }), [props.selectedRole]);

    useEffect(() => setUpAnIntervalPollingOfFunction(updateKitchenQueueData), [props.selectedRole]);

    return (
        <div className="panelWrapper">
            <div className="panelTitle">Кухня</div>
            <div className="tablesWrapper">
                <DataTable scheme={scheme} data={props.selectedRole === AppRole.CHEF ? data : dataForWaiter} />
            </div>
        </div>
    );
};