import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "../tableForData/DataTable";
import {
  deleteDishFromMenuRequest,
  getAllDishesInMenuRequest,
} from "../../api/menu";
import { RowData } from "../tableForData/types";
import { getMenuScheme } from "./menuConfig";
import { AddDishToMenu } from "./AddDishToMenu";

export const Menu = (): JSX.Element => {
  const [data, setData] = useState<RowData[] | null>(null);
  useEffect(() => {
    if (data === null) {
      getAllDishesInMenuRequest().then(
        (receivedData) =>
          receivedData &&
          setData(
            receivedData.menu.map((el) => {
              return { ...el.dish, menuItemId: el.id };
            })
          )
      );
    }
  }, [data]);

  const onDelete = useCallback(
    (ev) =>
      deleteDishFromMenuRequest(Number(ev.currentTarget.value)).then(
        addFinishedHandler
      ),
    []
  );
  const scheme = useMemo(() => getMenuScheme({ onDelete }), []);
  const addFinishedHandler = useCallback(() => {
    setData(null);
  }, []);

  const checkIfExists = useCallback(
    (id: number) => {
      return data?.findIndex((el) => el.id === id) !== -1;
    },
    [data]
  );
  return (
    <div className="panelWrapper">
      <div className="panelTitle">Меню</div>
      <div className="tablesWrapper">
        <DataTable scheme={scheme} data={data} />
      </div>
      <AddDishToMenu
        onAddFinished={addFinishedHandler}
        checkIfExists={checkIfExists}
      />
    </div>
  );
};
