import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Reservations.css";
import { DataTable } from "../tableForData/DataTable";
import { getAllReservations} from "../../api/reservations";
import { RowData, Scheme } from "../tableForData/types";
import { getScheme } from "./reservationsConfig";
import {setUpAnIntervalPollingOfFunction} from "../utils";
import {deleteReservation} from "../../api/tables";


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

const Reservations = (): JSX.Element => {
  const [data, setData] = useState<RowData[] | null>(null);
  const [scheme, setScheme] = useState<Scheme | null>(null);

  const onDelete = useCallback((event) => {
        if(window.confirm("Вы уверены, что хотите удалить бронирование?"))
            deleteReservation(event.currentTarget.value).then(() => setData(null));
  }, []);

  const updateData = useCallback(() => {
      getAllReservations().then(
          (receivedData) =>
              receivedData && setData(receivedData.reservations.map(saveNewData) )
      );
    }, []);

  useEffect(() => {
    setScheme(getScheme({ onDelete, forAccept: false }));
  }, []);

  useEffect(() => setUpAnIntervalPollingOfFunction(updateData), []);

  return (
    <div className="reservationsWrapper">
      <div className="header panelTitle">Бронирования</div>
      <div className="tableWrapper">
        {scheme && <DataTable scheme={scheme} data={data} />}
      </div>
    </div>
  );
};

export default connect()(Reservations);
