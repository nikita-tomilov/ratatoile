import React from "react";
import "./Workspace.css";
import {getSavedLastMenuItem, SideMenu} from "./SideMenu";
import {connect} from "react-redux";
import store from "../store/store";
import {StateChangeActionType} from "../store/actions";
import {Logout} from "./auth/Logout";
import Tables from "./tables/Tables";
import SingleTable from "./singleTable/SingleTable";
import Reservations from "./reservation/Reservations";
import {Warehouse} from "./warehouse/Warehouse";
import {DishList} from "./dishes/DishList";
import DonationsCritic from "./donationsCritic/DonationsCritic";
import DonationsInspector from "./donationsInspector/DonationsInspector";
import {Menu} from "./menu/Menu";
import {Button} from "@material-ui/core";
import {AppRole, getUserData} from "../api/user";
import {getAuthService} from "./auth/authService";
import {AppState, SideMenuType} from "../types";
import {Kitchen} from "./kitchen/Kitchen";
import {GuestCards} from "./guestCards/GuestCards";

type Props = {
  currentMenuItem: SideMenuType;
  roles: AppRole[];
  username: string | null;
  setCurrentMenuItem: (nextMenuItem: SideMenuType) => void;
  setUserData: (roles: AppRole[], userName: string) => void;
};

export class Workspace extends React.PureComponent<Props> {
  message: string | null = null;

  constructor(props: Props) {
    super(props);

    getSavedLastMenuItem()
        .then((value) => props.setCurrentMenuItem(value));
  }

  componentDidMount() {
    getUserData()
        .then((data) => {
          this.props.setUserData(data.roles, data.username);
        })
        .catch((_) => {
          getAuthService().logout();
        });
  }

  showNotification = (message: string): void => {
    this.message = message;
    this.forceUpdate();
  };

  closeNotification = (): void => {
    this.message = null;
    this.forceUpdate();
  };

  renderMainBody(): React.ReactNode {
    const {
      currentMenuItem,
      roles,
      username,
    } = this.props;
    switch (currentMenuItem) {
      case SideMenuType.TABLE:
        return <SingleTable />
      case SideMenuType.LOGOUT:
        return <Logout
            roles={roles}
            userName={username || ""}
        />;
      case SideMenuType.DISH_LIST:
        return <DishList showNotification={this.showNotification} />;
      case SideMenuType.DONATIONS_CRITIC:
        return <DonationsCritic />;
      case SideMenuType.DONATIONS_INSPECTOR:
        return <DonationsInspector />;
      case SideMenuType.MENU:
        return <Menu />;
      case SideMenuType.RESERVATIONS:
        return <Reservations />
      case SideMenuType.WAREHOUSE:
        return <Warehouse />;
      case SideMenuType.KITCHEN:
        return <Kitchen selectedRole={AppRole.CHEF}/>
      case SideMenuType.KITCHEN_WAITER:
        return <Kitchen selectedRole={AppRole.WAITER}/>
      case SideMenuType.CARD:
        return <GuestCards />
      default:
        return <Tables />;
    }
  }

  render(): React.ReactNode {
    const {
      currentMenuItem,
      setCurrentMenuItem,
      roles,
    } = this.props;
    return (
      <div className="wrapper">
        <SideMenu
          roles={roles}
          onSelect={setCurrentMenuItem}
          selected={currentMenuItem}
        />
        <div className={`container ${this.message ? "overlay" : ""}`}>
          {this.renderMainBody()}
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
    roles: store.roles,
    username: store.username,
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
    setUserData: (roles: AppRole[], userName: string) => {
      store.dispatch({
        type: StateChangeActionType.SET_ADMIN_ROLE,
        payload: {
          roles,
          userName,
        },
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
