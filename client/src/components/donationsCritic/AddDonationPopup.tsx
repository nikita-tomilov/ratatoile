import React, { useCallback, useEffect, useState } from "react";
import "./AddDonationPopup.css";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Button } from "@material-ui/core";
import { getAllDishesRequest } from "../../api/dishes";
import { checkIsNumber } from "../infoBox/AddGuests";

const mentionLabels = [
  "Нетрадиционный персонал",
  "Нетипичная чистота",
  "Альтернативная гигиена",
];

export const AddDonationPopup = (props: {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  title: string;
  isInspector: boolean;
}): JSX.Element => {
  const [price, setPrice] = useState<number>(0);
  const [name, setName] = useState("");
  const [mention, setMention] = useState("");
  const [dish, setDish] = useState("");
  const [dishLabels, setDishLabels] = useState<string[]>([]);
  const priceChangeHandler = useCallback(
    (event) =>
      checkIsNumber(event.currentTarget.value) &&
      setPrice(Number(event.currentTarget.value)),
    [price]
  );
  const nameChangeHandler = useCallback(
    (ev) => setName(ev.currentTarget.value),
    []
  );
  const mentionChangeHandler = useCallback(
    (ev: any, value: any) => setMention(value),
    []
  );
  const dishChangeHandler = useCallback(
    (ev: any, value: any) => setDish(value),
    []
  );
  useEffect(() => {
    getAllDishesRequest().then(
      (data) => data?.dishes && setDishLabels(data.dishes.map((el) => el.name))
    );
  }, []);
  return (
    <div className="addDonationPopup">
      <div className="popupTitle" style={{marginBottom: 20}}>{props.title}</div>
      <div className="infoPanel">
        <TextField
          variant="outlined"
          margin="normal"
          required
          name="name"
          label="Сумма пожертвования"
          type="text"
          id="name"
          style={{ width: 300 }}
          value={price}
          onChange={priceChangeHandler}
        />
        {props.isInspector ? (
          <Autocomplete
            inputValue={mention}
            onInputChange={mentionChangeHandler}
            id="controllable-states-demo"
            options={mentionLabels}
            style={{ width: 300 }}
            freeSolo={true}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Особые отметки"
                variant="outlined"
              />
            )}
          />
        ) : (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="name"
              label="Имя получателя"
              type="text"
              id="name"
              style={{ width: 300 }}
              value={name}
              onChange={nameChangeHandler}
            />
            <Autocomplete
              inputValue={dish}
              onInputChange={dishChangeHandler}
              id="controllable-states-demo"
              options={dishLabels}
              freeSolo={true}
              style={{ width: 300, marginTop: 16 }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="Благодарность за"
                  variant="outlined"
                />
              )}
            />
          </>
        )}
      </div>
      <div style={{marginTop: 20}} className="controls">
        <Button
          variant="contained"
          color="primary"
          onClick={props.onSubmit}
          value={JSON.stringify({
            price,
            name,
            mention,
            dish,
          })}
        >
          ОК
        </Button>
        <div className="btnWrapper">
          <Button
            variant="outlined"
            color="primary"
            onClick={props.onCancel}
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
};
