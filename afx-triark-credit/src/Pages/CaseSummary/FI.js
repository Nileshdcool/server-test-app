import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Collapse, Row} from "antd";
import React, { useEffect, useState } from "react";
import Spin from "../../Components/Spin";
import { getCaseSummaryDetails } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import FIReport from './FIReport';

const { Panel } = Collapse;
function FI(props) {
  const { id } = useParams();
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const [recallService, setRecallService] = useState(null);
  const [activeItems, setActiveItems] = useState({
    mainPanels: [],
    caseDetailsTab: `caseDetailsTab_${props.match.params.id}`, //TAB
    caseDetailsQdePanels: [], //PAN, ADITIONAL DETAILS
    caseDetailsQdeInternalPanels: [], //KYC,UTILITY
  });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoader(true);
      const response = await getCaseSummaryDetails({
        applicantUniqueId: id,
        roleId: parseInt(localStorage.getItem("roleId")),
      });
      setCaseSummaryData(response);
      setLoader(false);
    };
    getData();
  }, []);

  return (
    <Spin spinning={loader}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Collapse
            expandIconPosition="end"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            className={"caseSummaryCollapse"}
            activeKey={activeItems.mainPanels}
            onChange={(e) => setActiveItems({ ...activeItems, mainPanels: e })}
          >
            {mainPanels(
              props,
              caseSummaryData,
              activeItems,
              setActiveItems,
              recallService,
              setRecallService
            )}
          </Collapse>
        </Col>
      </Row>
    </Spin>
  );
}

const mainPanels = (
  props,
  caseSummaryData,
  activeItems,
  setActiveItems,
  recallService,
  setRecallService
) => {
  const titles = [
    { label: "FI Report Upload", Component: FIReport },
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
        />
      </Panel>
    );
  });
};

export default FI;
