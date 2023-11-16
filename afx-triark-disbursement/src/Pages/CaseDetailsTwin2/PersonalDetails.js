import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { getPersonalDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";
import Spin from "../../Components/Spin";

function PersonalDetails(props) {
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);

  const photo = (
    <img
      src={getFilePath(data?.filePath)}
      alt="pan"
      height="200px"
      width="300px"
    />
  );

  useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getPersonalDetailsTwin2({
        gupdhupId: props?.id,
      });
      setData(response);
      setLoader(false);
    })();
  }, []);

  return (
    <Spin spinning={loader}>
      <Row>
        <Col lg={8}>
          <Label label="Applicant Name" value={data?.applicantName} />
        </Col>
        {/* <Col lg={8}>
            <Label label="Marital Status" value={data?.maritalStatus} />
          </Col> */}
        <Col lg={8}>
          <Label label="Qualification" value={data?.qualification} />
        </Col>
        <Col lg={8}>
          <Label label="Aadhar Number" value={data?.aadharnumber} />
        </Col>
        <Col lg={8}>
          <Label label="Net Monthly Income" value={data?.netMonthlyIncome} />
        </Col>
      </Row>
      <br />
      <b>Bank Details</b>
      <br />
      <Row>
        <Col lg={8}>
          <Label label="Account Type" value={data?.bankDetails?.accountType} />
        </Col>
        <Col lg={8}>
          <Label label="Account Number" value={data?.bankDetails?.accountNumber} />
        </Col>
        <Col lg={8}>
          <Label label="IFSC Code" value={data?.bankDetails?.ifscCode} />
        </Col>
        <Col lg={8}>
          <Label label="Bank Name" value={data?.bankDetails?.bankName} />
        </Col>
      </Row>
    </Spin>
  );
}

export default PersonalDetails;
