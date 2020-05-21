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
import { Warehouse } from "./warehouse/Warehouse";
import { DishList } from "./dishes/DishList";
import DonationsCritic from "./donationsCritic/DonationsCritic";
import DonationsInspector from "./donationsInspector/DonationsInspector";
import { Menu } from "./menu/Menu";
import { Button } from "@material-ui/core";

type Props = {
  currentMenuItem: SideMenuType;
  isAdmin: boolean | null;
  setCurrentMenuItem: (nextMenuItem: SideMenuType) => void;
  setAdmin: (isAdmin: boolean) => void;
};
const userService = getUserService();

export class Workspace extends React.PureComponent<Props> {
  message: string | null = null;

  componentDidMount() {
    userService.hasAdminRole().then((isAdmin) => this.props.setAdmin(isAdmin));
  }

  showNotification = (message: string): void => {
    this.message = message;
    this.forceUpdate();
  };

  closeNotification = (): void => {
    this.message = null;
    this.forceUpdate();
  };

  render(): React.ReactNode {
    const { currentMenuItem, setCurrentMenuItem, isAdmin } = this.props;
    return (
      <div className="wrapper">
        <SideMenu
          isAdmin={isAdmin}
          onSelect={setCurrentMenuItem}
          selected={currentMenuItem}
        />
        <div className={`container ${this.message ? "overlay" : ""}`}>
          {currentMenuItem === SideMenuType.COMMON ? <Tables /> : null}
          {currentMenuItem === SideMenuType.TABLE ? <SingleTable /> : null}
          {currentMenuItem === SideMenuType.LOGOUT ? (
            <Logout
              isAdmin={isAdmin || false}
              userName={userService.username || ""}
            />
          ) : null}

          {currentMenuItem === SideMenuType.RESERVATIONS && isAdmin ? (
            <Reservations />
          ) : null}
          {currentMenuItem === SideMenuType.WAREHOUSE && isAdmin ? (
            <Warehouse />
          ) : null}
          {currentMenuItem === SideMenuType.DISH_LIST && isAdmin ? (
            <DishList showNotification={this.showNotification} />
          ) : null}
          {currentMenuItem === SideMenuType.MENU && isAdmin ? <Menu /> : null}
          {currentMenuItem === SideMenuType.DONATIONS_CRITIC && isAdmin ? (
            <DonationsCritic />
          ) : null}
          {currentMenuItem === SideMenuType.DONATIONS_INSPECTOR && isAdmin ? (
            <DonationsInspector />
          ) : null}
        </div>
        {this.message && (
          <div className="messageBox">
            <div className="popupTitle">ОШИБКА</div>
            <div className="message">{this.message}</div>
            <Button
              variant="contained"
              color="primary"
              style={{ width: 30 }}
              onClick={this.closeNotification}
            >
              ОК
            </Button>
          </div>
        )}
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
