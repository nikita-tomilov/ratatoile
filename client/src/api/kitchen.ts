import {customFetch} from "./customFetch";
import {getUrl} from "./url";
import {Method} from "../components/auth/types";
import {AppRole} from "./user";

const kitchenPrefix = "/kitchen/";

export const sendDishToKitchen = (
    orderItemId: number,
): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${kitchenPrefix}send/to/kitchen/${orderItemId}`,
        Method.GET
    );
};

export const sendDishToCookingFromQueue = (
    orderItemId: number,
): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${kitchenPrefix}set/cooking/${orderItemId}`,
        Method.GET
    );
};

export const setDishIsServed = (
    orderItemId: number,
): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${kitchenPrefix}set/served/${orderItemId}`,
        Method.GET
    );
};

export const setDishIsReady = (
    orderItemId: number,
): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${kitchenPrefix}set/ready/${orderItemId}`,
        Method.GET
    );
};

export const getKitchenQueue = (role: AppRole): Promise<any | null> => {
    return customFetch<{}, any | null>(
        `${getUrl()}${kitchenPrefix}queue/${role === AppRole.CHEF ? 'kitchen' : 'waiter'}`,
        Method.GET
    );
};