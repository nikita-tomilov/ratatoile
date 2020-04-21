import { SideMenuType } from "../components/SideMenu";
import {TableData} from "../api/tables";

export enum StateChangeActionType {
  SET_TOKEN = "SET_TOKEN",
  SET_AUTH_FAIL = "SET_AUTH_FAIL",
  SET_CURRENT_MENU_ITEM = "SET_CURRENT_MENU_ITEM",
  SET_TABLES_DATA = "SET_TABLES_DATA",
}

type SetToken = {
  type: StateChangeActionType.SET_TOKEN;
  payload: string | null;
};

type SetAuthFail = {
  type: StateChangeActionType.SET_AUTH_FAIL;
  payload: string | null;
};

type SetCurrentMenuItem = {
  type: StateChangeActionType.SET_CURRENT_MENU_ITEM;
  payload: SideMenuType;
};

type SetTablesData = {
  type: StateChangeActionType.SET_TABLES_DATA;
  payload: TableData[];
};

export type StateChangeActions =
  | SetToken
  | SetAuthFail
  | SetCurrentMenuItem
  | SetTablesData;
