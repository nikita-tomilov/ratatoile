import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./DishList.css";
import { Button } from "@material-ui/core";
import { RowData } from "../tableForData/types";
import { getAllIngredientsRequest } from "../../api/warehouse";
import { addIngredientToDishRequest } from "../../api/dishes";
import {SimpleField} from "../inputs/SimpleField";
import {OptionsField} from "../inputs/OptionsField";

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

  const amountChangeHandler = useCallback((value) => {
    const val = Number(value);
    setAmount(val || 0);
  }, []);

  const ingredientAddHandler = useCallback(() => {
    const id = options.find((el) => el.name === ingredient);
    id &&
      addIngredientToDishRequest(props.dishId, id.id, amount).then(() => {
        setAmount(0);
        setIngredient("");
        props.onAddFinished();
      });
  }, [amount, ingredient, options]);

  return (
    <div className="addIngredient">
      <OptionsField
          key={"ingredients-demo"}
          label={"Ингредиенты"}
          options={optionsLabels}
          onChange={(value: any) => setIngredient(value)}
      />
      <div style={{width: 20}}/>
      <SimpleField
          label={"Количество"}
          id={"name"}
          onChange={amountChangeHandler}
          validator={(value) => Number(value) !== null && Number(value) > 0}
          type={'number'}
          isForced={true}
          isRequired={true}
      />

      <div className="btn">
        <Button
          variant="contained"
          color="primary"
          onClick={ingredientAddHandler}
          disabled={amount <= 0 || ingredient.length === 0}
        >
          Добавить ингредиент
        </Button>
      </div>
    </div>
  );
};
