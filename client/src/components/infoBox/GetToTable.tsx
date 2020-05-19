import React, { useCallback } from "react";
import { Button } from "@material-ui/core";
import { SideMenuType } from "../SideMenu";
import store from "../../store/store";
import { StateChangeActionType } from "../../store/actions";
import { connect } from "react-redux";

const GetToTable = (props: {
  setCurrentMenuItem: (menuItem: SideMenuType) => void;
}): JSX.Element => {
  const { setCurrentMenuItem } = props;
  const switchToTableWindow = useCallback(
    () => setCurrentMenuItem(SideMenuType.TABLE),
    [setCurrentMenuItem]
  );

  return (
    <Button variant="contained" color="primary" onClick={switchToTableWindow}>
      Открыть столик
    </Button>
  );
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

export default connect(null, mapDispatchToProps)(GetToTable);
