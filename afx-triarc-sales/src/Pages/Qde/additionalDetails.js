import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  addAlternateContactDetails,
  createCustomer,
  getResidentTypes,
} from "../../Redux/Services/Qde";

import { te, ti } from "../../Utility/ReduxToaster";
import { public_url } from "./../../Utility/Constant";
import DetailsAlternate from "./AdditionalDetails/DetailsAlternate";
import DetailsEmployee from "./AdditionalDetails/DetailsEmployee";
import DetailsOffice from "./AdditionalDetails/DetailsOffice";
import DetailsPermanent from "./AdditionalDetails/DetailsPermanent";
import CurrentOfficeAddress from "./AdditionalDetails/CurrentOfficeAddress";
import POA from "./AdditionalDetails/POA";
import POI from "./AdditionalDetails/POI";

const { Panel } = Collapse;
function AdditionalDetails(props) {
  const [disabled, setDisabled] = useState(true);
  const [disabledCG, setDisabledCG] = useState(true);
  const [isOptional, setIsOptional] = useState(false);
  const [isRequired, setIsRequired] = useState(true);
  const [visiblePanels, setVisiblePanels] = useState(["1"]);
  const [KYCvisiblePanels, setKYCVisiblePanels] = useState(["1"]);
  const [flag, setFlag] = useState(false);
  const customerType =
    props.qde.getQdeSectionDetails &&
    props.qde.getQdeSectionDetails.data &&
    props.qde.getQdeSectionDetails.data.pangstdetails &&
    props.qde.getQdeSectionDetails.data.pangstdetails.customerType;

  const occupationType =
    props.qde.getQdeSectionDetails &&
    props.qde.getQdeSectionDetails.data &&
    props.qde.getQdeSectionDetails.data.pangstdetails &&
    props.qde.getQdeSectionDetails.data.pangstdetails.occupationType;

  const entity =
    props.qde.getQdeSectionDetails &&
    props.qde.getQdeSectionDetails.data &&
    props.qde.getQdeSectionDetails.data.pangstdetails &&
    props.qde.getQdeSectionDetails.data.pangstdetails.entity;

  const selfEmployedJourney =
    props.qde &&
    props.qde.getQdeSectionDetails &&
    props.qde.getQdeSectionDetails.data &&
    props.qde.getQdeSectionDetails.data.indSelfSoleFlag;

  console.log("entity-----------------", entity);

  const { getResidentTypes } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
    getResidentTypes();
  }, [getResidentTypes]);

  useEffect(() => {
    if (
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails &&
      (props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails
        .residenceType === "PG" ||
        props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails
          .residenceType === "Corporate Provided")
    ) {
      setIsOptional(true);
    } else {
      setIsOptional(false);
    }
  }, [props.qde.getQdeSectionDetails.data]);

  useEffect(() => {
    if (
      props.qde.addKYCSuccess &&
      props.qde.addUtilitySuccess &&
      props.qde.addEmployeeSuccess &&
      props.qde.addOfficeSuccess &&
      props.qde.addPermanentSuccess
    ) {
      setDisabled(false);
    } else {
      // console.log("Else1")
      setDisabled(true);
    }
    if (props.qde.addKYCSuccess) {
      setKYCVisiblePanels([2]);
    }
    if (props.qde.addUtilitySuccess) {
      setKYCVisiblePanels([]);
      setVisiblePanels([2]);
    }
    if (props.qde.addPermanentSuccess) {
      setVisiblePanels([3]);
    }
    if (props.qde.addEmployeeSuccess) {
      setVisiblePanels([4]);
    }
    if (props.qde.addOfficeSuccess) {
      setVisiblePanels([5]);
    }
  }, [
    isOptional,
    props.qde.addEmployeeSuccess,
    props.qde.addKYCSuccess,
    props.qde.addOfficeSuccess,
    props.qde.addPermanentSuccess,
    props.qde.addUtilitySuccess,
  ]);

  useEffect(() => {
    if (
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails
        .pinCode &&
      props.qde.getQdeSectionDetails.data.additionalDetails
            .permanentaddresDetails.pinCode
    ) {
      setDisabledCG(false);
    } else setDisabledCG(true);
  }, [isOptional, props.qde.getQdeSectionDetails]);

  //--------------------------------------------------------

  useEffect(() => {
    if (selfEmployedJourney) {
      // console.log("----if-----")
      if (
        props.qde &&
        props.qde.getQdeSectionDetails &&
        props.qde.getQdeSectionDetails.data &&
        props.qde.getQdeSectionDetails.data.additionalDetails &&
        props.qde.getQdeSectionDetails.data.additionalDetails
          .kycaddresDetails &&
        props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails
          .pinCode &&
        props.qde.getQdeSectionDetails.data.additionalDetails.alternateContact
          .mobileNo &&
        props.qde.getQdeSectionDetails.data.additionalDetails
          .currentOfficeAddresDetails &&
        props.qde.getQdeSectionDetails.data.additionalDetails
          .currentOfficeAddresDetails.pinCode
      ) {
        // console.log("selfEmployed: Next must be enabled");
        setDisabled(false);
      } else {
        // console.log("selfEmployed: Next must be disable");
        setDisabled(true);
      }
    } else {
      // console.log("----else-------")
      if (
        props.qde.getQdeSectionDetails &&
        props.qde.getQdeSectionDetails.data &&
        props.qde.getQdeSectionDetails.data.additionalDetails &&
        props.qde.getQdeSectionDetails.data.additionalDetails.employedetails &&
        props.qde.getQdeSectionDetails.data.additionalDetails.employedetails
          .company &&
        props.qde.getQdeSectionDetails.data.additionalDetails
          .kycaddresDetails &&
        props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails
          .pinCode &&
        props.qde.getQdeSectionDetails.data.additionalDetails
          .officeAddresDetails.pinCode &&
        props.qde.getQdeSectionDetails.data.additionalDetails.alternateContact
          .mobileNo &&
        props.qde.getQdeSectionDetails.data.additionalDetails
              .permanentaddresDetails.pinCode
      ) {
  
        setDisabled(false);
      } else {

        setDisabled(true);
      }
    }
  }, [
    isOptional,
    props.qde,
    props.qde.getQdeSectionDetails,
    selfEmployedJourney,
  ]);

  const handleSubmit = () => {

       props.changeStep(2);
  };
  const redirectLeadList = () => {
    props.history.push(
      `${public_url.leadLists}/${props.qde.getQdeSectionDetails.data.productId}`
    );
  };
  return (
    <div className="addDetails">
      <Collapse
        expandIconPosition="right"
        expandIcon={({ isActive }) =>
          isActive ? <MinusOutlined /> : <PlusOutlined />
        }
        defaultActiveKey={1}
        className="site-collapse-custom-collapse"
        onChange={(e) => setVisiblePanels(e)}
        activeKey={visiblePanels}>
        <Panel
          header={`${
            // customerType === "individual" ? "Residential" : "Registered"

            //----------------------------new------------------------------
            selfEmployedJourney ? "Registered" : "Residential"
            //----------------------------new------------------------------
          } ${props.journey === "applicant" ? "Address*" : "Address"}`}
          key={1}
          className="site-collapse-custom-panel">
          <Collapse
            expandIconPosition="right"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            defaultActiveKey={1}
            className="site-collapse-custom-collapse"
            activeKey={KYCvisiblePanels}
            onChange={(e) => setKYCVisiblePanels(e)}>
            <Panel
              header={
                props.journey === "applicant"
                  ? "Add KYC Document*"
                  : "Add KYC Document"
              }
              key="1"
              className="site-collapse-custom-panel">
              <POI
                history={props.hitory}
                match={props.match}
                freezeCase={props.freezeCase}
                freezeUser={props.freezeUser}
                selfEmployedJourney={selfEmployedJourney}
                entity={entity}
                bureauFreeze={props.bureauFreeze}
              />
            </Panel>

            <Panel
              header="Add Utility Bill"
              key="2"
              className="site-collapse-custom-panel">
              <POA
                history={props.hitory}
                match={props.match}
                freezeCase={props.freezeCase}
                freezeUser={props.freezeUser}
                selfEmployedJourney={selfEmployedJourney}
                bureauFreeze={props.bureauFreeze}
              />
            </Panel>
          </Collapse>
        </Panel>

        {selfEmployedJourney && (
          <Panel
            header={"Current Office Address*"}
            key={2}
            className="site-collapse-custom-panel">
            <CurrentOfficeAddress
              history={props.hitory}
              match={props.match}
              freezeCase={props.freezeCase}
              freezeUser={props.freezeUser}
              flag={flag}
              setFlag={setFlag}
              bureauFreeze={props.bureauFreeze}
            />
          </Panel>
        )}

        {!selfEmployedJourney && (
          <Panel
            header={ "Permanent Address*" }
            key={2}
            className="site-collapse-custom-panel">
            <DetailsPermanent
              history={props.hitory}
              match={props.match}
              freezeCase={props.freezeCase}
              freezeUser={props.freezeUser}
              bureauFreeze={props.bureauFreeze}
            />
          </Panel>
        )}


        {!selfEmployedJourney && (
          <Panel
            header={
              props.journey === "applicant"
                ? "Employment  Details*"
                : "Employment  Details"
            }
            key={3}
            className="site-collapse-custom-panel">
            <DetailsEmployee
              history={props.hitory}
              match={props.match}
              freezeCase={props.freezeCase}
              freezeUser={props.freezeUser}
              bureauFreeze={props.bureauFreeze}
            />
          </Panel>
        )}

        {!selfEmployedJourney && (
          <Panel
            header={
              props.journey === "applicant"
                ? "Office Address*"
                : "Office Address"
            }
            key={4}
            className="site-collapse-custom-panel">
            <DetailsOffice
              history={props.hitory}
              match={props.match}
              freezeCase={props.freezeCase}
              freezeUser={props.freezeUser}
              bureauFreeze={props.bureauFreeze}
            />
          </Panel>
        )}

        <Panel
          header={
            props.journey === "applicant"
              ? "Additional Contact Details*"
              : "Additional Contact Details"
          }
          key={5}
          className="site-collapse-custom-panel">
          <DetailsAlternate
            history={props.hitory}
            match={props.match}
            freezeCase={props.freezeCase}
            freezeUser={props.freezeUser}
            bureauFreeze={props.bureauFreeze}
          />
        </Panel>
      </Collapse>
      <br />
      <div className="alignButton">
        <Button
          className="save-button mr-2"
          onClick={() => {
            props.history.push(
              `${public_url.loanSummary}/${
                props.qde.getQdeSectionDetails &&
                props.qde.getQdeSectionDetails.data &&
                props.qde.getQdeSectionDetails.data.id
              }`
            );
          }}>
          Loan Summary
        </Button>{" "}
        &nbsp;
        <Button className="cancle-button mr-2" onClick={redirectLeadList}>
          Cancel
        </Button>
        &nbsp;
        {props.journey === "applicant" && (
          <Button
            className="save-button mr-3"
            disabled={disabled}
            onClick={() => {
              handleSubmit();
            }}>
            Next
          </Button>
        )}
        {(props.journey === "co-applicant" ||
          props.journey === "guarantor") && (
          <Button
            className="save-button mr-3"
            onClick={() => {
              handleSubmit();
            }}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { qde: state.qde };
};

const mapDispatchToProps = {
  addAlternateContactDetails,
  getResidentTypes,
  createCustomer,
};
export default connect(mapStateToProps, mapDispatchToProps)(AdditionalDetails);
