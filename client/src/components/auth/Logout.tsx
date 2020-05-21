import React from "react";
import "./Logout.css";
import Button from "@material-ui/core/Button";
import { getAuthService } from "./authService";
const authService = getAuthService();

export const Logout = (props: {
  isAdmin: boolean;
  userName: string;
}): JSX.Element => {
  return (
    <div className="logoutWrapper">
      <div className="header panelTitle">Настройки</div>
      <div className="infoWrapper">
        <div className="infoItem">Ваш пользователь: {props.userName}</div>
        <div className="infoItem">
          Уровень полномочий: {props.isAdmin ? "Администратор" : "Пользователь"}
        </div>
      </div>
      <div className="btnWrapper">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={authService.logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
