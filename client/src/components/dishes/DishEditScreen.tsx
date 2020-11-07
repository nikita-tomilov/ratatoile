import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./DishList.css";
import { Button } from "@material-ui/core";
import { DataTable } from "../tableForData/DataTable";
import { getDishIngredientsScheme } from "./igridientsListConfig";
import { RowData } from "../tableForData/types";
import {
  getDishInfoRequest,
  getImageUrl,
  removeIngredientFromDishRequest,
  updateDishRequest,
  uploadImage,
} from "../../api/dishes";
import { AddIngredientToDish } from "./AddIngredientToDish";
import {
  emptyValidator,
  FormWrapper,
  positiveNumberValidator,
  SimpleField,
  someDataNotProvided
} from "../inputs/SimpleField";

export const DishEditScreen = (props: {
  dishId: number;
  onCancel: () => void;
}): JSX.Element => {
  const [dataRequestFinished, setDataRequestIsFinished] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [data, setData] = useState<RowData[] | null>(null);
  const [name, setName] = useState<string | null >(null);
  const [description, setDescription] = useState<string | null>(null);
  const [price, setPrice] = useState<number| null >(null);
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [photoFileData, setPhotoFileData] = useState<any | null>(null);
  const onDelete = useCallback((event) => {
    if(window.confirm("Вы уверены, что хотите удалить этот ингредиент?"))
      removeIngredientFromDishRequest(event.currentTarget.value)
          .then(() => setData(null));
  }, []);
  const scheme = useMemo(() => getDishIngredientsScheme({ onDelete }), []);

  useEffect(() => {
    if (data === null)
      getDishInfoRequest(props.dishId).then((response) => {
        if (response) {
          setData(response.ingredients);
          setName(response.name);
          setDescription(response.description);
          setPrice(response.price);
          setPhotoId(response.photoId);
        }
      }).then(()=>setDataRequestIsFinished(true));
  }, [data]);

  const saveHandler = useCallback(() => {
    if(name === null  || description === null || price === null)
      setShowErrorMessage(true);
    else {
      setShowErrorMessage(false);
      updateDishRequest({ description, name, price, id: props.dishId }).then(() =>
          setData(null)
      );
    }
  }, [description, name, price]);

  let image = <div className="photo">Фото не задано {photoId}</div>;
  if (photoId != null) {
    const url = getImageUrl(photoId) + "?dummy=" + new Date();
    console.log(url);
    image = <img className="photo" src={url} alt="some pic"/>;
  }
  const onPhotoFileChange = useCallback(
    (e) => {
      e.preventDefault();

      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        setPhotoFileData({
          file: file,
          imagePreviewUrl: reader.result,
        });
        console.log("set file", file);
        console.log("set imagePreviewUrl", reader.result);
      };

      reader.readAsDataURL(file);
    },
    [photoFileData]
  );
  const onPhotoFileSubmit = useCallback(
    (ev) => {
      console.log(ev);
      console.log(photoFileData);
      const data = new FormData();
      data.append("file", photoFileData.file);
      uploadImage(props.dishId, data).then(() => setData(null));
    },
    [photoFileData]
  );

  const elements = useMemo(() => {
    return [
      <SimpleField
          isRequired={true}
          label="Название блюда"
          type="text"
          id="name"
          onChange={setName}
          validator={emptyValidator}
          startValue={name}
      />,
      <SimpleField
          label="Описание блюда"
          type="text"
          id="name"
          onChange={setDescription}
          startValue={description}
      />,
      <SimpleField
          isRequired={true}
          label="Цена"
          type="number"
          id="name"
          onChange={setPrice}
          startValue={price}
          validator={(value) => emptyValidator(value) && positiveNumberValidator(value)}
          validationText={'Цена не может быть отрицательной'}
      />,
      <>
        {
          showErrorMessage
          && <div className="error">{someDataNotProvided}</div>
        }
      </>,
      <Button variant="contained" color="primary" onClick={saveHandler}>
        Сохранить
      </Button>
    ];

  }, [saveHandler, showErrorMessage, price, description, name]);

  return dataRequestFinished ? (
    <div className="dishEditWrapper">
      <div className="headerWrapper">
        <div className="panelTitle">Редактирование: "{name}"</div>
        <div className="headerControls">
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
      <div className="editFields">
        <div className="photoArea">
          {image}
          <div className="imageLoad">
            <input
              className="fileInput"
              type="file"
              onChange={onPhotoFileChange}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={onPhotoFileSubmit}
              disabled={photoFileData === null}
              style={{ width: 220, marginTop: 150 }}
            >
              Загрузить
            </Button>
          </div>
        </div>
        <div className="part">
          <FormWrapper inputs={elements} />
        </div>
        <div className="part" />
      </div>
      <div className="tableWrapper large">
        <div className="itemTitle">Ингредиенты</div>
        <DataTable scheme={scheme} data={data} />
      </div>
      <AddIngredientToDish
        dishId={props.dishId}
        onAddFinished={() => setData(null)}
      />
    </div>
  ) : <div />;
};
