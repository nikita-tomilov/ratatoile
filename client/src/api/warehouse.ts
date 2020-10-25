import { RowData } from "../components/tableForData/types";
import { customFetch } from "./customFetch";
import { getUrl } from "./url";
import { Method } from "../components/auth/types";

const ingredientPrefix = "/ingredient/";

export const getAllIngredientsRequest = (): Promise<{
  ingredients: RowData[];
} | null> => {
  return customFetch<{}, any | null>(
    `${getUrl()}${ingredientPrefix}all`,
    Method.GET
  );
};

export const deleteIngredientRequest = (id: number): Promise<void> => {
  return customFetch<{}, void>(
    `${getUrl()}${ingredientPrefix}delete/${id}`,
    Method.DELETE,
    undefined,
    true
  );
};

export const editIngredientRequest = (data: IngredientData): Promise<void> => {
  return customFetch<{}, void>(
    `${getUrl()}${ingredientPrefix}update`,
    Method.POST,
    {
        id: data.id,
        name: data.name,
        uom: data.uom,
        warehouseAmount: data.warehouseAmount
    }
  );
};

export type IngredientData = {
    id: string;
    name: string;
    uom: string;
    warehouseAmount: number;
};

export const addIngredientRequest = (
  data: IngredientData
): Promise<void> => {
  return customFetch<IngredientData, void>(
    `${getUrl()}${ingredientPrefix}create`,
    Method.POST,
    data
  );
};
