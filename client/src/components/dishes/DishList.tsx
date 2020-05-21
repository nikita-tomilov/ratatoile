import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./DishList.css";
import { DataTable } from "../tableForData/DataTable";
import { Button } from "@material-ui/core";
import { RowData } from "../tableForData/types";
import { getDishListScheme } from "./dishListConfig";
import { deleteDishRequest, getAllDishesRequest } from "../../api/dishes";
import { AddDishPopup } from "./AddDishPopup";
import { DishEditScreen } from "./DishEditScreen";
import { ErrorResponse } from "../../api/types";

const dishIdStorageName = "dishId";
export const DishList = (props: {
  showNotification: (message: string) => void;
}): JSX.Element => {
  useEffect(() => {
    const id = localStorage.getItem(dishIdStorageName);
    if (id) setDishToEditId(Number(id));
  }, []);
  const [dishToEditId, setDishToEditId] = useState<number | null>(null);
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [data, setData] = useState<RowData[] | null>(null);
  const onDelete = useCallback(
    (event) =>
      deleteDishRequest(event.currentTarget.value).then((data) => {
        if ((data as ErrorResponse).error) {
          props.showNotification("Это блюдо использовано в составлении меню!");
        } else setData(null);
      }),
    []
  );
  const onEdit = useCallback((event) => {
    setDishToEditId(event.currentTarget.value);
    localStorage.setItem(dishIdStorageName, event.currentTarget.value);
  }, []);
  const scheme = useMemo(() => getDishListScheme({ onDelete, onEdit }), [
    onDelete,
    onEdit,
  ]);
  const addDishHandler = useCallback(() => setAddPopupVisible(true), []);

  useEffect(() => {
    if (data === null)
      getAllDishesRequest().then((data) => data && setData(data.dishes));
  }, [data]);

  const onClose = useCallback(() => setAddPopupVisible(false), []);
  const dishAddedHandler = useCallback(() => {
    onClose();
    setData(null);
  }, [onClose]);

  const onCancel = useCallback(() => {
    setData(null);
    setDishToEditId(null);
    localStorage.removeItem(dishIdStorageName);
  }, []);
  return dishToEditId !== null ? (
    <DishEditScreen dishId={dishToEditId} onCancel={onCancel} />
  ) : (
    <>
      <div className={`dishListWrapper ${addPopupVisible ? "overlay" : ""}`}>
        <div className="panelTitle">Список блюд ресторана</div>
        <div className="tableWrapper">
          {scheme && <DataTable scheme={scheme} data={data} />}
        </div>
        <div className="btnWrapper">
          <Button variant="contained" color="primary" onClick={addDishHandler}>
            Добавить блюдо
          </Button>
        </div>
      </div>

      {addPopupVisible ? (
        <AddDishPopup onCancel={onClose} onDishAdded={dishAddedHandler} />
      ) : null}
    </>
  );
};
