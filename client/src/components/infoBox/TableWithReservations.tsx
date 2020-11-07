import React, { useCallback, useState } from "react";
import { TableData } from "../../api/types";
import Button from "@material-ui/core/Button";
import { deleteReservation, startCatering } from "../../api/tables";
import { AddGuests } from "./AddGuests";

export const TableWithReservations = (props: {
  tableData: TableData;
  isManager: boolean;
  onClose: () => void;
}): JSX.Element => {
  const [reservationSelected, setReservationSelected] = useState(
    null as number | null
  );
  const { tableData, isManager, onClose } = props;
  const onDelete = useCallback(
    (event) => {
      if(window.confirm("Вы уверены, что хотите удалить резерв со столика?"))
        deleteReservation(event.currentTarget.value).then(onClose)
    },
    [onClose]
  );
  const onStart = useCallback(
    (guestCount: number) => {
      reservationSelected &&
        startCatering(reservationSelected, guestCount).then(onClose);
    },
    [reservationSelected, onClose]
  );
  const onStartBtnPressed = useCallback((event) => {
    setReservationSelected(event.currentTarget.value);
  }, []);
  return reservationSelected ? (
    <AddGuests
      tableId={tableData.id}
      maxGuestCount={tableData.maxSeats}
      onClose={onClose}
      onStart={onStart}
    />
  ) : (
    <div className="tableWithReservationsWrapper">
      <div className="smallTitle">Ближайшие резервирования</div>
      {tableData.closestReservations.map((reservation: any, index: number) => {
        return (
          <div className="reservation">
            <div>{`${index + 1}) ${new Date(
              reservation.from
            ).toLocaleString()} - ${new Date(
              reservation.to
            ).toLocaleString()}`}</div>
            <div className="btnWrapper">
              <Button
                disabled={!isManager}
                type="submit"
                variant="outlined"
                color="secondary"
                onClick={onDelete}
                value={reservation.id}
              >
                Удалить
              </Button>
            </div>
            <div className="btnWrapper">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={onStartBtnPressed}
                value={reservation.id}
              >
                Начать
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
