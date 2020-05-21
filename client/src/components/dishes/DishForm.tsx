import React from "react";
import "./DishList.css";
import TextField from "@material-ui/core/TextField";

type DishFormProps = {
  name: string;
  description: string;
  price: number;
  setName: (event: any) => void;
  setDescription: (event: any) => void;
  setPrice: (event: any) => void;
};

export const DishForm = (props: DishFormProps): JSX.Element => {
  const { name, description, price, setName, setDescription, setPrice } = props;
  return (
    <div className="input">
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="name"
        label="Название блюда"
        type="text"
        id="name"
        value={name}
        onChange={setName}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="name"
        label="Описание блюда"
        type="text"
        id="name"
        value={description}
        onChange={setDescription}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="name"
        label="Цена"
        type="text"
        id="name"
        value={price}
        onChange={setPrice}
      />
    </div>
  );
};
