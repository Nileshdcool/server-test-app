import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import Spin from "../../Components/Spin";
import RepaymentMode from "./RepaymentMode";
import Decisioning from "./Decisioning";
import BankAccountDetails from "./BankAccountDetails";
import { getCaseSummaryDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";

const { Panel } = Collapse;

function index(props) {
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const { setHeading } = useContext(App.CaseContext);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    (async () => {
      // setLoader(true);
      // const response = await getCaseSummaryDetailsTwin2({
      //   applicantUniqueId: props.match.params.id,
      //   roleId: parseInt(localStorage.getItem("roleId")),
      // });
      // const response = {
      //   coapplicant: [
      //     {
      //       cif: 548,
      //       crifFalg: true,
      //       personalDetailsFlag: true,
      //       breStatus: "Manual Underwriting",
      //       schemeName: "Brandnew",
      //       additionalDetails: false,
      //       loanAmt: 54360,
      //       roi: 10,
      //       bankDetailsFalg: false,
      //       coSaveScheme: false,
      //       customerName: "Keshav K Manjrekar ",
      //       customerEmail: "Banajsj@gmail.com",
      //       consentStatus: "DDE",
      //       loanOffer: false,
      //       submitCreditFlag: false,
      //       panAndGst: true,
      //       coapplicantUniqueId: "80876364381654088471948",
      //       itrFlag: true,
      //       id: 147,
      //       customerMobile: 8087636438,
      //       tenure: 12,
      //     },
      //   ],
      //   losStatus: "Manual Underwriting",
      //   gurantor: [],
      //   modelAccess: [
      //     {
      //       accessId: 0,
      //       hide: false,
      //       read: false,
      //       roleId: 50,
      //       id: 43,
      //       moduleId: 4,
      //       write: true,
      //     },
      //   ],
      //   mainapplicant: [
      //     {
      //       cif: 547,
      //       scheme: true,
      //       caseStatus: "Query Resolved",
      //       postSalesFreeze: false,
      //       roi: 10,
      //       reference: true,
      //       saveScheme: true,
      //       loanAgreementFlag: false,
      //       customerEmail: "Nznnz@gmail.com",
      //       consentStatus: "QDE",
      //       submitCreditFlag: false,
      //       applicantUniqueId: "93076318231653917160107",
      //       id: 85335,
      //       preSalesFreeze: false,
      //       tenure: 12,
      //       qdeSalesFreeze: false,
      //       crifFalg: false,
      //       personalDetailsFlag: true,
      //       creditFreeze: false,
      //       loanDetails: true,
      //       breStatus: "Manual Underwriting",
      //       repaymentFlag: false,
      //       schemeName: "Brandnew",
      //       preDisbursalFlag: false,
      //       businessDetails: false,
      //       additionalDetails: true,
      //       loanAmt: 54360,
      //       bankDetailsFalg: false,
      //       customerName: "Avinash s J",
      //       postDisbursalFlag: false,
      //       disbursementFreeze: false,
      //       loanOffer: false,
      //       panAndGst: true,
      //       itrFlag: false,
      //       customerMobile: 9307631823,
      //       caseModule: "Credit Module",
      //     },
      //   ],
      //   ddeMandatory: false,
      // };
      // setCaseSummaryData(response);
      // setLoader(false);
    })();

    setHeading("Repayment Details");
  }, []);

  return (
    <Spin spinning={loader}>
      <Card title={"Repayment Details"} className={"caseSummaryContainer"}>
        <Row gutter={[0, 20]}>
          {/* <Col lg={24}>
            <Row type={"flex"} justify={"end"} className={"buttonRow"}>
              <Button
                onClick={(e) =>
                  props.history.push(
                    `/case-historyTwin2/${props.match.params.id}`
                  )
                }
                className={"reset-button"}
              >
                Case History
              </Button>
            </Row>
          </Col> */}
          <Col lg={24}>
            <Collapse
              defaultActiveKey={["mainPanels_0"]}
              expandIconPosition="right"
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              className={"caseSummaryCollapse"}
            >
              {/* {mainPanels(props)} */}
              {mainPanels(props, caseSummaryData)}
            </Collapse>
          </Col>
          <Col lg={24}>
            <Row type={"flex"} justify={"center"}>
              <Button
                onClick={(e) => props.history.push(`/dashboardTwin2`)}
                className={"reset-button mr-1"}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) =>
                  props.history.push(
                    `/disbursment-detailsTwin2/${props.match.params.id}`
                  )
                }
                className={"reset-button"}
              >
                Back
              </Button>
              &nbsp;
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}

const mainPanels = (props, caseSummaryData) => {
  const titles = [
    { label: "Bank Account Details", Component: BankAccountDetails },
    { label: "Repayment Mode", Component: RepaymentMode },
    { label: "Decisioning", Component: Decisioning },
  ];
  return titles.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`mainPanels_${index}`} header={label}>
        <Component match={props.match} caseSummaryData={caseSummaryData} />
      </Panel>
    );
  });
};

export default index;
