import { customFetch } from "./customFetch";
import { getUrl } from "./url";
import { Method } from "../services/types";
import { RowData } from "../components/tableForData/types";

const reservationPrefix = "/reservationrequests/";

export const getAllReservationRequest = (): Promise<{
  requests: RowData[];
} | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${reservationPrefix}get`,
    Method.GET
  );
};

export const acceptReservationRequest = (
  reservationId: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${reservationPrefix}accept/${reservationId}`,
    Method.GET
  );
};

export const deleteReservationRequest = (
  reservationId: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${reservationPrefix}delete/${reservationId}`,
    Method.DELETE
  );
};
