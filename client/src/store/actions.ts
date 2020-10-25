import { TableData } from "../api/types";
import {SideMenuType} from "../types";
import {AppRole} from "../api/user";

export enum StateChangeActionType {
  SET_TOKEN = "SET_TOKEN",
  SET_AUTH_FAIL = "SET_AUTH_FAIL",
  SET_CURRENT_MENU_ITEM = "SET_CURRENT_MENU_ITEM",
  SET_TABLES_DATA = "SET_TABLES_DATA",
  SET_LAST_SELECTED_TABLE_ID = "SET_LAST_SELECTED_TABLE_ID",
  SET_ADMIN_ROLE = "SET_ADMIN_ROLE",
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

type SetLastSelectedTableId = {
  type: StateChangeActionType.SET_LAST_SELECTED_TABLE_ID;
  payload: number | null;
};

type SetAdminRole = {
  type: StateChangeActionType.SET_ADMIN_ROLE;
  payload: {
    roles: AppRole[];
    userName: string | null;
  };
};

export type StateChangeActions =
  | SetToken
  | SetAuthFail
  | SetCurrentMenuItem
  | SetTablesData
  | SetLastSelectedTableId
  | SetAdminRole;
