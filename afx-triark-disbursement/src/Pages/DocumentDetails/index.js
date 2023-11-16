import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import Spin from "../../Components/Spin";
import DisbursementAmount from "./DisbursementAmount";
import DisbursementMode from "./DisbursementMode";
import { getCaseSummaryDetails } from "../../Redux/Services/documentUpload";

// const getCaseSummaryDetails = () => {};
const { Panel } = Collapse;

function index(props) {
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const { setHeading } = useContext(App.CaseContext);
  const [loader, setLoader] = useState(false);
  const [disbsData, setDisbsData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoader(true);
      const response = await getCaseSummaryDetails({
        applicantUniqueId: props.match.params.id,
        roleId: parseInt(localStorage.getItem("roleId")),
      });
      setCaseSummaryData(response);
      setLoader(false);
    };
    getData();
    setHeading("Disbursement Details");
  }, []);

  return (
    <Spin spinning={loader}>
      <Card title={"Disbursement Details"} className={"caseSummaryContainer"}>
        <Row gutter={[0, 20]}>
          <Col lg={24}>
            <Row type={"flex"} justify={"end"} className={"buttonRow"}>
              <Button
                onClick={(e) => {
                  props.history.push({
                    pathname: `/case-history/${props.match.params.id}`,
                    state: { from: props.location.state?.from },
                  });
                  // props.history.push(`/case-history/${props.match.params.id}`)
                }}
                className={"reset-button"}
              >
                Case History
              </Button>
            </Row>
          </Col>
          <Col lg={24}>
            <Collapse
              expandIconPosition="right"
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              defaultActiveKey={["mainPanels_0"]}
              className={"caseSummaryCollapse"}
            >
              {mainPanels(props, caseSummaryData, disbsData, setDisbsData)}
            </Collapse>
          </Col>
          <Col lg={24}>
            <Row type={"flex"} justify={"center"}>
              <Button
                className={"reset-button"}
                onClick={(e) => {
                  // props.history.push(`/disbursement/dashboard`);
                  props.history.push({
                    pathname:
                      props.location.state?.from === "PRMCSES"
                        ? "/dashboardPremiumDealer"
                        : `/disbursement/dashboard`,
                    // state: { from: devType },
                  });
                }}
              >
                Cancel
              </Button>{" "}
              &nbsp;
              <Button
                onClick={(e) => {
                  // props.history.push(
                  //   `/documents-upload/${props.match.params.id}`
                  // );
                  props.history.push({
                    pathname: `/documents-upload/${props.match.params.id}`,
                    state: { from: props.location.state?.from },
                  });
                }}
                className={"reset-button"}
              >
                Back
              </Button>
              &nbsp;
              <Button
                onClick={(e) =>
                  props.history.push({
                    pathname: `/repayment-details/${props.match.params.id}`,
                    state: { from: props.location.state?.from },
                  })
                }
                className={"reset-button"}
              >
                Next
              </Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}

const mainPanels = (props, caseSummaryData, disbsData, setDisbsData) => {
  const titles = [
    { label: "Disbursement Mode", Component: DisbursementMode },
    { label: "Disbursement Amount", Component: DisbursementAmount },
  ];
  return titles.map((item, index) => {
    const { label, Component } = item;
    //
    return (
      <Panel key={`mainPanels_${index}`} header={label}>
        <Component
          match={props.match}
          caseSummaryData={caseSummaryData}
          disbsData={disbsData}
          setDisbsData={setDisbsData}
        />
      </Panel>
    );
  });
};

export default index;
