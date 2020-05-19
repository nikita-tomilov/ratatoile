import { getUrl } from "./url";
import { Method } from "../services/types";
import { customFetch } from "./customFetch";
import { GetAllTablesResponse } from "./types";
import { TableEstimateResponse } from "../components/singleTable/types";

const tablePrefix = "/table/get/all/";
const guestCreatePrefix = "/guests/create/";
const guestCheckoutPrefix = "/guests/checkout/";
const reservationPrefix = "/reservation/";

export const getAllTablesWithReservations = (): Promise<GetAllTablesResponse | null> => {
  return customFetch<{}, GetAllTablesResponse | null>(
    `${getUrl()}${tablePrefix}with/reservations`,
    Method.GET
  );
};

export const addGuests = (
  tableId: number,
  guestsCount: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${guestCreatePrefix}${tableId}/${guestsCount}`,
    Method.GET
  );
};

export const startCatering = (
  reservationId: number,
  guestsCount: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${guestCreatePrefix}from/reservation/${reservationId}/${guestsCount}`,
    Method.GET
  );
};

export const finishCatering = (
  tableId: number
): Promise<TableEstimateResponse | null> => {
  return customFetch<{}, TableEstimateResponse | null>(
    `${getUrl()}${guestCheckoutPrefix}${tableId}`,
    Method.GET
  );
};

export const deleteReservation = (
  reservationId: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${reservationPrefix}delete/${reservationId}`,
    Method.DELETE
  );
};
