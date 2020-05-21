import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "../tableForData/DataTable";
import { Button } from "@material-ui/core";
import "./Warehouse.css";
import { getWarehouseScheme } from "./warehouseConfig";
import { RowData } from "../tableForData/types";
import {
  deleteIngredientRequest,
  getAllIngredientsRequest,
} from "../../api/warehouse";
import { AddIngredientPopup } from "./AddIngredientPopup";

export const Warehouse = (): JSX.Element => {
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [data, setData] = useState<RowData[] | null>(null);
  const onDelete = useCallback((event) => {
    deleteIngredientRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);
  const scheme = useMemo(() => getWarehouseScheme({ onDelete }), [onDelete]);
  const addIngredientHandler = useCallback(() => setAddPopupVisible(true), []);

  useEffect(() => {
    if (data === null)
      getAllIngredientsRequest().then(
        (data) => data && setData(data.ingredients)
      );
  }, [data]);

  const onClose = useCallback(() => setAddPopupVisible(false), []);
  const ingredientAddedHandler = useCallback(() => {
    onClose();
    setData(null);
  }, [onClose]);

  return (
    <>
      <div className={`warehouseWrapper ${addPopupVisible ? "overlay" : ""}`}>
        <div className="panelTitle">Склад</div>
        <div className="tableWrapper">
          {scheme && <DataTable scheme={scheme} data={data} />}
        </div>
        <div className="btnWrapper">
          <Button
            variant="contained"
            color="primary"
            onClick={addIngredientHandler}
          >
            Добавить новый продукт
          </Button>
        </div>
      </div>

      {addPopupVisible ? (
        <AddIngredientPopup
          onCancel={onClose}
          onIngredientAdded={ingredientAddedHandler}
        />
      ) : null}
    </>
  );
};
