import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Reservations.css";
import { Button } from "@material-ui/core";
import { DataTable } from "../tableForData/DataTable";
import {
  acceptReservationRequest,
  deleteReservationRequest,
  getAllReservationRequest,
} from "../../api/reservations";
import { RowData, Scheme } from "../tableForData/types";
import { getScheme } from "./reservationsConfig";

const Reservations = (): JSX.Element => {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [data, setData] = useState<RowData[] | null>(null);

  const onAccept = useCallback((event) => {
    acceptReservationRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);
  const onDelete = useCallback((event) => {
    deleteReservationRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);

  useEffect(() => {
    setScheme(getScheme({ onDelete, onAccept }));
  }, [onDelete, onAccept]);

  useEffect(() => {
    if (data === null) {
      getAllReservationRequest().then(
        (receivedData) =>
          receivedData &&
          setData(
            receivedData.requests.map((el) => {
              return {
                ...el,
                time: {
                  from: el.from,
                  to: el.to,
                },
              };
            })
          )
      );
    }
  }, [data]);
  return (
    <div className="reservationsWrapper">
      <div className="header panelTitle">Бронирования</div>
      <div className="tableWrapper">
        {scheme && <DataTable scheme={scheme} data={data} />}
      </div>
      <div className="btnWrapper">
        <Button variant="contained" color="primary" onClick={() => {}}>
          ОК
        </Button>
      </div>
    </div>
  );
};

export default connect()(Reservations);
