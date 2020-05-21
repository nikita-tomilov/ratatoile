import { customFetch } from "./customFetch";
import { getUrl } from "./url";
import { Method } from "../services/types";
import { RowData } from "../components/tableForData/types";
import { ErrorResponse } from "./types";

const donationPrefix = "/donation/";

export const getAllCriticDonationsRequest = (): Promise<{
  donations: RowData[];
} | null> => {
  return customFetch<{}, any | ErrorResponse>(
    `${getUrl()}${donationPrefix}critic/all`,
    Method.GET
  ).then((data) => {
    if (data.error) return null;
    else return data;
  });
};

export const deleteCriticDonationRequest = (
  reservationId: number
): Promise<any | ErrorResponse> => {
  return customFetch<{}, any | ErrorResponse>(
    `${getUrl()}${donationPrefix}critic/delete/${reservationId}`,
    Method.DELETE
  );
};

export type CreateCriticDonationRequestData = {
  amount: number;
  criticName: string;
  reason: string;
  date: number;
};

export const createCriticDonationRequest = (
  body: CreateCriticDonationRequestData
): Promise<any | ErrorResponse> => {
  return customFetch<{}, any | ErrorResponse>(
    `${getUrl()}${donationPrefix}critic/create`,
    Method.POST,
    body
  );
};

export const getAllInspectorDonationsRequest = (): Promise<{
  donations: RowData[];
} | null> => {
  return customFetch<{}, any | ErrorResponse>(
    `${getUrl()}${donationPrefix}inspector/all`,
    Method.GET
  ).then((data) => {
    if (data.error) return null;
    else return data;
  });
};

export const deleteInspectorDonationRequest = (
  reservationId: number
): Promise<any | ErrorResponse> => {
  return customFetch<{}, any | ErrorResponse>(
    `${getUrl()}${donationPrefix}inspector/delete/${reservationId}`,
    Method.DELETE
  );
};

export type CreateInspectorDonationRequestData = {
  amount: number;
  reason: string;
  date: number;
};

export const createInspectorDonationRequest = (
    body: CreateInspectorDonationRequestData
): Promise<any | ErrorResponse> => {
  return customFetch<{}, any | ErrorResponse>(
      `${getUrl()}${donationPrefix}inspector/create`,
      Method.POST,
      body
  );
};