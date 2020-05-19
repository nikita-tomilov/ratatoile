import React, { useCallback, useMemo } from "react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export enum SideMenuType {
  COMMON = "COMMON",
  TABLE = "TABLE",
  RESERVATIONS = "RESERVATIONS",
  LOGOUT = "LOGOUT",
}

export const sideMenuMapForUser = {
  [SideMenuType.COMMON]: "Общий зал",
  [SideMenuType.TABLE]: "Столик",
  [SideMenuType.LOGOUT]: "Выйти из системы",
};

export const sideMenuMapForAdmin = {
  [SideMenuType.RESERVATIONS]: "Бронирования",
  ...sideMenuMapForUser,
};

const StyledTabs = withStyles({
  root: {
    width: "100%",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const StyledTab = withStyles({
  root: { flex: 1 },
})(Tab);

export const SideMenu = (props: {
  onSelect: (selected: SideMenuType) => void;
  selected: SideMenuType;
  isAdmin: boolean | null;
}): JSX.Element => {
  const { onSelect, selected, isAdmin } = props;

  const onMenuItemSelect = useCallback(
    (event, value) => {
      if (value) onSelect(value);
    },
    [onSelect]
  );

  const menuItems = useMemo(() => {
    return Object.entries(
      isAdmin ? sideMenuMapForAdmin : sideMenuMapForUser
    ).map((entry) => {
      return <StyledTab key={entry[0]} label={entry[1]} value={entry[0]} />;
    });
  }, [isAdmin]);

  return (
    <StyledTabs value={selected} onChange={onMenuItemSelect}>
      {menuItems}
    </StyledTabs>
  );
};
