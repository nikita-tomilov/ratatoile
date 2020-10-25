import React, { useCallback, useState } from "react";
import "./SignIn.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { getAuthService } from "./authService";
import store from "../../store/store";
import { StateChangeActionType } from "../../store/actions";
import {AppState, SideMenuType} from "../../types";

const authService = getAuthService();

const SignIn = (props: {
  authFailMessage: string | null;
  setCurrentMenuItem: (nextMenuItem: SideMenuType) => void;
}): JSX.Element => {
  const { setCurrentMenuItem, authFailMessage } = props;
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onNameChange = useCallback((event) => {
    if (event.currentTarget && event.currentTarget.value)
      setName(event.currentTarget.value);
  }, []);

  const onPasswordChange = useCallback((event) => {
    if (event.currentTarget && event.currentTarget.value)
      setPassword(event.currentTarget.value);
  }, []);

  const onSignIn = useCallback(() => {
    authService.login(name, password);
  }, [name, password, setCurrentMenuItem]);

  const onKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.which === 13) {
        onSignIn();
      }
    },
    [onSignIn]
  );

  return (
    <div className='signInWrapper'>
        <div className="SignInForm">
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="login"
                label="Логин"
                name="login"
                autoComplete="login"
                autoFocus
                value={name}
                onChange={onNameChange}
                onKeyPress={onKeyPress}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onPasswordChange}
                onKeyDown={onKeyPress}
            />
            {authFailMessage && <div className="error">{authFailMessage}</div>}
            <Button
                style={{marginTop: 10}}
                type="submit"
                variant="contained"
                color="primary"
                onClick={onSignIn}
            >
                Войти
            </Button>
        </div>
    </div>
  );
};

const mapStateToProps = (store: AppState) => {
  return {
    authFailMessage: store.authFailMessage,
  };
};

const mapDispatchToProps = () => {
  return {
    setCurrentMenuItem: (nextMenuItem: SideMenuType) => {
      store.dispatch({
        type: StateChangeActionType.SET_CURRENT_MENU_ITEM,
        payload: nextMenuItem,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
