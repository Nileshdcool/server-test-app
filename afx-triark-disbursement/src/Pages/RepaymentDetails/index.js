import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import Spin from "../../Components/Spin";
import RepaymentMode from "./RepaymentMode";
import Decisioning from "./Decisioning";
import BankAccountDetails from "./BankAccountDetails";
import { getCaseSummaryDetails } from "../../Redux/Services/documentUpload";
import DeferalType from "./DeferalType";

const { Panel } = Collapse;

function index(props) {
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const { setHeading } = useContext(App.CaseContext);
  const [loader, setLoader] = useState(false);

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

    setHeading("Repayment Details");
  }, []);

  return (
    <Spin spinning={loader}>
      <Card title={"Repayment Details"} className={"caseSummaryContainer"}>
        <Row gutter={[0, 20]}>
          <Col lg={24}>
            <Row type={"flex"} justify={"end"} className={"buttonRow"}>
              <Button
                onClick={(e) => {
                  // props.history.push(`/case-history/${props.match.params.id}`);
                  props.history.push({
                    pathname: `/case-history/${props.match.params.id}`,
                    state: { from: props.location.state?.from },
                  });
                }}
                className={"reset-button"}
              >
                Case History
              </Button>
            </Row>
          </Col>
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
                onClick={(e) => {
                  props.history.push({
                    pathname:
                      props.location.state?.from === "PRMCSES"
                        ? "/dashboardPremiumDealer"
                        : `/disbursement/dashboard`,
                    // state: { from: devType },
                  });
                }}
                className={"reset-button mr-1"}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  // props.history.push(
                  //   `/document-details/${props.match.params.id}`
                  // );
                  props.history.push({
                    pathname: `/document-details/${props.match.params.id}`,
                    state: { from: props.location.state?.from },
                  });
                }}
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
    // { label: "Deferral", Component: DeferalType },
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
