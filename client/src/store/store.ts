import {createStore} from "redux";
import rootReducer from "./reducers";
import {AppState, SideMenuType} from "../types";

export const initialState: AppState = {
  userToken: null,
  authFailMessage: null,
  currentMenuItem: SideMenuType.LOGOUT,
  tables: [],
  lastSelectedTableId: null,
  roles: [],
  username: null
};

const store = createStore(rootReducer);

export default store;
