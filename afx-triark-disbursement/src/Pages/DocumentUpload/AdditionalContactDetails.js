import React from "react";
import { Row, Col, Button } from "antd";
import Label from "../../Components/label";

function AdditionalContatDetails(data) {
  return (
    <Row>
      <Col lg={8}>
        <Label label="Mobile Number" value={data?.data?.mobileNo} />
      </Col>
    </Row>
  );
}

export default AdditionalContatDetails;
