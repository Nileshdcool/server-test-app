import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {getDocumentsData} from "../../Redux/Services/Fi"
import { useParams, Link } from "react-router-dom";
import ResidencePremise from "./premiseDocument/ResidencePremise";
import OfficePremise from "./premiseDocument/OfficePremise";

const { Panel } = Collapse;

function Document(props) {
  const [office, setOffice] = React.useState([])
  const [residence, setResidence] = React.useState([])
  const {id} = useParams()

  return (
    <Card title={""} className={"caseSummaryContainer"}>
      <Row gutter={[0, 20]}>
        <Col lg={24}>
          <Collapse
            expandIconPosition="end"
            expandIcon={({ isActive }) =>
              isActive ? <MinusOutlined /> : <PlusOutlined />
            }
            className={"caseSummaryCollapse"}>
            {mainPanels(props, office,residence)}
          </Collapse>
        </Col>
      </Row>
    </Card>
  );
}

const mainPanels = (props) => {
  const titles = [
    { label: "Office", Component: OfficePremise },
    { label: "Residence", Component: ResidencePremise },
  ];
  return titles.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`mainPanels_${index}`} header={label}>
            <Component match={props.match} />
      </Panel>
    );
  });
};

export default Document;
