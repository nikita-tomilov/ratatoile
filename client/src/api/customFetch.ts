import { Method } from "../components/auth/types";
import { getAuthService } from "../components/auth/authService";

export const customFetch = <ReqT, ResT>(
  url: string,
  method: Method,
  requestBody?: ReqT,
  throwException?: boolean
): Promise<ResT> => {
  return fetch(url, {
    method,
    headers:
      method === Method.POST
        ? {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${getAuthService().getToken()}`,
          }
        : {
            Authorization: `Bearer ${getAuthService().getToken()}`,
          },
    body: JSON.stringify(requestBody),
  }).then(async (data) => {
      const response = await data.json();
      if(throwException && data.status.toString()[0] == '4')
          throw Error(response.message ?? response.error);
      else return response
  });
};

export const customFetchForImages = <ReqT, ResT>(
  url: string,
  method: Method,
  requestBody?: any
): Promise<ResT> => {
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${getAuthService().getToken()}`
    },
    body: requestBody,
  }).then((data) => data.json());
};
