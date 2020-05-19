import React from "react";
import "./Workspace.css";
import { SideMenu, SideMenuType } from "./SideMenu";
import { connect } from "react-redux";
import store, { AppState } from "../store/store";
import { StateChangeActionType } from "../store/actions";
import { Logout } from "./auth/Logout";
import Tables from "./tables/Tables";
import SingleTable from "./singleTable/SingleTable";
import Reservations from "./reservation/Reservations";
import { getUserService } from "../services/userService";

type Props = {
  currentMenuItem: SideMenuType;
  isAdmin: boolean | null;
  setCurrentMenuItem: (nextMenuItem: SideMenuType) => void;
  setAdmin: (isAdmin: boolean) => void;
};
const userService = getUserService();

export class Workspace extends React.PureComponent<Props> {
  componentDidMount() {
    userService.hasAdminRole().then((isAdmin) => this.props.setAdmin(isAdmin));
  }

  render(): React.ReactNode {
    const { currentMenuItem, setCurrentMenuItem, isAdmin } = this.props;
    return (
      <div className="wrapper">
        <SideMenu
          isAdmin={isAdmin}
          onSelect={setCurrentMenuItem}
          selected={currentMenuItem}
        />
        <div className="container">
          {currentMenuItem === SideMenuType.COMMON ? <Tables /> : null}
          {currentMenuItem === SideMenuType.TABLE ? <SingleTable /> : null}
          {currentMenuItem === SideMenuType.RESERVATIONS && isAdmin ? (
            <Reservations />
          ) : null}
          {currentMenuItem === SideMenuType.LOGOUT ? (
            <Logout
              isAdmin={isAdmin || false}
              userName={userService.username || ""}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: AppState) => {
  return {
    currentMenuItem: store.currentMenuItem,
    isAdmin: store.isAdmin,
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
    setAdmin: (isAdmin: boolean) => {
      store.dispatch({
        type: StateChangeActionType.SET_ADMIN_ROLE,
        payload: isAdmin,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
