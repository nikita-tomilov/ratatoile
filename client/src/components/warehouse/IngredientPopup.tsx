import React, { useCallback, useState } from "react";
import "./Warehouse.css";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {addIngredientRequest, IngredientData, editIngredientRequest} from "../../api/warehouse";

const defaultIngredient = {
    id: '',
    name: '',
    uom: '',
    warehouseAmount: 0
};

export const IngredientPopup = (props: {
    onChangeSubmit: () => void;
    onCancel: () => void;
    isNew: boolean,
    selectedItem: IngredientData | null
}): JSX.Element => {
  const data = props.selectedItem != null ? props.selectedItem : defaultIngredient;
  const [name, setName] = useState(data.name);
  const [uom, setUom] = useState(data.uom);
  const [warehouseAmount, setWarehouseAmount] = useState(data.warehouseAmount);

  const onNameChange = useCallback((ev) => setName(ev.currentTarget.value), []);
  const onUomChange = useCallback((ev) => setUom(ev.currentTarget.value), []);
  const onCountChange = useCallback((ev) => setWarehouseAmount(ev.currentTarget.value), []);

  const addIngredientHandler = useCallback(
    () => (props.isNew ? addIngredientRequest : editIngredientRequest)({ id: data.id, name, uom, warehouseAmount}).then(props.onChangeSubmit),
    [name, uom, warehouseAmount, props.onChangeSubmit, props.isNew]
  );
  return (
    <div className="addIngredientWrapper">
      <div className="popupTitle">{props.isNew ? 'Добавить новый' : 'Изменить'} ингредиент</div>
      <div className="input">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Название ингридиента"
          type="text"
          id="name"
          value={name}
          onChange={onNameChange}
        />
      </div>
      <div className="input">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Мера измерения"
          type="text"
          id="uom"
          value={uom}
          onChange={onUomChange}
        />
      </div>
      <div className="input">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Количество"
          type="number"
          id="warehouseAmount"
          value={warehouseAmount}
          onChange={onCountChange}
        />
      </div>
      <div className="controls">
        <div className="btnWrapper">
          <Button
            variant="contained"
            color="primary"
            onClick={addIngredientHandler}
          >
              {props.isNew ? 'Добавить новый продукт' : 'Сохранить изменения'}
          </Button>
        </div>
        <div className="btnWrapper">
          <Button
            variant="outlined"
            color="primary"
            onClick={props.onCancel}
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};
