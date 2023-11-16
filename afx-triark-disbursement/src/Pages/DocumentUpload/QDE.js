import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Collapse, Row } from "antd";
import React, { useEffect, useState } from "react";
import Spin from "../../Components/Spin";
import { getAdditionalDetails } from "../../Redux/Services/Cases";
import { getIndSoleFlag } from "../../Redux/Services/Cases";
import AdditionalDetails from "./AdditionDetails";
import "./index.scss";
import LoanDetails from "./LoanDetails";
import PanGst from "./panGST";
import PersonalDetails from "./PersonalDetails";
import BusinessDetails from "./BusinessDetails";
import References from "./References";

const { Panel } = Collapse;
function QDE(props) {
  const [qdeData, setQdeData] = useState({});
  const [panel, setActivePanel] = useState([]);
  const [loader, setLoader] = useState(false);
  const [soleFlag, setSoleFlag] = useState(false);

  useEffect(() => {
    if (props.activeItems.caseDetailsQdeInternalPanels !== "") {
      const { caseDetailsQdeInternalPanels } = props?.activeItems;

      if (caseDetailsQdeInternalPanels === "pan") {
        setActivePanel([`pan_${props?.id}`]);
      } else {
        setActivePanel([`ad_${props?.id}`]);
      }
    }
  }, [props?.activeItems.caseDetailsQdeInternalPanels]);

  useEffect(() => {
    (async () => {
      const response = await getIndSoleFlag({
        applicantUniqueId: props?.id,
        mainapp: props.isMainApplicant ? 1 : 0,
      });
      setSoleFlag(response?.data?.data);
    })();
    getData();
  }, []);

  const getData = async () => {
    setLoader(true);
    const response = await getAdditionalDetails({
      applicantUniqueId: props.id,
    });
    setQdeData(response?.data?.data);
    setLoader(false);
  };

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
            {mainPanels(qdeData, props, getData, soleFlag)}
          </Collapse>
        </Col>
      </Row>
    </Spin>
  );
}

const mainPanels = (qdeData, props, getData, soleFlag) => {
  //
  const { id } = props;
  const title = [
    {
      label: "PAN & GST Verification",
      Component: PanGst,
      componentProps: {
        // data: qdeData?.pangstdetails,
        caseSummaryData: props?.caseSummaryData,
        selfEmployedJourney: soleFlag?.indSelfSoleFlag,
        id: props?.id,
      },
      key: `pan_${id}`,
    },
    {
      label: "Additional Details",
      Component: AdditionalDetails,
      componentProps: {
        data: qdeData?.additionalDetails,
        actualPermanentAddDetailsFlag: qdeData?.actualPermanentAddDetailsFlag,
        panel: props.activeItems.caseDetailsQdeInternalPanels,
        // id: qdeData?.applicantUniqueId,
        caseSummaryData: props?.caseSummaryData,
        selfEmployedJourney: soleFlag?.indSelfSoleFlag,
        id: props?.id,
      },
      key: `ad_${id}`,
    },
    soleFlag?.indSelfSoleFlag
      ? {
          label: "Business Details",
          Component: BusinessDetails,
          componentProps: { id: props?.id },
          key: `pd_${id}`,
        }
      : {
          label: "Personal Details",
          Component: PersonalDetails,
          componentProps: { id: props?.id },
          key: `pd_${id}`,
        },
  ];
  const others = [
    {
      label: "References",
      Component: References,
      componentProps: { id: props?.id },
      key: `r_${id}`,
    },
    {
      label: "Loan Details",
      Component: LoanDetails,
      componentProps: {
        data: null,
        caseSummaryData: props?.caseSummaryData,
        getData: getData,
        id: props?.id,
        soleFlag: soleFlag,
      },
      key: `ld_${id}`,
    },
  ];

  let titles = title;
  if (props.isMainApplicant) {
    titles = [...title, ...others];
  }

  return titles.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`${item.key}`} header={label}>
        <Component {...item.componentProps} />
      </Panel>
    );
  });
};

export default QDE;
