import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "react-table/react-table.css";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
/* import "./Assets/css/style.css"
import "./Assets/css/responsive.css" */

import { createHashHistory as createHistory } from "history";
// import { configureStore } from './store';
const history = createHistory();

ReactDOM.render(<App history={history}/>, document.getElementById("root")); 

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
