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
    Method.DELETE
  );
};

export type AddIngredientRequestData = {
  name: string;
};

export const addIngredientRequest = (
  data: AddIngredientRequestData
): Promise<void> => {
  return customFetch<AddIngredientRequestData, void>(
    `${getUrl()}${ingredientPrefix}create`,
    Method.POST,
    data
  );
};
