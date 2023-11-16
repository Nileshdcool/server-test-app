import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Button } from "antd";
import Label from "../../Components/label";
import { getLoanDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";
import Spin from "../../Components/Spin";
// import { Spin } from "antd";

function LoanDetails(props) {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(0);


  useEffect(() => {
    // get Loan Details
    (async () => {
      setLoader(true);
      const response = await getLoanDetailsTwin2({
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
          <Label label="Vehicle Type" value={data?.vehicleType} />
        </Col>
        <Col lg={8}>
          <Label label="Vehicle Brand" value={data?.vehicleBrand} />
        </Col>
        <Col lg={8}>
          <Label label="Vehicle Model" value={data?.vehicleModel} />
        </Col>
        <Col lg={8}>
          <Label label="Vehicle Sub Model" value={data?.vehicleSubModel} />
        </Col>
        <Col lg={8}>
          <Label label="Dealer" value={data?.dealerName} />
        </Col>
        <Col lg={24}>
          <Row>
            <Col lg={8}>
              <Label label="Dealer Charges" value={parseFloat(data?.schemeDetails?.dealerCharges).toLocaleString("en-IN", {
                style: "decimal",
                currency: "INR",
              })} />
            </Col>
            <Col lg={8}>
              <Label label="Processing Fees" value={parseFloat(data?.schemeDetails?.processingFees).toLocaleString("en-IN", {
                style: "decimal",
                currency: "INR",
              })} />
            </Col>

            <Col lg={8}>
              <Label label="Buraeu Charges" value={parseFloat(data?.schemeDetails?.buraeucharges).toLocaleString("en-IN", {
                style: "decimal",
                currency: "INR",
              })} />
            </Col>
            <Col lg={8}>
              <Label label="Other Charges" value={parseFloat(data?.schemeDetails?.otherCharges).toLocaleString("en-IN", {
                style: "decimal",
                currency: "INR",
              })} />
            </Col>
            <Col lg={8}>
              <Label label="Start Date" value={data?.schemeDetails?.startDate} />
            </Col>
            <Col lg={8}>
              <Label label="End Date" value={data?.schemeDetails?.endDate} />
            </Col>
            <Col lg={8}>
              <Label label="Scheme Name" value={data?.schemeDetails?.schemeName} />
            </Col>
            <Col lg={8}>
              <Label label="PF Amount Type" value={data?.schemeDetails?.pfAmountType} />
            </Col>
            <Col lg={8}>
              <Label label="Scheme Code" value={data?.schemeDetails?.schemeCode} />
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Row>
        <Col lg={20}>Loan Details</Col>
      </Row>

      <br />
      <Row>
        <>
          <Col lg={8}>
            <Label
              label="Amount Required"
              value={parseFloat(data?.loanDetails?.amountRequired).toLocaleString("en-IN", {
                style: "decimal",
                currency: "INR",
              })}
            />
          </Col>
          <Col lg={8}>
            <Label
              label="Tenure Required"
              value={data?.loanDetails?.tenureRequired}
            />
          </Col>
          <Col lg={8}>
            <Label
              label="ROI Required"
              value={data?.loanDetails?.roiRequired}
            />
          </Col>
        </>
        <Col lg={8}>
          <Label label="EMI" value={Math.ceil(parseInt(data?.loanDetails?.emi)).toLocaleString("en-IN", {
            style: "decimal",
            currency: "INR",
          })} />
        </Col>

        <Col lg={8}>
          <Label
            label="On Road Price"
            value={parseFloat(data?.loanDetails?.onRoadPrice).toLocaleString("en-IN", {
              style: "decimal",
              currency: "INR",
            }) || ""}
          />
        </Col>
        <Col lg={8}>
          <Label
            label="Downpayment"
            value={parseFloat(data?.loanDetails?.downPayment).toLocaleString("en-IN", {
              style: "decimal",
              currency: "INR",
            }) || ""}
          />
        </Col>
      </Row>
    </Spin>
  );
}

export default LoanDetails;
