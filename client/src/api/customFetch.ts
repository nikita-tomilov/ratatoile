import { Method } from "../services/types";
import { getAuthService } from "../services/authService";

export const customFetch = <ReqT, ResT>(
  url: string,
  method: Method,
  requestBody?: ReqT
): Promise<ResT> => {
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${getAuthService().getToken()}`,
    },
    body: requestBody as any,
  }).then((data) => data.json());
};
