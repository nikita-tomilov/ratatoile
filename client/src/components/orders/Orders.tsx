import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DataTable} from "../tableForData/DataTable";
import {RowData, Scheme} from "../tableForData/types";
import {getAllOrders} from "../../api/order";
import {setUpAnIntervalPollingOfFunction} from "../utils";

const getOrdersScheme = (): Scheme => {
    return {
        id: {
            label: 'ID заказа'
        },
        dish: {
            label: 'Название блюда'
        },
        guestId: {
            label: 'ID гостя'
        },
        guestCard: {
            label: 'Карта гостя'
        },
        originalPrice: {
            label: 'Цена блюда'
        },
        paidPrice: {
            label: 'Оплаченная цена'
        }
    }
}

export const Orders = (): JSX.Element => {
    const [data, setData] = useState<RowData[] | null>(null);

    const scheme = useMemo(() => getOrdersScheme(), []);
    const updateData = useCallback(() => {
        getAllOrders().then(response => setData(response ? response.orderItems : null));
    }, []);

    useEffect(() => setUpAnIntervalPollingOfFunction(updateData), []);

    return (
        <div className="reservationsWrapper">
            <div className="header panelTitle">Оплаченные заказы</div>
            <div className="tableWrapper">
                {scheme && <DataTable scheme={scheme} data={data} />}
            </div>
        </div>
    );
}