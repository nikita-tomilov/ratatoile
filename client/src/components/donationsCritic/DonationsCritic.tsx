import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./DonationsCritic.css";
import { DataTable } from "../tableForData/DataTable";
import {
  createCriticDonationRequest,
  deleteCriticDonationRequest,
  getAllCriticDonationsRequest,
} from "../../api/donations";
import { RowData, Scheme } from "../tableForData/types";
import { getScheme } from "./donationsCriticConfig";
import { Button } from "@material-ui/core";
import { AddDonationPopup } from "./AddDonationPopup";

const DonationsCritic = (): JSX.Element => {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [data, setData] = useState<RowData[] | null>(null);
  const [isAssPanelOpened, setAddPanelOpened] = useState<boolean>(false);

  const onDelete = useCallback((event) => {
    deleteCriticDonationRequest(event.currentTarget.value).then(() =>
      setData(null)
    );
  }, []);

  useEffect(() => {
    setScheme(getScheme({ onDelete }));
  }, [onDelete]);

  useEffect(() => {
    if (data === null) {
      getAllCriticDonationsRequest().then(
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
    createCriticDonationRequest({
      amount: data.price,
      criticName: data.name,
      reason: data.dish,
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
      title={"Добровольное пожертвование независимому эксперту"}
      isInspector={false}
    />
  ) : (
    <div className="donationsCriticWrapper">
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

export default connect()(DonationsCritic);
