import { customFetch } from "./customFetch";
import { getUrl } from "./url";
import { Method } from "../services/types";

export enum AppRole {
  ADMIN,
  USER,
}

type UserRoleResponse = {
  username: string;
  roles: AppRole[];
};

export const getUserRole = (): Promise<UserRoleResponse> => {
  return customFetch<{}, UserRoleResponse>(`${getUrl()}/user/me`, Method.GET);
};
