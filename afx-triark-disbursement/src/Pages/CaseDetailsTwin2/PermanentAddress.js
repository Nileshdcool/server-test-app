import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import Label from "../../Components/label";
import { getCurResidenceDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";
import Spin from "../../Components/Spin";

function PermanentAddress(props) {
  const [data, setData] = useState("");
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getCurResidenceDetailsTwin2({
        gupdhupId: props?.id,
      });
      setData(response);
      setLoader(false);
    })();
  }, []);
  return (
    <Spin spinning={loader}>
      <Row>
        <Col lg={16}>
          <Label label="Address" value={data?.address} />
        </Col>
        <Col lg={8}>
          <Label label="Residence Type" value={data?.residenceType} />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Label label="PIN Code" value={data?.pincode} />
        </Col>
        {/* <Col lg={5} style={{ marginTop: "2.4%" }}>
            {negativePin?.data?.pincodeStatus && (
              <Tag color="red">Negative Pincode </Tag>
            )}
          </Col> */}
        <Col lg={8}>
          <Label label="City" value={data?.city} />
        </Col>
        <Col lg={8}>
          <Label label="State" value={data?.state} />
        </Col>
      </Row>
    </Spin>
  );
}

export default PermanentAddress;
