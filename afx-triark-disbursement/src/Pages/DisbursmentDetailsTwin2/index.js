import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import Spin from "../../Components/Spin";
import DisbursementAmount from "./DisbursementAmount";
import DisbursementMode from "./DisbursementMode";

const { Panel } = Collapse;

function index(props) {
  const { setHeading } = useContext(App?.CaseContext);

  useEffect(() => {
    setHeading("Disbursement Details");
  }, []);

  return (
    <Card title={"Disbursement Details"} className={"caseSummaryContainer"}>
      <Row gutter={[0, 20]}>
        {/* <Col lg={24}>
            <Row type={"flex"} justify={"end"} className={"buttonRow"}>
              <Button
                onClick={(e) =>
                  props.history.push(`/case-historyTwin2/${props.match.params.id}`)
                }
                className={"reset-button"}
              >
                Case History
              </Button>
            </Row>
          </Col> */}
        <Col lg={24}>
          <Collapse
            expandIconPosition="right"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            defaultActiveKey={["mainPanels_0"]}
            className={"caseSummaryCollapse"}
          >
            {mainPanels(props)}
          </Collapse>
        </Col>
        <Col lg={24}>
          <Row type={"flex"} justify={"center"}>
            <Button
              className={"reset-button"}
              onClick={(e) => props?.history.push(`/dashboardTwin2`)}
            >
              Cancel
            </Button>{" "}
            &nbsp;
            <Button
              onClick={(e) =>
                props?.history.push(
                  `/case-detailsTwin2/${props?.match.params.id}`
                )
              }
              className={"reset-button"}
            >
              Back
            </Button>
            &nbsp;
            <Button
              onClick={(e) =>
                props?.history.push(
                  `/repayment-detailsTwin2/${props?.match.params.id}`
                )
              }
              className={"reset-button"}
            >
              Next
            </Button>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

const mainPanels = (props) => {
  const titles = [
    { label: "Disbursement Mode", Component: DisbursementMode },
    { label: "Disbursement Amount", Component: DisbursementAmount },
  ];
  return titles?.map((item, index) => {
    const { label, Component } = item;
    //
    return (
      <Panel key={`mainPanels_${index}`} header={label}>
        <Component match={props} />
      </Panel>
    );
  });
};

export default index;
