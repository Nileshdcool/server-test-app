import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import Label from "../../Components/label";
import { getCaseSummaryDetails } from "../../Redux/Services/documentUpload";
import Spin from "../../Components/Spin";

function BasicDetails(props) {
  const [resData, setResData] = useState([]);
  const [mainApp, setMainApp] = useState([]);
  const [coApp, setCoApp] = useState([]);
  const [guarantor, setGuarantor] = useState([]);
  const [losData, setLosData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [caseSummaryData, setCaseSummaryData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getCaseSummaryDetails({
        applicantUniqueId: props.match.params.id,
        roleId: parseInt(localStorage.getItem("roleId")),
      });
      setCaseSummaryData(response);
      setLoader(false);
    })();
  }, []);

  useEffect(() => {
    try {
      setLoader(true);
      const response = caseSummaryData;
      const data = [
        ...response?.coapplicant.map((e) => {
          e.isCoApplicant = true;
          return e;
        }),
        ...response?.gurantor.map((e) => {
          e.isGurantor = true;
          return e;
        }),
      ];
      const mainAppData = response?.mainapplicant[0];
      const coApp = response?.coapplicant;
      const guarantor = response?.gurantor;
      // const guarantor =
      const los = response?.losStatus;

      setResData(data);
      setMainApp(mainAppData);
      setLosData(los);
      setLoader(false);
      setGuarantor(guarantor);
      setCoApp(coApp);
    } catch (err) {
      setLoader(false);
    }
  }, [caseSummaryData]);

  const tabs = resData.map((item, index) => (
    <React.Fragment key={`basicDetails_${index}`}>
      {item.coSaveScheme ? (
        <Row>
          <Col lg={8}>
            <Label label="Customer Id" value={item.cif} />
          </Col>
          <Col lg={8}>
            <Label label="Co Applicant Name" value={item.customerName} />
          </Col>
          <Col lg={8}></Col>
        </Row>
      ) : null}
      {item.guaSaveScheme ? (
        <Row>
          <Col lg={8}>
            <Label label="Customer Id" value={item.cif} />
          </Col>
          <Col lg={8}>
            <Label label="Guarantor Name" value={item.customerName} />
          </Col>
          <Col lg={8}></Col>
        </Row>
      ) : null}
    </React.Fragment>
  ));

  return (
    <>
      <Spin spinning={loader}>
        <Row>
          <Col lg={8}>
            <Label label="LOS Application Id" value={mainApp?.id} />
          </Col>
          <Col lg={8}>
            <Label label="LOS Status" value={losData} />
          </Col>
          {mainApp?.scheme && (
            <Col lg={8}>
              <Label label="Scheme" value={mainApp?.schemeName} />
            </Col>
          )}
        </Row>
        <Row>
          {mainApp?.cif && (
            <Col lg={8}>
              <Label label="Customer Id" value={mainApp?.cif} />
            </Col>
          )}
          <Col lg={8}>
            <Label label="Main Applicant Name" value={mainApp?.customerName} />
          </Col>
        </Row>
        {tabs}

        <Row>
          {mainApp?.loanDetails && (
            <>
              <Col lg={8}>
                <Label label="Loan Amount" value={"₹ " + mainApp?.loanAmt} />
              </Col>
              <Col lg={8}>
                <Label label="Tenure" value={mainApp?.tenure + " months"} />
              </Col>
              <Col lg={8}>
                <Label label="ROI" value={mainApp?.roi + " %"} />
              </Col>
            </>
          )}
        </Row>
      </Spin>
    </>
  );
}

export default BasicDetails;
