import { StateChangeActions, StateChangeActionType } from "./actions";
import { AppState, initialState } from "./store";

function rootReducer(
  state: AppState = initialState,
  action: StateChangeActions
): AppState {
  switch (action.type) {
    case StateChangeActionType.SET_TOKEN: {
      return {
        ...state,
        userToken: action.payload,
      };
    }
    case StateChangeActionType.SET_AUTH_FAIL: {
      return {
        ...state,
        authFailMessage: action.payload,
      };
    }
    case StateChangeActionType.SET_CURRENT_MENU_ITEM: {
      return {
        ...state,
        currentMenuItem: action.payload,
      };
    }
    case StateChangeActionType.SET_TABLES_DATA: {
      return {
        ...state,
        tables: action.payload,
      };
    }
  }
  return state;
}

export default rootReducer;
