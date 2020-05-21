import React, { useCallback, useState } from "react";
import "./DishList.css";
import { Button } from "@material-ui/core";
import { addDishRequest } from "../../api/dishes";
import { DishForm } from "./DishForm";

export const AddDishPopup = (props: {
  onDishAdded: () => void;
  onCancel: () => void;
}): JSX.Element => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const onNameChange = useCallback((ev) => setName(ev.currentTarget.value), []);
  const addDishHandler = useCallback(
    () =>
      addDishRequest({ name, description, price, photoId: 0 }).then(
        props.onDishAdded
      ),
    [name, props.onDishAdded]
  );
  const onDescriptionChange = useCallback(
    (ev) => setDescription(ev.currentTarget.value),
    []
  );
  const onPriceChange = useCallback(
    (ev) => setPrice(Number(ev.currentTarget.value) || 0),
    []
  );
  return (
    <div className="addIngredientWrapper addDishWrapper">
      <div className="popupTitle">Добавить новый ингредиент</div>
      <DishForm
        name={name}
        price={price}
        description={description}
        setName={onNameChange}
        setPrice={onPriceChange}
        setDescription={onDescriptionChange}
      />
      <div className="controls">
        <div className="btnWrapper">
          <Button variant="contained" color="primary" onClick={addDishHandler}>
            Добавить блюдо
          </Button>
        </div>
        <div className="btnWrapper">
          <Button
            variant="contained"
            color="secondary"
            onClick={props.onCancel}
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};
