import {customFetch} from "./customFetch";
import {getUrl} from "./url";
import {Method} from "../components/auth/types";

const guestsPrefix = "/guests/";
const guestPrefix = "/guest/";

export const getAllGuestsDishesByTable = (
    tableId: number
): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${guestsPrefix}status/${tableId}`,
        Method.GET
    );
};

export const addDishToGuest = (
    guestId: number,
    dishId: number
): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${guestPrefix}order/entry/add/${guestId}/${dishId}`,
        Method.GET
    );
};

export const removeDishFromGuest = (
    orderItemId: number,
): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${guestPrefix}order/entry/${orderItemId}/remove`,
        Method.GET
    );
};
