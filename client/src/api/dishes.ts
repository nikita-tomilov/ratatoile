import { RowData } from "../components/tableForData/types";
import {customFetch, customFetchForImages} from "./customFetch";
import {getUnprotectedUrl, getUrl} from "./url";
import { Method } from "../services/types";
import {ErrorResponse} from "./types";

const dishPrefix = "/dish/";
const menuPrefix = "/menu/";
const dishIngredientPrefix = "/dishingredient/";

type AllDishesResponse = {
  dishes: RowData[];
};

export const getAllDishesRequest = (): Promise<AllDishesResponse | null> => {
  return customFetch<{}, AllDishesResponse | null>(
    `${getUrl()}${dishPrefix}all`,
    Method.GET
  );
};

export const deleteDishRequest = (id: number): Promise<void | ErrorResponse> => {
  return customFetch<{}, void | ErrorResponse>(
    `${getUrl()}${dishPrefix}delete/${id}`,
    Method.DELETE
  );
};

export type AddDishRequestData = {
  name: string;
  description: string;
  price: number;
  photoId: number;
};
export const addDishRequest = (
  dishData: AddDishRequestData
): Promise<void | null> => {
  return customFetch<{}, void | null>(
    `${getUrl()}${dishPrefix}create`,
    Method.POST,
    dishData
  );
};

export type IngredientData = {
  amount: number;
  entryId: number;
  ingredientId: number;
  name: string;
};

export type DishInfoResponseData = {
  description: string;
  name: string;
  id: number;
  photoId: number;
  price: number;
  ingredients: IngredientData[];
};

export const getDishInfoRequest = (
  dishId: number
): Promise<DishInfoResponseData | null> => {
  return customFetch<{}, DishInfoResponseData | null>(
    `${getUrl()}${dishIngredientPrefix}getdish/${dishId}`,
    Method.GET
  );
};

export type UpdateDishRequestData = {
  description: string;
  id: number;
  name: string;
  price: number;
};
export const updateDishRequest = (
  body: UpdateDishRequestData
): Promise<DishInfoResponseData | null> => {
  return customFetch<{}, DishInfoResponseData | null>(
    `${getUrl()}${dishPrefix}update`,
    Method.POST,
    body
  );
};

export const addIngredientToDishRequest = (
  dishId: number,
  ingredientId: number,
  amount: number
): Promise<DishInfoResponseData | null> => {
  return customFetch<{}, DishInfoResponseData | null>(
    `${getUrl()}${dishIngredientPrefix}add/${dishId}/${ingredientId}/${amount}`,
    Method.GET
  );
};

export const removeIngredientFromDishRequest = (
  entryId: number
): Promise<DishInfoResponseData | null> => {
  return customFetch<{}, DishInfoResponseData | null>(
    `${getUrl()}${dishIngredientPrefix}delete/${entryId}`,
    Method.DELETE
  );
};

export const getImageUrl = (photoId: number): string => `${getUnprotectedUrl()}${menuPrefix}dishphoto/${photoId}`;

export const uploadImage = (
  dishId: number,
  body: any
): Promise<any | null> => {
  return customFetchForImages<{}, any | null>(
    `${getUrl()}${dishPrefix}setimage/${dishId}`,
    Method.POST,
    body
  );
};