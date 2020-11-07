import React from "react";
import "./App.css";
import SignIn from "./components/auth/LogIn";
import Workspace from "./components/Workspace";
import { connect } from "react-redux";
import {AppState} from "./types";

function App(props: { token: string | null }) {
  return <div className="App">{ props.token
      ? <Workspace />
      : <div className='signFormWrapper'><SignIn /></div>
  }</div>;
}

const mapStateToProps = (store: AppState) => {
  return {
    token: store.userToken,
  };
};

export default connect(mapStateToProps)(App);
