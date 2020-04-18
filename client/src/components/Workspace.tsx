import React from "react";
import "./Workspace.css";
import Button from "@material-ui/core/Button";
import { getAuthService } from "../services/authService";
import { SideMenu, SideMenuType } from "./SideMenu";
import { connect } from "react-redux";
import store, { AppState } from "../store/store";
import { StateChangeActionType } from "../store/actions";
const authService = getAuthService();

type Props = {
  currentMenuItem: SideMenuType;
  setCurrentMenuItem: (nextMenuItem: SideMenuType) => void;
};

export class Workspace extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { currentMenuItem, setCurrentMenuItem } = this.props;
    return (
      <div className="wrapper">
        <SideMenu onSelect={setCurrentMenuItem} selected={currentMenuItem} />
        <div className="container">
          {currentMenuItem === SideMenuType.FIRST ? (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={authService.logout}
            >
              Logout
            </Button>
          ) : currentMenuItem === SideMenuType.SECOND ? (
            "2"
          ) : (
            "3"
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: AppState) => {
  return {
    currentMenuItem: store.currentMenuItem,
  };
};

const mapDispatchToProps = () => {
  return {
    setCurrentMenuItem: (nextMenuItem: SideMenuType) =>
    {
        store.dispatch({
            type: StateChangeActionType.SET_CURRENT_MENU_ITEM,
            payload: nextMenuItem,
        })
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
