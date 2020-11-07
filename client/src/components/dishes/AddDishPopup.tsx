import React, {useCallback, useState} from "react";
import "./DishList.css";
import { Button } from "@material-ui/core";
import { addDishRequest } from "../../api/dishes";
import {
  emptyValidator,
  FormWrapper,
  positiveNumberValidator,
  SimpleField,
  someDataNotProvided
} from "../inputs/SimpleField";

export const AddDishPopup = (props: {
  onDishAdded: () => void;
  onCancel: () => void;
}): JSX.Element => {
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if(name === null || description === null || price == null)
      setShowErrorMessage(true);
    else {
      setShowErrorMessage(false);
      addDishRequest({ name, description, price, photoId: 0 }).then(props.onDishAdded);
    }
  }, [price, name, description, props.onDishAdded]);

  return (
    <div className="addIngredientWrapper">
      <div className='headerWrapper'>
        <div className="popupTitle">Добавить новое блюдо</div>
        <Button
            variant="outlined"
            color="primary"
            onClick={props.onCancel}
        >
          Назад
        </Button>
      </div>

      <FormWrapper inputs={
        [
          <SimpleField
              isRequired={true}
              label="Название блюда"
              type="text"
              id="name"
              onChange={setName}
              validator={emptyValidator}
          />,
          <SimpleField
              label="Описание блюда"
              type="text"
              id="name"
              onChange={setDescription}
          />,
          <SimpleField
              isRequired={true}
              label="Цена"
              type="number"
              id="name"
              onChange={setPrice}
              validator={(value) => emptyValidator(value) && positiveNumberValidator(value)}
              validationText={'Цена не может быть отрицательной'}
          />,
          <>
            {
              showErrorMessage
              && <div className="error">{someDataNotProvided}</div>
            }
          </>,
          <div className="controls">
            <div className="btnWrapper">
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Добавить блюдо
              </Button>
            </div>
          </div>
        ]
      } />

    </div>
  );
};
