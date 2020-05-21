import React, { useCallback, useState } from "react";
import "./SignIn.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { getAuthService } from "./authService";
import store, { AppState } from "../../store/store";
import { SideMenuType } from "../SideMenu";
import { StateChangeActionType } from "../../store/actions";

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
    setCurrentMenuItem(SideMenuType.COMMON);
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
    <div className="SignInForm">
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="login"
        label="Login"
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
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={onPasswordChange}
        onKeyDown={onKeyPress}
      />
      {authFailMessage && <div className="error">{authFailMessage}</div>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={onSignIn}
      >
        Sign In
      </Button>
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
