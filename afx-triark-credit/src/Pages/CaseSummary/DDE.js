import { Col, Collapse, Row } from "antd";
import React, {useState} from "react";
import "./index.scss";
import BankDetails from "./BankDetails";
import ITRVerification from "./ITRVerification";
import { getDdeDetails } from "../../Redux/Services/Cases";
import Spin from "../../Components/Spin";
import BankStatementUpload from './BankStatementUpload';

const { Panel } = Collapse;

function DDE(props) {
  const [ddeData, setDdeData] = React.useState({});
  const [loader, setLoader] = useState(false);

  React.useEffect(() => {
    const getData = async () => {
      setLoader(true);
      const response = await getDdeDetails({
        applicantUniqueId: props.id,
      });
      setDdeData(response);
      setLoader(false);
    };
    getData();
  }, []);
  
  return (
    <Spin spinning={loader}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Collapse defaultActiveKey={[1]} className={"caseSummaryCollapse"}>
            {mainPanels(ddeData)}
          </Collapse>
        </Col>
      </Row>
    </Spin>
  );
}

const mainPanels = (ddeData) => {
  const titles = [
    {
      label: "Salary Slips",
      Component: BankDetails,
      componentProps: { data: ddeData?.bankDetails },
    },
    {
      label: "ITR Verification",
      Component: ITRVerification,
      componentProps: { data: ddeData?.itr },
    },
    {
      label: "Bank Statement",
      Component: BankStatementUpload,
      componentProps: { data: ddeData?.bankStatementDetails },
    },
  ];
  return titles.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`mainPanels_${index}`} header={label}>
        <Component {...item.componentProps} />
      </Panel>
    );
  });
};

export default DDE;
