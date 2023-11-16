import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { getPersonalDetails } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import Spin from "../../Components/Spin";

function PersonalDetails(props) {
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const params = useParams();

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
      const response = await getPersonalDetails({
        applicantUniqueId: props?.id,
      });
      setData(response?.data?.data);
      setLoader(false);
    })();
  }, []);

  return (
    <>
      <Spin spinning={loader}>
        {data?.filePath && (
          <Row>
            <Col lg={8}>
              <Label label="Photo" value={photo} />
            </Col>
          </Row>
        )}
        <Row>
          <Col lg={8}>
            <Label label="Father's Name" value={data?.fatherName} />
          </Col>
          <Col lg={8}>
            <Label label="Mother's Name" value={data?.motherName} />
          </Col>
          <Col lg={8}>
            <Label label="Marital Status" value={data?.maritalStatus} />
          </Col>
          {data?.spouseName && (
            <Col lg={8}>
              <Label label="Spouse Name" value={data?.spouseName} />
            </Col>
          )}
          <Col lg={8}>
            <Label label="Qualification" value={data?.qualification} />
          </Col>
          <Col lg={8}>
            <Label label="Aadhar Number" value={data?.aadhaarNumber} />
          </Col>
          <Col lg={8}>
            <Label
              label="Annual Gross Income"
              value={data?.annualGrossIncome}
            />
          </Col>
          <Col lg={8}>
            <Label label="Net Monthly Income" value={data?.netMonthlyIncome} />
          </Col>
          <Col lg={8}>
            <Label
              label="Net Monthly Obligation"
              value={data?.netMonthlyObligations}
            />
          </Col>
        </Row>
        <br />
        <b>Bank Details</b>
        <br /> <br />
        <Row>
          <Col lg={8}>
            <Label label="Account Type" value={data?.accountType} />
          </Col>
          <Col lg={8}>
            <Label label="Account Number" value={data?.accountNumber} />
          </Col>
          <Col lg={8}>
            <Label label="IFSC Code" value={data?.ifscNumber} />
          </Col>
          <Col lg={8}>
            <Label label="Bank Name" value={data?.bankName} />
          </Col>
        </Row>
      </Spin>
    </>
  );
}

export default PersonalDetails;
