import {customFetch} from "./customFetch";
import {getUrl} from "./url";
import {Method} from "../components/auth/types";

const cardsPrefix = "/cards/";

export type Card = {
    id: number;
    fullName: string;
    phone: string;
    birthday: number;
}

export const getAllAvailableCards = (): Promise< { cards: Card[] }  | null> => {
    return customFetch<{}, { cards: Card[] } | null>(
        `${getUrl()}${cardsPrefix}all`,
        Method.GET
    );
};

export const createNewCard = (fullName: string, phone: string, birthday: number): Promise<Card | null> => {
    return customFetch<Omit<Card, "id">, Card | null>(
        `${getUrl()}${cardsPrefix}create`,
        Method.POST,
        {
            fullName,
            phone,
            birthday
        }
    );
};

export const deleteCard = (cardId: number): Promise<Card | null> => {
    return customFetch<{}, Card | null>(
        `${getUrl()}${cardsPrefix}delete/${cardId}`,
        Method.DELETE,
    );
};