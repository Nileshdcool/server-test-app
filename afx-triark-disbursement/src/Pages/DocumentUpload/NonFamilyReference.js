import React from "react";
import { Row, Col, Button } from "antd";
import Label from "../../Components/label";
import { useParams } from "react-router-dom";
import { getReferenceDetailsNonFamily } from "../../Redux/Services/Cases";

function NonFamilyReference({ data }) {
  if (!data) {
    return <></>;
  }

  return (
    <>
      <Row>
        <Col lg={8}>
          <Label label="Relationship" value={data?.relationship} />
        </Col>
        <Col lg={8}>
          <Label label="Name" value={data?.name} />
        </Col>
        <Col lg={8}>
          <Label label="Mobile Number" value={data?.mobNo} />
        </Col>
        <Col lg={8}>
          <Label label="Address" value={data?.addres} />
        </Col>
      </Row>
    </>
  );
}

export default NonFamilyReference;
