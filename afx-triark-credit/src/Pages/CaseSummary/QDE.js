import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Collapse, Row } from "antd";
import React, { useEffect, useState } from "react";
import Spin from "../../Components/Spin";
import { getQdeDetails } from "../../Redux/Services/Cases";
import { getIndSoleFlag } from "../../Redux/Services/Cases";
import AdditionalDetails from "./AdditionDetails";
import "./index.scss";
import LoanDetails from "./LoanDetails";
import PanGst from "./PanGST";
import PersonalDetails from "./PersonalDetails";
import BusinessDetails from "./BusinessDetails";
import References from "./References";
import FinancialInformation from "./FinancialInformation"

import { getPanGstDetails } from "../../Redux/Services/Cases";

const { Panel } = Collapse;
function QDE(props) {
  const [qdeData, setQdeData] = useState({});
  const [panel, setActivePanel] = useState([]);
  const [loader, setLoader] = useState(false);
  const [soleFlag, setSoleFlag] = useState(false);
  const [docType, setDocType] = useState("");

  const userFreeze = props?.caseSummaryData?.modelAccess?.[0]?.read;
  const caseFreeze = props.isMainApplicant
    ? props?.caseSummaryData?.mainapplicant?.[0]?.creditFreeze
    : props?.isGuarantor
    ? props?.caseSummaryData?.gurantor?.[0]?.creditFreeze
    : props?.caseSummaryData?.coapplicant?.[0]?.creditFreeze;

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

  const getSoleFlag = async () => {
    (async () => {
      const response = await getIndSoleFlag({
        applicantUniqueId: props?.id,
        mainapp: props.isMainApplicant ? 1 : 0,
      });
      setSoleFlag(response?.data?.data);
    })();
  };
  const getPanDetails = async () => {
    const response = await getPanGstDetails({
      applicantUniqueId: props?.id,
    }).then((re) => {
      setDocType(re?.data.data.documentType);
    });
  };

  useEffect(() => {
    getSoleFlag();
    getData();
    getPanDetails();
  }, []);

  const getData = async () => {
    setLoader(true);
    const response = await getQdeDetails({
      applicantUniqueId: props.id,
    });
    setQdeData(response);
    setLoader(false);
  };

  return (
    <Spin spinning={loader}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Collapse
            expandIconPosition="end"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            activeKey={panel}
            onChange={(e) => setActivePanel(e)}
            className={"caseSummaryCollapse"}
          >
            {mainPanels(
              qdeData,
              props,
              getData,
              soleFlag,
              getSoleFlag,
              docType,
              getPanDetails,
              caseFreeze,
              userFreeze
            )}
          </Collapse>
        </Col>
      </Row>
    </Spin>
  );
}

const mainPanels = (
  qdeData,
  props,
  getData,
  soleFlag,
  getSoleFlag,
  docType,
  getPanDetails,
  caseFreeze,
  userFreeze
) => {
  const { id } = props;
  const title = [
    {
      label: "PAN & GST Verification",
      Component: PanGst,
      componentProps: {
        caseSummaryData: props?.caseSummaryData,
        selfEmployedJourney: soleFlag?.indSelfSoleFlag,
        isGuarantor: props?.isGuarantor,
        isMainApplicant: props.isMainApplicant,
        getCS: props?.getCS,
        getSoleFlag: getSoleFlag,
        id: props?.id,
        docType: docType,
        getPanDetails: getPanDetails,
        caseFreeze,
        userFreeze,
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
        isGuarantor: props?.isGuarantor,
        isMainApplicant: props.isMainApplicant,
        getData: getData,
        caseSummaryData: props?.caseSummaryData,
        selfEmployedJourney: soleFlag?.indSelfSoleFlag,
        id: props?.id,
        docType: docType,
        getPanDetails: getPanDetails,
        caseFreeze,
        userFreeze,
        qdeData: qdeData
      },
      key: `ad_${id}`,
    },
    soleFlag?.indSelfSoleFlag
      ? {
          label: "Business Details",
          Component: BusinessDetails,
          componentProps: {
            id: props?.id,
            isGuarantor: props?.isGuarantor,
            isMainApplicant: props.isMainApplicant,
            caseFreeze,
            userFreeze,
          },
          key: `pd_${id}`,
        }
      : {
          label: "Personal Details",
          Component: PersonalDetails,
          componentProps: {
            id: props?.id,
            isGuarantor: props?.isGuarantor,
            isMainApplicant: props.isMainApplicant,
            qdeData: qdeData?.additionalDetails,
            caseFreeze,
            userFreeze,
          },
          key: `pd_${id}`,
        },
  ];
  const others = [
    {
      label: "Financial Information",
      Component: FinancialInformation,
      componentProps: {
        id: props?.id,
          isGuarantor: props?.isGuarantor,
          isMainApplicant: props.isMainApplicant,
          qdeData: qdeData?.additionalDetails,
          caseFreeze,
          userFreeze,
      },
      key: `fi_${id}`,
    },
    {
      label: "References",
      Component: References,
      componentProps: {
        id: props?.id,
        isGuarantor: props?.isGuarantor,
        isMainApplicant: props.isMainApplicant,
        caseFreeze,
        userFreeze,
      },
      key: `r_${id}`,
    },
    {
      label: "Loan Details",
      Component: LoanDetails,
      componentProps: {
        data: null,
        caseSummaryData: props?.caseSummaryData,
        isGuarantor: props?.isGuarantor,
        isMainApplicant: props.isMainApplicant,
        getData: getData,
        id: props?.id,
        soleFlag: soleFlag,
        caseFreeze,
        userFreeze,
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
