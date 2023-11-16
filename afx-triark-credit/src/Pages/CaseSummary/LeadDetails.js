import { Col, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Label from "../../Components/label";
import { getLeadDetails, negativePincode } from "../../Redux/Services/Cases";
import Spin from "../../Components/Spin";
import { useParams } from "react-router-dom";

function LeadDetails(props) {
  const [response, setResponse] = useState({});
  const [loader, setLoader] = useState(false);
  const [negativePin, setNegativePin] = useState("");
  let { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      setLoader(true);
      const response = await getLeadDetails({ applicantUniqueId: props.id });
      setResponse(response);

      if (response) {
        localStorage.setItem("branch", response?.branchName);
      }
      setLoader(false);
      let flag = true;
    };
    getData();
  }, []);
  
  return (
    <Spin spinning={loader}>
      <Row>
        <Col lg={8}>
          <Label label="Source Type" value={response.sourceType} />
        </Col>
        {(response.sourceType === "Dealer" ||
          response.sourceType === "DSA") && (
          <Col lg={8}>
            <Label label="Branch" value={response.branchName} />
          </Col>
        )}
        {(response.sourceType === "Dealer" ||
          response.sourceType === "DSA") && (
          <Col lg={8}>
            <Label label="Dealer" value={response.sourceName} />
          </Col>
        )}
        <Col lg={8}>
          <Label label="First Name" value={response.firstName} />
        </Col>
        <Col lg={8}>
          <Label label="Middle Name" value={response.middleName} />
        </Col>
        <Col lg={8}>
          <Label label="Last Name" value={response.lastName} />
        </Col>
        {response?.customerType && (
          <Col lg={8}>
            <Label label="Customer Type" value={response.customerType} />
          </Col>
        )}
        {response?.customerSubType && (
          <Col lg={8}>
            <Label label="Customer Subtype" value={response.customerSubType} />
          </Col>
        )}
        <Col lg={8}>
          <Label label="Mobile Number" value={response.customerMobile} />
        </Col>
        <Col lg={8}>
          <Label label="Email Address" value={response.customerEmail} />
        </Col>
        <Col lg={4}>
          <Label label="Pin Code" value={response.customerPincode} />
        </Col>
        <Col
          lg={4}
          style={{
            marginTop: "2.4%",
            marginLeft: "-10%",
          }}
        >
          {negativePin?.data?.data?.pincodeStatus && (
            <Tag color="red">Negative Area </Tag>
          )}
        </Col>
      </Row>
    </Spin>
  );
}

export default LeadDetails;
