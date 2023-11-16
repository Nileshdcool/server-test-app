import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Collapse, Row } from "antd";
import React, { useEffect, useState } from "react";
import Spin from "../../Components/Spin";
import "./index.scss";
import LoanDetails from "./LoanDetails";
import PanGst from "./panGST";
import PersonalDetails from "./PersonalDetails";
import KYCDocument from "./KYCDocument";
import Utility from "./Utility";
import PermanentAddress from "./PermanentAddress";

const { Panel } = Collapse;
function QDE(props) {
  const [panel, setActivePanel] = useState([]);
  const [loader, setLoader] = useState(false);

  return (
    <Spin spinning={loader}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Collapse
            expandIconPosition="right"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            activeKey={panel}
            onChange={(e) => setActivePanel(e)}
            className={"caseSummaryCollapse"}
          >
            {mainPanels(props)}
          </Collapse>
        </Col>
      </Row>
    </Spin>
  );
}

const mainPanels = (props) => {
  const title = [
    {
      label: "PAN Details",
      Component: PanGst,
      componentProps: {
        id: props?.id,
      },
      key: `pan_${props?.id}`,
    },
    {
      label: "Aadhar Details",
      Component: KYCDocument,
      componentProps: {
        id: props?.id,
      },
      key: `kyc_${props?.id}`,
    },
    {
      label: "Utility Bill",
      Component: Utility,
      componentProps: {
        id: props?.id,
      },
      key: "utility",
    },
    {
      label: "Current Resident Address",
      Component: PermanentAddress,
      componentProps: {
        id: props?.id,
      },
      key: `pa_${props?.id}`,
    },
    {
      label: "Personal Details",
      Component: PersonalDetails,
      componentProps: { id: props?.id },
      key: `pd_${props?.id}`,
    },
  ];
  const others = [
    {
      label: "Loan Details",
      Component: LoanDetails,
      componentProps: {
        id: props?.id,
      },
      key: `ld_${props?.id}`,
    },
  ];

  let titles = title;
  if (props.isMainApplicant) {
    titles = [...title, ...others];
  }

  return titles?.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`${item?.key}`} header={label}>
        <Component {...item?.componentProps} />
      </Panel>
    );
  });
};

export default QDE;
