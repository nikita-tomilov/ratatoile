import React, {useCallback, useMemo} from "react";
import Button from "@material-ui/core/Button";
import "./InfoBox.css";
import config from "./tablesInfoMap.json";
import { InfoBoxProps, SimpleObjectType, TableConfig } from "./types";
import { calculateTooltipPosition, getInfoItemBody } from "./utils";
import { TableData, TableState } from "../../api/types";
import { AddGuests } from "./AddGuests";
import { StartCatering } from "./StartCatering";
import GetToTable from "./GetToTable";
import { TableWithReservations } from "./TableWithReservations";

const getControls = (
  tableData: TableData,
  onClose: () => void,
  isManager: boolean,
  setTheTable: () => void
): JSX.Element | null => {
  return tableData.state === TableState.FREE ? (
    <AddGuests
      onClose={onClose}
      tableId={tableData.id}
      maxGuestCount={tableData.maxSeats}
    />
  ) : tableData.state === TableState.SUPPOSED_TO_BE_BUSY ? (
    <StartCatering />
  ) : tableData.state === TableState.BUSY_BY_YOU ? (
    <GetToTable setTheTable={setTheTable}/>
  ) : (
    <TableWithReservations
      onClose={onClose}
      isManager={isManager}
      tableData={tableData}
    />
  );
};

export const InfoBox = (props: InfoBoxProps): JSX.Element => {
  const { selected, onClose, isManager, setLastSelectedTable } = props;
  const { state, guiY, guiX, guiH, guiW, id } = selected;
  const tableConfig = useMemo(
    () => (config.info as SimpleObjectType)[state.toLowerCase()],
    [state]
  );

  const infoItems: { title: string; body: string | string[] }[] = useMemo(
    () =>
      tableConfig.map((item: TableConfig) => getInfoItemBody(item, selected)),
    [tableConfig, selected]
  );

  const setTheTable = useCallback(() => {
    if (selected.state === TableState.BUSY_BY_YOU)
      setLastSelectedTable(selected.id);
  } , [selected]);

  const controlsItems = useMemo(() => getControls(selected, onClose, isManager, setTheTable), [
    selected,
    onClose,
    isManager,
  ]);

  const coords = useMemo(() => {
    return calculateTooltipPosition(guiX, guiY, guiH, guiW);
  }, [guiY, guiX, guiH, guiW]);

  return (
    <div className="boxWrapper" style={coords}>
      <div className="title">Столик #{id}</div>
      <div className="info">
        {infoItems.map(({ title, body }, index) => {
          return (
            <div className={"item"} key={index}>
              <div className={"itemTitle"}>{title}</div>
              <div className={"itemBody"}>{body}</div>
            </div>
          );
        })}
      </div>
      <div
        className={
          state === TableState.FREE || state === TableState.FREE_BUT_BOOKED
            ? "controlsVertical"
            : "controlsHorizontal"
        }
      >
        {controlsItems}
        <div className="btnWrapper">
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            onClick={onClose}
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};
