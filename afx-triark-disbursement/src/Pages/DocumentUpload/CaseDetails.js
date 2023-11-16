import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Collapse, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import "./index.scss";
import DDE from "./DDE";
import LeadDetails from "./LeadDetails";
import QDE from "./QDE";

const { Panel } = Collapse;

function CaseDetails(props) {
  const [summaryData, setSummaryData] = useState([]);
  const { TabPane } = Tabs;

  useEffect(() => {
    setSummaryData([
      {
        id: props?.caseSummaryData?.mainapplicant[0]?.applicantUniqueId,
        title: "Main App",
        isMainApp: true,
      },
      ...props?.caseSummaryData?.coapplicant.map((item, index) => {
        return {
          id: item.coapplicantUniqueId,
          title: `Co App ${index + 1}`,
          isMainApp: false,
        };
      }),
      ...props?.caseSummaryData?.gurantor.map((item, index) => {
        return {
          id: item.coapplicantUniqueId,
          title: `Guarantor ${index + 1}`,
          isMainApp: false,
        };
      }),
    ]);
  }, []);

  return (
    <Tabs
      activeKey={props?.activeItems?.caseDetailsTab}
      onChange={(e) =>
        props.setActiveItems({
          ...props.activeItems,
          caseDetailsTab: e,
        })
      }>
      {summaryData.map((item, index) => (
        <TabPane tab={`${item.title}`} key={`caseDetailsTab_${item.id}`}>
          <Col lg={24}>
            <Collapse
              expandIconPosition="right"
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              activeKey={props.activeItems.caseDetailsQdePanels}
              onChange={(e) =>
                props.setActiveItems({
                  ...props.activeItems,
                  caseDetailsQdePanels: e,
                })
              }
              className={"caseSummaryCollapse"}>
              
              <Panel key={`leadDetails_${item.id}`} header={"Lead Details"}>
                <LeadDetails id={item.id} />
              </Panel>
              <Panel key={`qde_${item.id}`} header={"QDE"}>
                <QDE
                  id={item.id}
                  isMainApplicant={item.isMainApp}
                  activeItems={props.activeItems}
                  setActiveItems={props.setActiveItems}
                  caseSummaryData={props?.caseSummaryData}
                />
              </Panel>
              <Panel key={`dde_${item.id}`} header={"DDE"}>
                <DDE id={item.id} />
              </Panel>
            </Collapse>
          </Col>
        </TabPane>
      ))}
    </Tabs>
  );
}

export default CaseDetails;