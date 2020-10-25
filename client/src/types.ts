import {TableData} from "./api/types";
import {AppRole} from "./api/user";

export enum SideMenuType {
    RESERVATIONS = "RESERVATIONS",
    ALL_TABLES = "ALL_TABLES" ,
    TABLE = "TABLE" ,
    KITCHEN_WAITER = "KITCHEN_WAITER",
    KITCHEN = "KITCHEN",
    WAREHOUSE = "WAREHOUSE",
    DISH_LIST = "DISH_LIST",
    MENU = "MENU",
    CARD="CARD",
    DONATIONS_CRITIC = "DONATIONS_CRITIC",
    DONATIONS_INSPECTOR = "DONATIONS_INSPECTOR",
    LOGOUT = "LOGOUT",
}

export type AppState = {
    userToken: string | null;
    authFailMessage: string | null;
    currentMenuItem: SideMenuType;
    tables: TableData[];
    lastSelectedTableId: number | null;
    roles: AppRole[];
    username: string | null;
};

export enum DishStatus {
    READY = 'READY',
    COOKING = 'COOKING',
    AWAITING_FOR_ACCEPTANCE = 'AWAITING_FOR_ACCEPTANCE',
    IN_QUEUE = 'IN_QUEUE',
    SERVED = 'SERVED',
    INGREDIENTS_MISSING = 'INGREDIENTS_MISSING'
}

export const dishStatusMapping = (key: string): DishStatus => {
    switch (key) {
        case 'READY':
            return DishStatus.READY
        case 'SERVED':
            return DishStatus.SERVED
        case 'INGREDIENTS_MISSING':
            return DishStatus.INGREDIENTS_MISSING
        case 'IN_QUEUE':
            return DishStatus.IN_QUEUE
        case 'COOKING':
            return DishStatus.COOKING
        default:
            return DishStatus.AWAITING_FOR_ACCEPTANCE
    }
}