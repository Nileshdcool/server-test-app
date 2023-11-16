import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import { getKYCDocDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";

function KYCDocument(props) {
  const [newData, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    (async () => {
      setLoader(true);

      const response = await getKYCDocDetailsTwin2({
        gupdhupId: props?.id,
      });
      setLoader(false);
      setData(response);
    })();
  }, []);

  const front = (
    <img src={newData?.aadharimageUrl} alt="" height="125px" width="125px" />
  );

  if (!newData) {
    return (
      <div style={{ height: 100 }}>
        <Spin spinning={loader}>{""}</Spin>
      </div>
    );
  }

  return (
    <Spin spinning={loader}>
      <Row>
        <Col lg={8}>
          <Label label="Document Type" value={"Aadhar"} />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Label label="Aadhar Id" value={newData?.aadharNo} />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <Label label="Adhar Image" value={front} />
        </Col>
        <Col lg={1}></Col>
      </Row>
    </Spin>
  );
}

export default KYCDocument;
