import { RowData } from "../components/tableForData/types";
import { customFetch } from "./customFetch";
import { getUrl } from "./url";
import { Method } from "../services/types";

const menuPrefix = "/menu/";

export type AllDishesInMenuResponse = {
  menu: {
    dish: RowData[];
    id: number;
    menuPosition: number;
    addedAt: number;
  }[];
};

export const getAllDishesInMenuRequest = (): Promise<AllDishesInMenuResponse | null> => {
  return customFetch<{}, any | null>(`${getUrl()}${menuPrefix}get`, Method.GET);
};

export const addDishToMenuRequest = (
  dishId: number,
  position: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${menuPrefix}add/${dishId}/${position}`,
    Method.GET
  );
};

export const deleteDishFromMenuRequest = (
  dishId: number
): Promise<any | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${menuPrefix}delete/${dishId}`,
    Method.DELETE
  );
};
