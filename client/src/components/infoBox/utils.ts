import { SimpleObjectType, TableConfig } from "./types";
import { TableData } from "../../api/types";
import { tableStateLabelMap } from "../tables/constants";

export const getInfoItemBody = (
  item: TableConfig,
  data: TableData
): { title: string; body: string | string[] } => {
  const singleData = (data as SimpleObjectType)[item.fields[0]];
  return {
    title: item.title,
    body: tableStateLabelMap[singleData],
  };
};

export const calculateTooltipPosition = (
  x: number,
  y: number,
  h: number,
  w: number
): {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
} => {
  const calculatedTop = y + h;
  const calculatedLeft = x + w;

  if (calculatedTop < 0.5 && calculatedLeft < 0.5) {
    return {
      top: `${(y + h) * 100}%`,
      left: `${(x + w) * 100}%`,
    };
  } else if (calculatedTop < 0.5) {
    return {
      top: `${(y + h) * 100}%`,
      right: `${(1 - x) * 100}%`,
    };
  } else if (calculatedLeft < 0.5) {
    return {
      bottom: `${(1 - y) * 100}%`,
      left: `${(x + w) * 100}%`,
    };
  } else {
    return {
      bottom: `${(1 - y) * 100}%`,
      right: `${(1 - x) * 100}%`,
    };
  }
};
