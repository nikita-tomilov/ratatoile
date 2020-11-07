import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Reservations.css";
import { DataTable } from "../tableForData/DataTable";
import {
    acceptReservationRequest,
    deleteReservationRequest,
    getAllReservationRequest, getAllReservations,
} from "../../api/reservations";
import { RowData, Scheme } from "../tableForData/types";
import { getScheme } from "./reservationsConfig";
import {setUpAnIntervalPollingOfFunction} from "../utils";


const saveNewData = (el: RowData) => {
    return {
        ...el,
        name: el['personName'],
        phone: el['personPhone'],
        tableCandidateId: el['assignedTableId'],
        time: {
            from: el.from,
            to: el.to,
        },
    };
};

const Reservations = (props: {forAccept?: boolean}): JSX.Element => {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [data, setData] = useState<RowData[] | null>(null);

  const onAccept = useCallback((event) => {
    acceptReservationRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);
  const onDelete = useCallback((event) => {
      if(window.confirm("Вы уверены, что хотите удалить запрос на бронирование?"))
          deleteReservationRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);

  const updateData = useCallback(() => {
      if(props.forAccept) {
          getAllReservationRequest().then(
              (receivedData) =>
                  receivedData && setData(receivedData.requests
                      .map((el: RowData) => {
                          return {
                              ...el,
                              time: {
                                  from: el.from,
                                  to: el.to,
                              },
                          };
                  }))
          );
      } else {
          getAllReservations().then(
              (receivedData) =>
                  receivedData && setData(receivedData.reservations.map(saveNewData))
          );
      }
    }, [props.forAccept]);

  useEffect(() => {
    setScheme(getScheme({ onDelete, onAccept, forAccept: props.forAccept }));
  }, [onDelete, onAccept, props.forAccept]);

  useEffect(() => setUpAnIntervalPollingOfFunction(updateData), [props.forAccept]);

  return (
    <div className="reservationsWrapper">
      <div className="header panelTitle">Запросы бронирования</div>
      <div className="tableWrapper">
        {scheme && <DataTable scheme={scheme} data={data} />}
      </div>
    </div>
  );
};

export default connect()(Reservations);
