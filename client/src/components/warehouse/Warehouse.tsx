import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "../tableForData/DataTable";
import { Button } from "@material-ui/core";
import "./Warehouse.css";
import { getWarehouseScheme } from "./warehouseConfig";
import { RowData } from "../tableForData/types";
import {
  IngredientData,
  deleteIngredientRequest,
  getAllIngredientsRequest,
} from "../../api/warehouse";
import { IngredientPopup } from "./IngredientPopup";
import {fetchDataTimer} from "../../App";

export const Warehouse = (): JSX.Element => {
  const [ingredientPopupVisible, setAddPopupVisible] = useState(false);
  const [isNewIngredientAdded, setNewIngredientAdded] = useState(false);
  const [data, setData] = useState<RowData[] | null>(null);
  const [selected, setSelected] = useState<RowData | null>(null);
  const onDelete = useCallback((event) => {
    deleteIngredientRequest(event.currentTarget.value)
        .catch((e) => {
          alert(e);
        }).then(() =>
          setData(null)
        );
  }, []);

  const onEdit = useCallback((event) => {
    const id = Number(event.currentTarget.value);
    const selectedData = data != null ? data.find((el) => el.id == id) ?? null : null;
    setSelected(selectedData);
    setNewIngredientAdded(false);
    setAddPopupVisible(true);
  }, [data]);

  const scheme = useMemo(() => getWarehouseScheme({ onDelete, onEdit }), [onDelete, onEdit]);
  const addIngredientHandler = useCallback(() => {
    setNewIngredientAdded(true);
    setAddPopupVisible(true);
  }, []);

  const updateData = useCallback(() => {
    getAllIngredientsRequest().then(
        (data) => data && setData(data.ingredients)
    );
  }, []);

  const onClose = useCallback(() => setAddPopupVisible(false), []);
  const ingredientAddedHandler = useCallback(() => {
    onClose();
    setData(null);
  }, [onClose]);

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, fetchDataTimer);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={`warehouseWrapper ${ingredientPopupVisible ? "overlay" : ""}`}>
        <div className="headerWrapper">
          <div className="panelTitle">Склад</div>
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
        <div className="tableWrapper">
          {scheme && <DataTable scheme={scheme} data={data} />}
        </div>

      </div>

      {ingredientPopupVisible ? (
        <IngredientPopup
          onCancel={onClose}
          onChangeSubmit={ingredientAddedHandler}
          isNew={isNewIngredientAdded}
          selectedItem={selected as IngredientData}
        />
      ) : null}
    </>
  );
};
