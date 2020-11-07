import { customFetch } from "./customFetch";
import { getUrl } from "./url";
import { Method } from "../components/auth/types";
import { RowData } from "../components/tableForData/types";

const reservationRequestsPrefix = "/reservationrequests/";
const reservationPrefix = "/reservation/";

export const getAllReservationRequest = (): Promise<{
  requests: RowData[];
} | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${reservationRequestsPrefix}get`,
    Method.GET
  );
};

export const getAllReservations = (): Promise<{
  reservations: RowData[];
} | null> => {
  return customFetch<{}, {reservations: RowData[]} | null>(
    `${getUrl()}${reservationPrefix}get/all`,
    Method.GET
  );
};

export const acceptReservationRequest = (
  reservationId: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${reservationRequestsPrefix}accept/${reservationId}`,
    Method.GET
  );
};

export const deleteReservationRequest = (
  reservationId: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${reservationRequestsPrefix}delete/${reservationId}`,
    Method.DELETE
  );
};
