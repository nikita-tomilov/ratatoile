import { createStore } from "redux";
import rootReducer from "./reducers";
import { SideMenuType } from "../components/SideMenu";
import { TableData } from "../api/tables";

export type AppState = {
  userToken: string | null;
  authFailMessage: string | null;
  currentMenuItem: SideMenuType;
  tables: TableData[];
};

export const initialState: AppState = {
  userToken: null,
  authFailMessage: null,
  currentMenuItem: SideMenuType.TABLES,
  tables: [],
};

const store = createStore(rootReducer);

export default store;
