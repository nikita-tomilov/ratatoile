import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./DonationsInspector.css";
import { DataTable } from "../tableForData/DataTable";
import {
  createInspectorDonationRequest,
  deleteInspectorDonationRequest,
  getAllInspectorDonationsRequest,
} from "../../api/donations";
import { RowData, Scheme } from "../tableForData/types";
import { getScheme } from "./donationsInspectorConfig";
import { Button } from "@material-ui/core";
import { AddDonationPopup } from "../donationsCritic/AddDonationPopup";

const DonationsInspector = (): JSX.Element => {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [data, setData] = useState<RowData[] | null>(null);
  const [isAssPanelOpened, setAddPanelOpened] = useState<boolean>(false);

  const onDelete = useCallback((event) => {
    if(window.confirm("Вы уверены, что хотите удалить запись о пожертвовании?"))
      deleteInspectorDonationRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);

  useEffect(() => {
    setScheme(getScheme({ onDelete }));
  }, [onDelete]);

  useEffect(() => {
    if (data === null) {
      getAllInspectorDonationsRequest().then(
        (receivedData) =>
          receivedData &&
          setData(
            receivedData.donations.map((el) => {
              return {
                ...el,
              };
            })
          )
      );
    }
  }, [data]);

  const onSubmit = useCallback((ev) => {
    const data = JSON.parse(ev.currentTarget.value);
    createInspectorDonationRequest({
      amount: data.price,
      reason: data.mention,
      date: Date.now(),
    }).then(() => {
      setData(null);
      setAddPanelOpened(false);
    });
  }, []);
  return isAssPanelOpened ? (
    <AddDonationPopup
      onCancel={() => setAddPanelOpened(false)}
      onSubmit={onSubmit}
      title={"Взнос в фонд помощи пострадавшим при дезинсекциях"}
      isInspector={true}
    />
  ) : (
    <div className="donationsInspectorWrapper">
      <div className="header">
        <div className="panelTitle">Пожертвования</div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddPanelOpened(true)}
        >
          Добавить новый
        </Button>
      </div>
      <div className="tableWrapper">
        {scheme && <DataTable scheme={scheme} data={data} />}
      </div>
    </div>
  );
};

export default connect()(DonationsInspector);
