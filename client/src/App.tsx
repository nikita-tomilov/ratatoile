import React from "react";
import "./App.css";
import SignIn from "./components/auth/SignIn";
import Workspace from "./components/Workspace";
import { connect } from "react-redux";
import {AppState} from "./types";

// Here you can change the time between to requests for the data
export const fetchDataTimer = 3000;

function App(props: { token: string | null }) {
  return <div className="App">{props.token ? <Workspace /> : <SignIn />}</div>;
}

const mapStateToProps = (store: AppState) => {
  return {
    token: store.userToken,
  };
};

export default connect(mapStateToProps)(App);
