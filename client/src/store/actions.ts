
export enum StateChangeActionType {
    SET_TOKEN= 'SET_TOKEN',
    SET_AUTH_FAIL = 'SET_AUTH_FAIL'
}

type SetToken = {
    type: StateChangeActionType.SET_TOKEN,
    payload: string | null;
}

type SetAuthFail = {
    type: StateChangeActionType.SET_AUTH_FAIL,
    payload: string | null;
}

export type StateChangeActions = SetToken | SetAuthFail;
