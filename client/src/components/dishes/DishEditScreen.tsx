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
import { DishForm } from "./DishForm";
import { AddIngredientToDish } from "./AddIngredientToDish";

export const DishEditScreen = (props: {
  dishId: number;
  onCancel: () => void;
}): JSX.Element => {
  const [data, setData] = useState<RowData[] | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [photoFileData, setPhotoFileData] = useState<any | null>(null);
  const onDelete = useCallback((event) => {
    removeIngredientFromDishRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);
  const scheme = useMemo(() => getDishIngredientsScheme({ onDelete }), []);

  useEffect(() => {
    if (data === null)
      getDishInfoRequest(props.dishId).then((data) => {
        if (data) {
          setData(data.ingredients);
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setPhotoId(data.photoId);
        }
      });
  }, [data]);

  const onNameChange = useCallback((ev) => setName(ev.currentTarget.value), []);
  const onDescriptionChange = useCallback(
    (ev) => setDescription(ev.currentTarget.value),
    []
  );
  const onPriceChange = useCallback(
    (ev) => setPrice(Number(ev.currentTarget.value) || 0),
    []
  );

  const saveHandler = useCallback(() => {
    updateDishRequest({ description, name, price, id: props.dishId }).then(() =>
      setData(null)
    );
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

  return (
    <div className="dishEditWrapper">
      <div className="headerWrapper">
        <div className="panelTitle">Редактирование: "{name}"</div>
        <div className="headerControls">
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
              variant="contained"
              color="secondary"
              onClick={onPhotoFileSubmit}
              disabled={photoFileData === null}
              style={{ width: 220, marginTop: 150 }}
            >
              Загрузить
            </Button>
          </div>
        </div>
        <div className="part">
          <DishForm
            name={name}
            price={price}
            description={description}
            setName={onNameChange}
            setPrice={onPriceChange}
            setDescription={onDescriptionChange}
          />
          <div className="button">
            <Button variant="contained" color="primary" onClick={saveHandler}>
              Сохранить
            </Button>
          </div>
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
  );
};
