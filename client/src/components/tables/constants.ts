import { TableState } from "../../api/types";
import { SimpleObjectType } from "../infoBox/types";

export const colorMapUser = {
  [TableState.FREE]: "#548C2F",
  [TableState.FREE_BUT_BOOKED]: "#FFD449",
  [TableState.SUPPOSED_TO_BE_BUSY]: "#F39237",
  [TableState.BUSY]: "#D63230",
  [TableState.BUSY_BY_YOU]: "#4464AD",
};

export const colorMapAdmin = {
  ...colorMapUser,
  [TableState.BUSY]: "#4464AD",
};

export const tableStateLabelMap: SimpleObjectType = {
  [TableState.FREE]: "Свободен",
  [TableState.FREE_BUT_BOOKED]: "Свободен",
  [TableState.SUPPOSED_TO_BE_BUSY]: "Забронирован",
  [TableState.BUSY]: "Обслуживается другим сотрудником",
  [TableState.BUSY_BY_YOU]: "Обслуживается вами",
};
