import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import CaseSummary from "../Pages/CaseSummary/";
import CaseHistory from "../Pages/CaseSummary/CaseHistory";
import CaseReports from "../Pages/CaseSummary/CaseReports";
import Dashboard from "../Pages/Dashboard/";
import Deviation from "../Pages/Deviation/";
import FI from "../Pages/CaseSummary/FI";
import DetailedCaseListing from "./../Pages/Dashboard/DetailedCaseListing";

const Abc = (props) => {
  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        window.location = `/credit/dashboard`;
      }
      let tokenStr = props.location.search.split("search=")[1];
      let token = tokenStr.split("&")[0];

      let empIdStr = props.location.search.split("empId=")[1];
      let empId = empIdStr.split("&")[0];

      let branchName = props.location.search.split("branch=")[1];
      localStorage.setItem("token", token);
      localStorage.setItem("empId", empId);
      localStorage.setItem("branchName", branchName);
      window.location = `/credit/dashboard`;
    } catch (err) {}
    let tokenStr = props.location.search.split("search=")[1];
    let token = tokenStr.split("&")[0];

    let empIdStr = props.location.search.split("empId=")[1];
    let empId = empIdStr.split("&")[0];

    let branchStr = props.location.search.split("branch=")[1];
    let branchName = branchStr.split("&")[0];

    let roleId = props.location.search.split("roleId=")[1];

    localStorage.setItem("token", token);
    localStorage.setItem("empId", empId);
    localStorage.setItem("branchName", branchName);
    localStorage.setItem("roleId", roleId);
    window.location = `/credit/dashboard`;
  }, []);
  return <div></div>;
};

function index() {
  return (
    <React.Fragment>
      <Route exact path={"/case-summary/:id"} component={CaseSummary} />
      <Route exact path={"/credit/dashboard"} component={Dashboard} />
      <Route exact path={"/caseListing"} component={DetailedCaseListing} />
      <Route exact path={"/case-history/:id"} component={CaseHistory} />
      <Route exact path={"/deviation/:id"} component={Deviation} />
      <Route exact path={"/FI/:id"} component={FI} />
      <Route exact path={"/case-report/:id"} component={CaseReports} />
      <Route exact path={"/credit/token"} component={Abc} />
    </React.Fragment>
  );
}

export default withRouter(index);
