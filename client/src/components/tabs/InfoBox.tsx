import React, { useMemo } from "react";
import Button from "@material-ui/core/Button";
import "./InfoBox.css";
import { TableData } from "../../api/tables";
import config from "./infoByTableStateMap.json";
import { format } from "util";

export type SimpleObjectType = { [key: string]: any };
export type TableConfig = {
  title: string;
  type: number;
  fields: string[];
};

export type InfoBoxProps = {
  onClose: () => void;
  selected: TableData;
};

const getInfoItemBody = (
  item: TableConfig,
  data: TableData
): { title: string; body: string | string[] } => {
  const singleData = (data as SimpleObjectType)[item.fields[0]];
  return {
    title: item.title,
    body:
      item.type === 1
        ? singleData
        : item.type === 2
        ? (singleData as any[]).map(
            (el, index) =>
              `${index + 1}) ${new Date(el.from).toLocaleString()} - ${new Date(
                el.to
              ).toLocaleString()}`
          )
        : "",
  };
};

export const InfoBox = (props: InfoBoxProps): JSX.Element => {
  const tableConfig = useMemo(
    () => (config.info as SimpleObjectType)[props.selected.state.toLowerCase()],
    [props.selected]
  );

  const infoItems: { title: string; body: string | string[] }[] = useMemo(
    () =>
      tableConfig.infoItems.map((item: TableConfig) =>
        getInfoItemBody(item, props.selected)
      ),
    [tableConfig.infoItems, props.selected]
  );

  return (
    <div className={"boxWrapper"}>
      <div className={"content"}>
        <div className={"title"}>Стол №{props.selected.id}</div>
        <div className={"info"}>
          {infoItems.map(({ title, body }, index) => {
            return (
              <div className={"item"} key={index}>
                <div className={"itemTitle"}>{title}</div>
                <div className={"itemBody"}>{body}</div>
              </div>
            );
          })}
        </div>
        <div className={"controls"}>Стол №{props.selected.id}</div>
      </div>
      <div className={"btnWrapper"}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={props.onClose}
        >
          Finish
        </Button>
      </div>
    </div>
  );
};
