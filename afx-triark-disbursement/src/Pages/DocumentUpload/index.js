import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import { getCaseSummaryDetails } from "../../Redux/Services/documentUpload";
import { getIndSoleFlag } from "../../Redux/Services/Cases";
import BasicDetails from "./BasicDetails";
import PostDisbursal from "./PostDisbursal";
import PreDisbursal from "./PreDisbursal";
import CaseDetails from "./CaseDetails";
import { useLocation } from "react-router-dom";
import PaymentStatus from "./PaymentStatus";

const { Panel } = Collapse;

function index(props) {
  const location = useLocation();
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const { setHeading } = useContext(App.CaseContext);
  const [loader, setLoader] = useState(false);
  const [recallService, setRecallService] = useState(null);
  const [activeItems, setActiveItems] = useState({
    mainPanels: [],
    caseDetailsTab: `caseDetailsTab_${props.match.params.id}`, //TAB
    caseDetailsQdePanels: [], //PAN, ADITIONAL DETAILS
    caseDetailsQdeInternalPanels: [], //KYC,UTILITY
  });
  const [indDetails, setIndDetails] = useState(null);

  const getCS = async () => {
    setLoader(true);
    const response = await getCaseSummaryDetails({
      applicantUniqueId: props.match.params.id,
      roleId: parseInt(localStorage.getItem("roleId")),
    });
    setCaseSummaryData(response);
    setLoader(false);
  };

  useEffect(() => {
    getCS();

    setHeading("Documents Upload");

    // (async () => {
    //   const response = await getIndSoleFlag({
    //     applicantUniqueId: props.match.params.id,
    //   });
    //   setIndDetails(response?.data?.data);
    // })();
  }, []);

  return (
    <Card title={""} className={"caseSummaryContainer"}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Row type={"flex"} justify={"end"} className={"buttonRow"}>
            <Button
              onClick={(e) => {
                props.history.push({
                  pathname: `/case-history/${props.match.params.id}`,
                  state: { from: props.location.state?.from },
                });
                // props.history.push(`/case-history/${props.match.params.id}`);
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
            activeKey={activeItems?.mainPanels}
            onChange={(e) => setActiveItems({ ...activeItems, mainPanels: e })}
            defaultActiveKey={["mainPanels_0"]}
            className={"caseSummaryCollapse"}
          >
            {mainPanels(
              props,
              caseSummaryData,
              activeItems,
              setActiveItems,
              recallService,
              setRecallService,
              indDetails,
              getCS,
              location
            )}
            {/* {mainPanels(props, caseSummaryData)} */}
          </Collapse>
        </Col>
        <Col lg={24}>
          <Row type={"flex"} justify={"center"}>
            <Button
              onClick={(e) => {
                // props.history.push(`/disbursement/dashboard`);
                props.history.push(
                  `${
                    props.location.state?.from === "PRMCSES"
                      ? "/dashboardPremiumDealer"
                      : "/disbursement/dashboard"
                  }`
                );
              }}
              className={"reset-button mr-2"}
            >
              Back
            </Button>
            {!location?.state?.flagPaymentStatus && (
              <Button
                onClick={(e) => {
                  // props.history.push(
                  //   `/document-details/${props.match.params.id}`
                  // )
                  props.history.push({
                    pathname: `/document-details/${props.match.params.id}`,
                    state: { from: props.location.state?.from },
                  });
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
    // </Spin>
  );
}

const mainPanels = (
  props,
  caseSummaryData,
  activeItems,
  setActiveItems,
  recallService,
  setRecallService,
  indDetails,
  getCS,
  location
) => {
  const titles = location?.state?.flagPaymentStatus
    ? [
        { label: "Basic Details", Component: BasicDetails },
        { label: "Case Details", Component: CaseDetails },
        { label: "Pre Disbursal", Component: PreDisbursal },
        { label: "Post Disbursal", Component: PostDisbursal },
        { label: "Payment Status", Component: PaymentStatus },
      ]
    : [
        { label: "Basic Details", Component: BasicDetails },
        { label: "Case Details", Component: CaseDetails },
        { label: "Pre Disbursal", Component: PreDisbursal },
        { label: "Post Disbursal", Component: PostDisbursal },
      ];
  return titles.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`mainPanels_${index}`} header={label}>
        <Component
          match={props.match}
          caseSummaryData={caseSummaryData}
          activeItems={activeItems}
          setActiveItems={setActiveItems}
          recallService={recallService}
          setRecallService={setRecallService}
          getCS={getCS}
          indDetails={indDetails}
        />
      </Panel>
    );
  });
};

export default index;
