import React, { useCallback } from "react";
import { Button } from "@material-ui/core";

export const StartCatering = (): JSX.Element => {
  const onSubmit = useCallback(() => console.warn("sit"), []);

  return (
    <Button variant="contained" color="primary" onSubmit={onSubmit}>
      Начать обслуживание
    </Button>
  );
};
