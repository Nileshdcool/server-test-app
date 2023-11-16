import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import Spin from "../../Components/Spin";
import {
  getCaseSummaryDetails,
} from "../../Redux/Services/Cases";
import BasicDetails from "./BasicDetails";
import CaseDetails from "./CaseDetails";
import Decisioning from "./Decisioning";
import FI from "./FI";
import "./index.scss";
import RCU from "./RCU";
import Tvr from "./Tvr";
import DocumentUpload from "./DocumentUpload";
import ManualBureauUpload from "./ManualBureauUpload";
import KarzaOutput from "./KarzaOutput";
import CKYCDocument from "./CKYCDocument";
import CreditInformation from "./CreditInformation";
import FinalAssessment from "./FinalAssessment";
import LoanDet from "./LoanDet"

const { Panel } = Collapse;

function index(props) {
  const [devType, setDevType] = useState(props.location.state?.from);
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const [indDetails, setIndDetails] = useState(null);
  const [recallService, setRecallService] = useState(null);
  const { setHeading } = useContext(App.CaseContext);
  const [activeItems, setActiveItems] = useState({
    mainPanels: [],
    caseDetailsTab: `caseDetailsTab_${props.match.params.id}`, //TAB
    caseDetailsQdePanels: [], //PAN, ADITIONAL DETAILS
    caseDetailsQdeInternalPanels: [], //KYC,UTILITY
  });
  const [loader, setLoader] = useState(false);

  const id = props.match.params.id;

  const getCS = async () => {
    setLoader(true);
    const response = await getCaseSummaryDetails({
      applicantUniqueId: props.match.params.id,
      roleId: parseInt(localStorage.getItem("roleId")),
    });
    setCaseSummaryData(response);
    if (response?.mainapplicant[0].leadCode) {
      localStorage.setItem("leadCode", response?.mainapplicant[0].leadCode);
    }

    setLoader(false);
  };
  useEffect(() => {
    getCS();
    setHeading("Case Summary");
  }, []);

  const getDataCS = async () => {
    setLoader(true);
    const response = await getCaseSummaryDetails({
      applicantUniqueId: props.match.params.id,
      roleId: parseInt(localStorage.getItem("roleId")),
    });
    setCaseSummaryData(response);
    setLoader(false);
  };
  useEffect(() => {
    getDataCS();
  }, [recallService]);
  return (
    <Spin spinning={loader}>
      <Card title={"Case Summary"} className={"caseSummaryContainer"}>
        <Row gutter={[0, 20]}>
          <Col lg={24}>
            <Row type={"flex"} justify={"end"} className={"buttonRow"}>
              <Button
                onClick={(e) =>
                  props.history.push({
                    pathname: `/case-report/${props.match.params.id}`,
                    state: { from: devType },
                  })
                }
                className={"reset-button"}
              >
                Bureau, Agreement & Bank Statement
              </Button>
              <Button
                onClick={(e) =>
                  props.history.push({
                    pathname: `/case-history/${props.match.params.id}`,
                    state: { from: devType },
                  })
                }
                className={"reset-button"}
              >
                Case History
              </Button>
            </Row>
          </Col>
          <Col lg={24}>
            <Collapse
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              className={"caseSummaryCollapse"}
              activeKey={activeItems.mainPanels}
              onChange={(e) =>
                setActiveItems({ ...activeItems, mainPanels: e })
              }
            >
              {mainPanels(
                props,
                caseSummaryData,
                activeItems,
                setActiveItems,
                recallService,
                setRecallService,
                getCS,
                indDetails
              )}
            </Collapse>
          </Col>
          <Col lg={24}>
            <Row type={"flex"} justify={"center"}>
              <Button
                onClick={(e) => {
                  props.history.push(
                    `${
                      devType === "PRMCSES"
                        ? "/dashboardPremiumDealer"
                        : "/credit/dashboard"
                    }`
                  );
                }}
                className={"reset-button marginRight10"}
              >
                Exit
              </Button>{" "}
              &nbsp;
              <Button
                onClick={(e) => {
                  props.history.push({
                    pathname: `/deviation/${props.match.params.id}`,
                    state: { from: devType },
                  });
                }}
                className={"reset-button"}
              >
                Back
              </Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}

const mainPanels = (
  props,
  caseSummaryData,
  activeItems,
  setActiveItems,
  recallService,
  setRecallService,
  getCS,
  indDetails
) => {
  const titles = [
    { label: "Basic Details", Component: BasicDetails },
    { label: "Case Details", Component: CaseDetails },
    { label: "View & Download Documents", Component: DocumentUpload },
    { label: "Karza Output", Component: KarzaOutput },
    { label: "C-KYC Documents", Component: CKYCDocument },
    { label: "RCU", Component: RCU },
    { label: "Manual Bureau Upload", Component: ManualBureauUpload },
    { label: "Credit Information", Component: CreditInformation },
    { label: "FI", Component: FI },
    { label: "TVR", Component: Tvr },
    { label: "Final Assessment", Component: FinalAssessment },
    { label: "Loan Details", Component: LoanDet },
    { label: "Decisioning", Component: Decisioning },
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
