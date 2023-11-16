import React from "react";
import { Row, Col, Tag } from "antd";
import Label from "../../Components/label";
import OfficeAddressEdit from "./OfficeAddressEdit";
import { EditOutlined } from '@ant-design/icons';

function OfficeAddress(data) {
  const [negativePin, setNegativePin] = React.useState("");
  const [flagEdit, setFlagEdit] = React.useState(true);

  return (
    <>
      {flagEdit ? (
        <>
          <Row justify="end" align="middle">
            {/* {!(data?.caseFreeze || data?.userFreeze) && (
            <EditOutlined onClick={() => setFlagEdit(false)} />
            )} */}
          </Row>
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

            <Col lg={3}>
              <Label label="Pin Code" value={data?.data?.pinCode} />
            </Col>
            <Col lg={5} style={{ marginTop: "2.4%" }}>
              {negativePin?.data?.data?.pincodeStatus && (
                <Tag color="red">Negative Area </Tag>
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
      ) : (
        <OfficeAddressEdit
          setFlagEdit={setFlagEdit}
          data={data?.data}
          getData={data?.getData}
        />
      )}
    </>
  );
}

export default OfficeAddress;
