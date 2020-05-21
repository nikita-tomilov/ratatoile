import React, { useCallback, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import "./Controls.css";
import { addGuests } from "../../api/tables";

export const checkIsNumber = (value: any): boolean => {
  if (value.length === 0) return true;
  else {
    const result = Number(value);
    return !isNaN(result);
  }
};

export const AddGuests = (props: {
  tableId: number;
  maxGuestCount: number;
  onClose: () => void;
  onStart?: (guestCount: number) => void;
}): JSX.Element => {
  const { tableId, maxGuestCount, onClose, onStart } = props;
  const [guestCount, setGuestCount] = useState<number>(0);
  const onGuestCountFieldChange = useCallback(
    (event) =>
      checkIsNumber(event.target.value) &&
      setGuestCount(Number(event.target.value)),
    []
  );

  const clickHandler = useCallback(() => {
    if (guestCount && guestCount > 0 && guestCount <= maxGuestCount) {
      onStart
        ? onStart(guestCount)
        : addGuests(tableId, Math.floor(guestCount)).then(onClose);
    }
  }, [guestCount, tableId, onClose, maxGuestCount, onStart]);

  return (
    <div className="controlWrapper">
      <TextField
        id="standard-basic"
        label="Число гостей"
        value={guestCount}
        onChange={onGuestCountFieldChange}
        error={(guestCount || 0) > props.maxGuestCount}
        helperText={
          (guestCount || 0) > props.maxGuestCount
            ? "Число гостей ограничено " + props.maxGuestCount
            : ""
        }
        required
      />
      <div className="btnWrapper">
        <Button
          disabled={(guestCount || 0) > props.maxGuestCount}
          variant="contained"
          color="primary"
          onClick={clickHandler}
        >
          Посадить гостей
        </Button>
      </div>
    </div>
  );
};
