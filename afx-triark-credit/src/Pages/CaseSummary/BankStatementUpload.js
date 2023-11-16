import React from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import "./index.scss";

function BankStatementUpload(data) {
  return (
    <>
      <Row className="itrContiner">
        <Col lg={6}>
          <p
            onClick={() => {
              window.open(getFilePath(data?.data?.filePath));
            }}
          >   
            <Label
              label={data?.data?.documentName}
              value={data?.data?.filePath?.split("/").pop()}
            />
          </p>
        </Col>
      </Row>
    </>
  );
}

export default BankStatementUpload;
