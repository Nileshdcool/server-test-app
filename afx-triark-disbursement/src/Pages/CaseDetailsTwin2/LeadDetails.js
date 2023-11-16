import { Col, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Label from "../../Components/label";
import { getLeadDetails, negativePincode } from "../../Redux/Services/Cases";
import { getCaseSummaryDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";
import Spin from "../../Components/Spin";

function LeadDetails(props) {
  const [response, setResponse] = useState({});
  const [loader, setLoader] = useState(false);
  const [negativePin, setNegativePin] = useState("");

  let flag = true;
  useEffect(() => {
    const getData = async () => {
      setLoader(true);
      const response = await getCaseSummaryDetailsTwin2({ id: props.id });
      setResponse(response);
      setLoader(false);
      // if (flag && response?.pincode) {
      //   const negPincode = await negativePincode({
      //     pincode: response?.pincode,
      //   });
      //   setNegativePin(negPincode);
      //   flag = false;
      // }
    };
    getData();
  }, []);
  return (
    <Spin spinning={loader}>
      <Row>
        <Col lg={8}>
          <Label label="Applicant Name" value={response.applicantName} />
        </Col>
        <Col lg={8}>
          <Label label="Source Type" value={response.sourceType} />
        </Col>
        <Col lg={8}>
          <Label label="Dealer" value={response.dealerName} />
        </Col>
        <Col lg={8}>
          <Label label="Mobile Number" value={response.mobile} />
        </Col>
        <Col lg={8}>
          <Label label="Email Address" value={response.emailAddress} />
        </Col>
        <Col lg={4}>
          <Label label="Pin Code" value={response.pincode} />
        </Col>
        {/* <Col
          lg={4}
          style={{
            marginTop: "2.4%",
            marginLeft: "-10%",
          }}
        >
          {negativePin?.data?.data?.pincodeStatus && (
            <Tag color="red">Negative Pincode </Tag>
          )}
        </Col> */}
      </Row>
    </Spin>
  );
}

export default LeadDetails;
