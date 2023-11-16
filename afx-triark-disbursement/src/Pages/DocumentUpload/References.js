import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Collapse, Row } from "antd";
import React, { useEffect, useState, useContext } from "react";
import "./index.scss";
import {
  getQdeDetails,
  getReferenceDetailsFamily,
  getReferenceDetailsNonFamily,
} from "../../Redux/Services/Cases";
import FamilyReference from "./FamilyReference";
import NonFamilyReference from "./NonFamilyReference";
import Spin from "../../Components/Spin";
import { useParams } from "react-router-dom";

const { Panel } = Collapse;
function References(props) {
  const [referenceData, setReferenceData] = useState({});
  const [loader, setLoader] = useState(false);
  const [dataFamily, setDataFamily] = useState(null);
  const [dataNonFamily, setDataNonFamily] = useState(null);
  const params = useParams();

  useEffect(() => {
    const getData = async () => {
      setLoader(true);
      // const responseR = await getQdeDetails({
      //   applicantUniqueId: params?.id,
      // });

      setReferenceData(props.data);
      setLoader(false);
      const response = await getReferenceDetailsFamily({
        applicantUniqueId: props?.id,
      });
      setDataFamily(response?.data?.data);

      const responseR = await getReferenceDetailsNonFamily({
        applicantUniqueId: props?.id,
      });
      setDataNonFamily(responseR?.data?.data);
    };
    getData();
  }, []);

  return (
    <Spin spinning={loader}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Collapse
            expandIconPosition="right"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            defaultActiveKey={[1]}
            className={"caseSummaryCollapse"}>
            {mainPanels(referenceData, dataFamily, dataNonFamily)}
          </Collapse>
        </Col>
      </Row>
    </Spin>
  );
}

const mainPanels = (referenceData, dataFamily, dataNonFamily) => {
  const titles = [
    {
      label: "Family Reference",
      Component: FamilyReference,
      componentProps: { data: dataFamily },
    },
    {
      label: "Non Family Reference",
      Component: NonFamilyReference,
      componentProps: { data: dataNonFamily },
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

export default References;
