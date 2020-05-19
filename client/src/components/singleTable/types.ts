import { SideMenuType } from "../SideMenu";

export type SingleTableProps = {
  selectedId: number | null;
  setLastSelectedTable: (id: number | null) => void;
  setCurrentMenuItem: (menuType: SideMenuType) => void;
};

export type DishInfo = {
  dishName: string;
  price: number;
  quantity: number;
  total: number;
};

export type GuestInfo = {
  positions: DishInfo[];
  sumPerGuest: number;
};

export type TableEstimateResponse = {
  totalSum: number;
  guests: GuestInfo[];
};

export type TableEstimationDataProps = {
  data: TableEstimateResponse;
  setCurrentMenuItem: (menuType: SideMenuType) => void;
};
