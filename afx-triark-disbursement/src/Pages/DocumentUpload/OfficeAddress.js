import React from "react";
import { Row, Col, Button, Tag } from "antd";
import Label from "../../Components/label";
import { negativePincode } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

function OfficeAddress(data) {
  const [negativePin, setNegativePin] = React.useState("");
  const [flagEdit, setFlagEdit] = React.useState(true);

  return (
    <>
      <Row>
        <Col lg={8}>
          <Label label="Address Line 1" value={data?.data?.address1} />
        </Col>
        <Col lg={8}>
          <Label label="Address Line 2" value={data?.data?.address2} />
        </Col>

        <Col lg={8}>
          <Label label="Landmark 1" value={data?.data?.landmark1} />
        </Col>
        {data?.data?.landmark2 && (
          <Col lg={8}>
            <Label label="Landmark 2" value={data?.data?.landmark2} />
          </Col>
        )}
        <Col lg={8}></Col>

        <Col lg={3}>
          <Label label="Pin Code" value={data?.data?.pinCode} />
        </Col>
        <Col lg={5} style={{ marginTop: "2.4%" }}>
          {negativePin?.data?.data?.pincodeStatus && (
            <Tag color="red">Negative Pincode </Tag>
          )}
        </Col>
        <Col lg={8}>
          <Label label="City" value={data?.data?.city} />
        </Col>
        <Col lg={8}>
          <Label label="State" value={data?.data?.state} />
        </Col>
      </Row>
    </>
  );
}

export default OfficeAddress;
