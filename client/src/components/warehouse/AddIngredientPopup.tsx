import React, { useCallback, useState } from "react";
import "./Warehouse.css";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { addIngredientRequest } from "../../api/warehouse";

export const AddIngredientPopup = (props: {
  onIngredientAdded: () => void;
  onCancel: () => void;
}): JSX.Element => {
  const [name, setName] = useState("");
  const onNameChange = useCallback((ev) => setName(ev.currentTarget.value), []);

  const addIngredientHandler = useCallback(
    () => addIngredientRequest({ name }).then(props.onIngredientAdded),
    [name, props.onIngredientAdded]
  );
  return (
    <div className="addIngredientWrapper">
      <div className="popupTitle">Добавить новый ингредиент</div>
      <div className="input">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="name"
          label="Название ингридиента"
          type="text"
          id="name"
          value={name}
          onChange={onNameChange}
        />
      </div>
      <div className="controls">
        <div className="btnWrapper">
          <Button
            variant="contained"
            color="primary"
            onClick={addIngredientHandler}
          >
            Добавить новый продукт
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
