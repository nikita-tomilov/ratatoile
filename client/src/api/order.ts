import {customFetch} from "./customFetch";
import {getUrl} from "./url";
import {Method} from "../components/auth/types";
import {RowData} from "../components/tableForData/types";

const orderPrefix = "/order/";

export const getAllOrders = (): Promise<{orderItems: RowData[]} | null> => {
    return customFetch<{}, {orderItems: RowData[]} | null>(
        `${getUrl()}${orderPrefix}history/all`,
        Method.GET
    );
};
