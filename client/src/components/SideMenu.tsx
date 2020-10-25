import React, {useCallback, useMemo} from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {lastMenuItem} from "./auth/authService";
import {SideMenuType} from "../types";
import {AppRole} from "../api/user";

export const getSavedLastMenuItem = async (): Promise<SideMenuType> => {
  const store = await localStorage.getItem(lastMenuItem);
  if(store){
    for(let i = 0; i < Object.entries(SideMenuType).length; i++){
      if(Object.entries(SideMenuType)[i][0].toString() == store)
        return Object.values(SideMenuType)[i] as SideMenuType;
    }
  }

  return SideMenuType.LOGOUT;
}

export const order = {
  [SideMenuType.RESERVATIONS.toString()]: 0,
  [SideMenuType.ALL_TABLES.toString()]: 1,
  [SideMenuType.TABLE.toString()]: 2,
  [SideMenuType.KITCHEN_WAITER.toString()]: 3,
  [SideMenuType.KITCHEN.toString()]: 4,
  [SideMenuType.WAREHOUSE.toString()]: 5,
  [SideMenuType.DISH_LIST.toString()]: 6,
  [SideMenuType.MENU.toString()]: 7,
  [SideMenuType.CARD.toString()]: 8,
  [SideMenuType.DONATIONS_INSPECTOR.toString()]: 9,
  [SideMenuType.DONATIONS_CRITIC.toString()]: 10,
  [SideMenuType.LOGOUT.toString()]: 11,
}

export const sideMenuMapDefault = {
  [SideMenuType.LOGOUT]: "Выйти из системы",
};

export const sideMenuMapForWaiter = {
  [SideMenuType.ALL_TABLES]: "Общий зал",
  [SideMenuType.TABLE]: "Столик",
  [SideMenuType.KITCHEN_WAITER]: "Кухня официант",
  [SideMenuType.RESERVATIONS]: "Бронирования",
  [SideMenuType.CARD]: "Карта постоянного покупателя",
};

export const sideMenuMapForManager = {
  [SideMenuType.ALL_TABLES]: "Общий зал",
  [SideMenuType.TABLE]: "Столик",
  [SideMenuType.KITCHEN]: "Кухня",
  [SideMenuType.RESERVATIONS]: "Бронирования",
  [SideMenuType.DONATIONS_INSPECTOR]: "Пожертвования СЭС",
  [SideMenuType.MENU]: "Меню",
  [SideMenuType.CARD]: "Карта постоянного покупателя",
};

export const sideMenuMapForCook = {
  [SideMenuType.KITCHEN]: "Кухня",
  [SideMenuType.WAREHOUSE]: "Склад",
};

export const sideMenuMapForChef = {
  [SideMenuType.KITCHEN]: "Кухня",
  [SideMenuType.WAREHOUSE]: "Склад",
  [SideMenuType.DONATIONS_CRITIC]: "Пожертвования Критик",
  [SideMenuType.DISH_LIST]: "Список блюд",
};

const mapRoleToSideMenuOptionsMap = {
  [AppRole.WAITER]: sideMenuMapForWaiter,
  [AppRole.CHEF]: sideMenuMapForChef,
  [AppRole.COOK]: sideMenuMapForCook,
  [AppRole.MANAGER]: sideMenuMapForManager
}

export const SideMenu = (props: {
  onSelect: (selected: SideMenuType) => void;
  selected: SideMenuType;
  roles: AppRole[];
}): JSX.Element => {
  const { onSelect, selected, roles } = props;

  const onMenuItemSelect = useCallback(
    (event, value) => {
      if (value) onSelect(value);
    },
    [onSelect]
  );

  const menuItems = useMemo(() => {
    const menuOpts = roles.reduce((prev, role) => {
      return {...prev, ...mapRoleToSideMenuOptionsMap[role]};
    }, sideMenuMapDefault);

    return Object.entries(menuOpts).sort((a, b) => order[a[0]] < order[b[0]] ? -1 : 1)
        .map((entry) => {
      return <Tab key={entry[0]} label={(entry[1] as string)} value={entry[0]} />;
    });
  }, [roles]);

  return (
      <Tabs
          value={selected}
          onChange={onMenuItemSelect}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="on"
          textColor="primary"
          style={{ maxWidth: '100%' }}
      >
        {menuItems}
      </Tabs>
  );
};
