import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./DishList.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { RowData } from "../tableForData/types";
import { getAllIngredientsRequest } from "../../api/warehouse";
import { addIngredientToDishRequest } from "../../api/dishes";

export const AddIngredientToDish = (props: {
  dishId: number;
  onAddFinished: () => void;
}): JSX.Element => {
  useEffect(() => {
    getAllIngredientsRequest().then(
      (data) => data && data.ingredients && setOptions(data.ingredients)
    );
  }, []);

  const [options, setOptions] = useState<RowData[]>([]);
  const [ingredient, setIngredient] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const optionsLabels = useMemo(() => options.map((el) => el.name), [options]);

  const amountChangeHandler = useCallback((ev) => {
    setAmount(Number(ev.currentTarget.value) || 0);
  }, []);

  const ingredientAddHandler = useCallback(() => {
    const id = options.find((el) => el.name === ingredient);
    id &&
      addIngredientToDishRequest(props.dishId, id.id, amount).then(() => {
        setAmount(0);
        setIngredient("");
        props.onAddFinished();
      });
  }, [ingredient, options]);

  return (
    <div className="addIngredient">
      <div className="btn">
        <Autocomplete
          value={ingredient}
          onChange={(ev: any, value: any) => setIngredient(value)}
          id="controllable-states-demo"
          options={optionsLabels}
          style={{ width: 300 }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              label="Доступные ингредиенты"
              variant="outlined"
            />
          )}
        />
      </div>
      <div className="btn margin">
        <TextField
          variant="outlined"
          margin="normal"
          required
          name="name"
          label="Количество"
          type="text"
          id="name"
          value={amount}
          onChange={amountChangeHandler}
        />
      </div>
      <div className="btn">
        <Button
          variant="contained"
          color="primary"
          onClick={ingredientAddHandler}
        >
          Добавить ингредиент
        </Button>
      </div>
    </div>
  );
};
