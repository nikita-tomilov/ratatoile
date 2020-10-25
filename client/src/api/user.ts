import { customFetch } from "./customFetch";
import { getUrl } from "./url";
import { Method } from "../components/auth/types";

export enum AppRole {
  MANAGER = "MANAGER",
  WAITER = "WAITER",
  COOK = "COOK",
  CHEF = "CHEF"
}

type UserDataResponse = {
  username: string;
  roles: AppRole[];
};

export const getUserData = (): Promise<UserDataResponse> => {
  return customFetch<{}, UserDataResponse>(
      `${getUrl()}/user/me`,
      Method.GET,
      undefined,
      true
  );
};
