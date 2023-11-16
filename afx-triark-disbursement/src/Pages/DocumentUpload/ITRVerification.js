import React from "react";
import { Row, Col, Button } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import "./index.scss";
function ITRVerification(data) {
  return (
    <>
      <Row className="itrContiner">
        <Col lg={6}>
          <p
            onClick={() => {
              window.open(getFilePath(data?.data?.pdfPath));
            }}
          >
            <Label
              label="ITR Document"
              value={data?.data?.pdfPath?.split("/").pop()}
            />
          </p>
        </Col>
      </Row>
    </>
  );
}

export default ITRVerification;
