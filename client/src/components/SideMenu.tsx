import React, { useCallback } from "react";
import "./SideMenu.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export enum SideMenuType {
  TABLES = "TABLES",
  SECOND = "SECOND",
  LOGOUT = "LOGOUT",
}

export const SideMenu = (props: {
  onSelect: (selected: SideMenuType) => void;
  selected: SideMenuType;
}): JSX.Element => {
  const { onSelect, selected } = props;

  const onMenuItemSelect = useCallback(
    (event, value) => {
      if (value) onSelect(value);
    },
    [onSelect]
  );

  return (
    <div className="menu">
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selected}
        onChange={onMenuItemSelect}
      >
        {Object.values(SideMenuType).map((type) => {
          return <Tab key={type} label={type.toUpperCase()} value={type} />;
        })}
      </Tabs>
    </div>
  );
};
