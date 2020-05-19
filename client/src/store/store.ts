import { createStore } from "redux";
import rootReducer from "./reducers";
import { SideMenuType } from "../components/SideMenu";
import { TableData } from "../api/types";

export type AppState = {
  userToken: string | null;
  authFailMessage: string | null;
  currentMenuItem: SideMenuType;
  tables: TableData[];
  lastSelectedTableId: number | null;
  isAdmin: boolean | null;
};

export const initialState: AppState = {
  userToken: null,
  authFailMessage: null,
  currentMenuItem: SideMenuType.COMMON,
  tables: [],
  lastSelectedTableId: null,
  isAdmin: null,
};

const store = createStore(rootReducer);

export default store;
