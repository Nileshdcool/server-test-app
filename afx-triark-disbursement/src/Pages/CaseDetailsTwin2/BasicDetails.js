import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import Label from "../../Components/label";
import { getCaseSummaryDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";
import Spin from "../../Components/Spin";

function BasicDetails(props) {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getCaseSummaryDetailsTwin2({
        id: props.match.params.id,
      });
      setData(response);
      setLoader(false);
    })();
  }, []);

  return (
    <>
      <Spin spinning={loader}>
        <Row>
          <Col lg={8}>
            <Label label="LOS Application Id" value={parseFloat(localStorage.getItem("applicationId"))} />
          </Col>
          <Col lg={8}>
            <Label label="Main Applicant Name" value={data?.applicantName} />
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <Label label="Loan Amount" value={"₹ " + parseFloat(data?.loanAmount).toLocaleString("en-IN", {
              style: "decimal",
              currency: "INR",
            })} />
          </Col>
          <Col lg={8}>
            <Label label="Tenure" value={data?.tenure + " months"} />
          </Col>
          <Col lg={8}>
            <Label label="ROI" value={data?.roi + " %"} />
          </Col>
        </Row>
      </Spin>
    </>
  );
}

export default BasicDetails;
