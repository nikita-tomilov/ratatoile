import { createStore } from "redux";
import rootReducer from "./reducers";
import {SideMenuType} from "../components/SideMenu";

export type AppState = {
    userToken: string | null;
    authFailMessage: string | null;
    currentMenuItem: SideMenuType;
}

export const initialState: AppState = {
    userToken: null,
    authFailMessage: null,
    currentMenuItem: SideMenuType.FIRST
};

const store = createStore(rootReducer);

export default store;