import React from "react";
import Button from "@material-ui/core/Button";
import { getAuthService } from "../../services/authService";
const authService = getAuthService();

export const Logout = (): JSX.Element => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      onClick={authService.logout}
    >
      Logout
    </Button>
  );
};
