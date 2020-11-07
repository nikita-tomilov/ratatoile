import React, {useCallback, useMemo, useState} from "react";
import "./Warehouse.css";
import { Button } from "@material-ui/core";
import {addIngredientRequest, IngredientData, editIngredientRequest} from "../../api/warehouse";
import {FormWrapper, SimpleField, someDataNotProvided} from "../inputs/SimpleField";

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
  const data = useMemo(() => props.selectedItem != null ? props.selectedItem : defaultIngredient, [props.selectedItem]);
  const [name, setName] = useState<string | null>(data.name);
  const [uom, setUom] = useState<string | null>(data.uom);
  const [warehouseAmount, setWarehouseAmount] = useState<number | null>(data.warehouseAmount);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const addIngredientHandler = useCallback(
    () => {
        if(name == null || uom === null || warehouseAmount === null)
            setShowErrorMessage(true);
        else {
            setShowErrorMessage(false);
            return (props.isNew ? addIngredientRequest : editIngredientRequest)({
                id: data.id,
                name,
                uom,
                warehouseAmount
            })
                .then(props.onChangeSubmit)
        }
},
    [name, uom, warehouseAmount, props.onChangeSubmit, props.isNew]
  );
  return (
    <div className="addIngredientWrapper">
        <div className="headerWrapper">
            <div className="popupTitle">{props.isNew ? 'Добавить новый' : 'Изменить'} ингредиент</div>
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

        <FormWrapper inputs={
            [
                <SimpleField
                    isRequired={true}
                    label="Название ингредиента"
                    id={'name'}
                    onChange={setName}
                    type={'text'}
                    validator={(value => value.length > 0)}
                    startValue={data.name}
                />,
                <SimpleField
                    isRequired={true}
                    label="Мера измерения"
                    id={'uom'}
                    onChange={setUom}
                    type={'text'}
                    validator={(value => value.length > 0)}
                    startValue={data.uom}
                />,
                <SimpleField
                    isRequired={true}
                    label="Количество на складе"
                    id={'warehouseAmount'}
                    onChange={setWarehouseAmount}
                    type={'number'}
                    validator={(value => value.length > 0 && Number.parseInt(value) !== null && Number.parseInt(value) > 0)}
                    startValue={data.warehouseAmount}
                    validationText={'Количество ингредиента не может быть отрицательным'}
                />,
                <>
                    {
                        showErrorMessage
                        && <div className="error">{someDataNotProvided}</div>
                    }
                </>,
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addIngredientHandler}
                >
                    {props.isNew ? 'Добавить новый продукт' : 'Сохранить изменения'}
                </Button>
            ]
        } />
    </div>
  );
};
