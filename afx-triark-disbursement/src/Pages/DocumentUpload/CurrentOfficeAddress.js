import React, { useState } from "react";
import { Row, Col, Tag } from "antd";
import Label from "../../Components/label";
import { negativePincode } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";


function CurrentOfficeAddress(data) {
  const [negativePin, setNegativePin] = useState("");
  let flag = true;
  let { id } = useParams();
  const [flagEdit, setFlagEdit] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      if (flag && data?.data?.pinCode) {
        const negPincode = await negativePincode({
          pincode: data?.data?.pinCode,
          address: data?.data?.address1 + " " + data?.data?.address2,
          applicantUniqueId: id,
        });
        setNegativePin(negPincode);
        flag = false;
      }
    })();
  }, []);

  const NegativePincode = async () => {
    const negPincode = await negativePincode({
      pincode: data?.data?.pinCode,
      address: data?.data?.address1 + " " + data?.data?.address2,
      applicantUniqueId: id,
    });
    setNegativePin(negPincode);
  };

  return (
    <>
     
          <Row>
            <Col lg={8}>
              <Label label="Address Line 1" value={data?.data?.address1} />
            </Col>
            <Col lg={8}>
              <Label label="Address Line 2" value={data?.data?.address2} />
            </Col>

            <Col lg={8}>
              <Label label="Landmark 1" value={data?.data?.landmark1} />
            </Col>

            <Col lg={8}>
              <Label label="Landmark 2" value={data?.data?.landmark2} />
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <Label label="Pin Code" value={data?.data?.pinCode} />
            </Col>
            <Col lg={5} style={{ marginTop: "2.4%" }}>
              {negativePin?.data?.data?.pincodeStatus && (
                <Tag color="red">Negative Area </Tag>
              )}
            </Col>
            <Col lg={8}>
              <Label label="City" value={data?.data?.city} />
            </Col>
            <Col lg={8}>
              <Label label="State" value={data?.data?.state} />
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Label label="Residence Type" value={data?.data?.officeType} />
            </Col>
            <Col lg={8}>
              <Label
                label="Business at Current Address since"
                value={`${data?.data?.officeYear} Years ${data?.data?.officeMonth} Months`}
              />
            </Col>
          </Row>
        </>
  
  );
}

export default CurrentOfficeAddress;
