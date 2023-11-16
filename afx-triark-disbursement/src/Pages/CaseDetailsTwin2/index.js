import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import BasicDetails from "./BasicDetails";
import PostDisbursal from "./PostDisbursal";
import PreDisbursal from "./PreDisbursal";
import CaseDetails from "./CaseDetails";
import { useLocation } from "react-router-dom";
import PaymentStatusTwin2 from "./PaymentStatusTwin2";

const { Panel } = Collapse;

function index(props) {
  const location = useLocation();
  const { setHeading } = useContext(App?.CaseContext);
  const [recallService, setRecallService] = useState(null);
  const [activeItems, setActiveItems] = useState({
    mainPanels: [],
    caseDetailsTab: `caseDetailsTab_${props?.match.params.id}`, //TAB
    caseDetailsQdePanels: [], //PAN, ADITIONAL DETAILS
    caseDetailsQdeInternalPanels: [], //KYC,UTILITY
  });

  useEffect(() => {
    setHeading("Case Details");
  }, []);
  return (
    <Card title={""} className={"caseSummaryContainer"}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Collapse
            expandIconPosition="right"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            activeKey={activeItems?.mainPanels}
            onChange={(e) => setActiveItems({ ...activeItems, mainPanels: e })}
            defaultActiveKey={["mainPanels_0"]}
            className={"caseSummaryCollapse"}
          >
            {mainPanels(
              props,
              activeItems,
              setActiveItems,
              recallService,
              setRecallService,
              location
            )}
          </Collapse>
        </Col>
        <Col lg={24}>
          <Row type={"flex"} justify={"center"}>
            <Button
              onClick={(e) => props.history.push(`/dashboardTwin2`)}
              className={"reset-button mr-2"}
            >
              Back
            </Button>
            {!location?.state?.flagPaymentStatus && (
              <Button
                onClick={(e) => {
                  {
                    props.history.push(
                      `/disbursment-detailsTwin2/${props?.match.params.id}`
                    );
                  }
                }}
                className={"reset-button"}
              >
                Next
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

const mainPanels = (
  props,
  activeItems,
  setActiveItems,
  recallService,
  setRecallService,
  location
) => {
  const titles = location?.state?.flagPaymentStatus
    ? [
        { label: "Basic Details", Component: BasicDetails },
        { label: "Case Details", Component: CaseDetails },
        { label: "Pre Disbursal", Component: PreDisbursal },
        { label: "Post Disbursal", Component: PostDisbursal },
        { label: "Payment Status", Component: PaymentStatusTwin2 },
      ]
    : [
        { label: "Basic Details", Component: BasicDetails },
        { label: "Case Details", Component: CaseDetails },
        { label: "Pre Disbursal", Component: PreDisbursal },
        { label: "Post Disbursal", Component: PostDisbursal },
      ];
  return titles?.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`mainPanels_${index}`} header={label}>
        <Component
          match={props?.match}
          applicationId={location?.state?.applicationId}
          activeItems={activeItems}
          setActiveItems={setActiveItems}
          recallService={recallService}
          setRecallService={setRecallService}
        />
      </Panel>
    );
  });
};

export default index;
