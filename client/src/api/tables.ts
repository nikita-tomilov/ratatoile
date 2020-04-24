import { getUrl } from "./url";
import { Method } from "../services/types";
import { customFetch } from "./customFetch";

const tablePrefix = "/table/get/all/";

export enum TableType {
  NEAR_WINDOW = "NEAR_WINDOW",
  NORMAL = "NORMAL",
  NEAR_BAR = "NEAR_BAR",
}

export enum TableState {
  FREE = "FREE",
  FREE_BUT_BOOKED = "FREE_BUT_BOOKED",
  SUPPOSED_TO_BE_BUSY = "SUPPOSED_TO_BE_BUSY",
  BUSY = "BUSY",
  BUSY_BY_YOU = "BUSY_BY_YOU",
}

export type TableData = {
  id: number;
  guiX: number;
  guiY: number;
  guiW: number;
  guiH: number;
  maxSeats: number;
  type: TableType;
  closestReservations: any;
  isBusy: boolean;
  guests: any;
  state: TableState;
};

export type GetAllTablesResponse = {
  tables: TableData[];
};

export const getAllTablesWithReservations = (): Promise<GetAllTablesResponse | null> => {
  return customFetch<{}, GetAllTablesResponse | null>(
    `${getUrl()}${tablePrefix}with/reservations`,
    Method.GET
  );
};
