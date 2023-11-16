import React from "react";
import { Route, withRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard/";
import DashboardNew from "../Pages/DashboardNew";
import DocumentDetails from "../Pages/DocumentDetails/";
import DocumentUpload from "../Pages/DocumentUpload/";
import CaseHistory from "../Pages/DocumentUpload/CaseHistory";
import RepaymentDetails from "../Pages/RepaymentDetails/";
import CaseDetailsTwin2 from "../Pages/CaseDetailsTwin2";
import CaseHistoryTwin2 from "../Pages/CaseDetailsTwin2/CaseHistoryTwin2";
import DisbursmentDetailsTwin2 from "../Pages/DisbursmentDetailsTwin2/";
import RepaymentDetailsTwin2 from "../Pages/RepaymentDetailsTwin2";
import DetailedCaseListing from "./../Pages/Dashboard/DetailedCaseListing";
import PaymentListing from "../Pages/Dashboard/PaymentListing";
import PaymentListingTwin2 from "../Pages/CaseDetailsTwin2/PaymentListingTwin2";
import DashboardPremiumDealer from "../Pages/DashboardPremiumDealer";

const Abc = (props) => {
  if (localStorage.getItem("dtoken")) {
    window.location = `/disbursement/dashboard/`;
  }
  let tokenStr = props.location.search.split("search=")[1];
  let token = tokenStr.split("&")[0];

  let empIdStr = props.location.search.split("empId=")[1];
  let empId = empIdStr.split("&")[0];

  let roleId = props.location.search.split("roleId=")[1];

  let branchStr = props.location.search.split("branch=")[1];
  let branchName = branchStr.split("&")[0];

  localStorage.setItem("disbstoken", token);
  localStorage.setItem("empId", empId);
  localStorage.setItem("branchName", branchName);

  localStorage.setItem("roleId", roleId);
  window.location = `/disbursement/dashboard`;
  return <div></div>;
};

function index() {
  return (
    <React.Fragment>
      <Route exact path={"/disbursement/dashboard"} component={Dashboard} />
      <Route exact path={"/documents-upload/:id"} component={DocumentUpload} />
      <Route exact path={"/case-history/:id"} component={CaseHistory} />
      <Route exact path={"/document-details/:id"} component={DocumentDetails} />
      <Route
        exact
        path={"/repayment-details/:id"}
        component={RepaymentDetails}
      />
      <Route exact path={"/caseListing"} component={DetailedCaseListing} />
      {/*<Route exact path={"/case-report/:id"} component={CaseReports} /> */}
      <Route exact path={"/disbs/token"} component={Abc} />
      <Route exact path={"/dashboardTwin2"} component={DashboardNew} />
      <Route
        exact
        path={"/case-detailsTwin2/:id"}
        component={CaseDetailsTwin2}
      />
      {/* <Route
        exact
        path={"/case-detailsTwin2/paymentStatus/:id/:appId"}
        component={CaseDetailsTwin2}
      /> */}
      <Route
        exact
        path={"/case-historyTwin2/:id"}
        component={CaseHistoryTwin2}
      />
      <Route
        exact
        path={"/document-detailsTwin2/:id"}
        component={DocumentDetails}
      />
      <Route
        exact
        path={"/disbursment-detailsTwin2/:id"}
        component={DisbursmentDetailsTwin2}
      />
      <Route
        exact
        path={"/repayment-detailsTwin2/:id"}
        component={RepaymentDetailsTwin2}
      />
      <Route exact path={"/paymentStatus"} component={PaymentListing} />
      <Route
        exact
        path={"/paymentStatusTwin2"}
        component={PaymentListingTwin2}
      />
      <Route
        exact
        path={"/dashboardPremiumDealer"}
        component={DashboardPremiumDealer}
      />
    </React.Fragment>
  );
}

export default withRouter(index);
