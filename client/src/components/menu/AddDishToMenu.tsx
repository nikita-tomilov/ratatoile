import React, { useCallback, useEffect, useMemo, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { RowData } from "../tableForData/types";
import { getAllDishesRequest } from "../../api/dishes";
import { addDishToMenuRequest } from "../../api/menu";

export const AddDishToMenu = (props: {
  onAddFinished: () => void;
  checkIfExists: (dishId: number) => boolean;
}): JSX.Element => {
  useEffect(() => {
    getAllDishesRequest().then(
      (data) => data && data.dishes && setOptions(data.dishes)
    );
  }, []);

  const [options, setOptions] = useState<RowData[]>([]);
  const [dish, setDish] = useState<string>("");
  const optionsLabels = useMemo(() => options.map((el) => el.name), [options]);

  const existAlready = useMemo(() => {
    const id = options.find((el) => el.name === dish);
    const result = id && props.checkIfExists(Number(id.id));
    return result || false;
  }, [dish]);

  const dishAddHandler = useCallback(() => {
    if (existAlready) return;
    const id = options.find((el) => el.name === dish);
    id &&
      addDishToMenuRequest(id.id, id.id * 10).then(() => {
        setDish("");
        props.onAddFinished();
      });
  }, [dish, options, props.checkIfExists]);

  return (
    <div className="addIngredient">
      <div className="btn">
        <Autocomplete
          value={dish}
          onChange={(ev: any, value: any) => setDish(value)}
          id="controllable-states-demo"
          options={optionsLabels}
          style={{ width: 300 }}
          renderInput={(params: any) => (
            <TextField {...params} label="Доступные блюда" variant="outlined" />
          )}
        />
      </div>
      <div className="btn">
        <Button
          variant="contained"
          color="primary"
          onClick={dishAddHandler}
          disabled={existAlready}
        >
          Добавить блюдо в меню
        </Button>
      </div>
    </div>
  );
};
