import { getToken } from "../../api/auth";
import { IAuthService } from "./types";
import store from "../../store/store";
import { StateChangeActionType } from "../../store/actions";

export const tokenStorageName = "token";

class AuthServiceClass implements IAuthService {
  constructor() {
    this.getUserTokenFromStorage();
  }

  public login = (username: string, password: string): void => {
    getToken(`grant_type=password&username=${username}&password=${password}`);
  };

  public logout = (): void => {
    this.removeUserToken();
    this.updateTokenValueInStore(null);
  };

  public setUserToken = (token: string): void => {
    this.setUserTokenToStorage(token);
    this.updateTokenValueInStore(token);
  };

  public setAuthError = (error: string): void => {
    store.dispatch({
      type: StateChangeActionType.SET_AUTH_FAIL,
      payload: error,
    });
  };

  public getToken = (): string => store.getState().userToken || "";

  private removeUserToken = (): void => {
    localStorage.removeItem(tokenStorageName);
  };

  private getUserTokenFromStorage = (): void => {
    const token = localStorage.getItem(tokenStorageName);
    if (token && token !== "undefined") this.updateTokenValueInStore(token);
  };

  private setUserTokenToStorage = (token: string): void => {
    localStorage.setItem(tokenStorageName, token);
  };

  private updateTokenValueInStore = (token: string | null): void => {
    store.dispatch({
      type: StateChangeActionType.SET_TOKEN,
      payload: token,
    });
  };
}

const authServiceClassInstance: AuthServiceClass = new AuthServiceClass();

export const getAuthService = () => {
  return authServiceClassInstance;
};
