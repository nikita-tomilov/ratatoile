import {SideMenuType} from "../components/SideMenu";

export enum StateChangeActionType {
    SET_TOKEN= 'SET_TOKEN',
    SET_AUTH_FAIL = 'SET_AUTH_FAIL',
    SET_CURRENT_MENU_ITEM='SET_CURRENT_MENU_ITEM'
}

type SetToken = {
    type: StateChangeActionType.SET_TOKEN,
    payload: string | null;
}

type SetAuthFail = {
    type: StateChangeActionType.SET_AUTH_FAIL,
    payload: string | null;
}

type SetCurrentMenuItem = {
    type: StateChangeActionType.SET_CURRENT_MENU_ITEM,
    payload: SideMenuType;
}

export type StateChangeActions = SetToken | SetAuthFail | SetCurrentMenuItem;
