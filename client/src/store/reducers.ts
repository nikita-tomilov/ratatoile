import { StateChangeActions, StateChangeActionType } from './actions'

export type AppState = {
    userToken: string | null;
    authFailMessage: string | null;
}

const initialState: AppState = {
    userToken: null,
    authFailMessage: null
};

function rootReducer(state: AppState = initialState, action: StateChangeActions): AppState {
    switch (action.type) {

        case StateChangeActionType.SET_TOKEN: {
            return {
                ...initialState,
                userToken: action.payload
            }
        }
        case StateChangeActionType.SET_AUTH_FAIL: {
            return {
                ...initialState,
                authFailMessage: action.payload
            }
        }
    }
    return state;
}

export default rootReducer;