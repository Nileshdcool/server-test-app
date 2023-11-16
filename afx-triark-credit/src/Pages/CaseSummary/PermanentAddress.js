import { Col, Row, Tag } from "antd";
import React from "react";
import Label from "../../Components/label";
import { negativePincode } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import PermanentAddressEdit from "./PermanentAddressEdit";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";

function PermanentAddress(props) {
  const [negativePin, setNegativePin] = React.useState("");
  const [flagEdit, setFlagEdit] = React.useState(true);
  
  let params = useParams();
  React.useEffect(() => {
    let flag = true;
    (async () => {
      if (flag && props?.data?.pinCode) {
        const negPincode = await negativePincode({
          pincode: props?.data?.pinCode,
          address: props?.data?.address1 + " " + props?.data?.address2,
          applicantUniqueId: params?.id,
        });
        setNegativePin(negPincode);
        flag = false;
      }
    })();
  }, []);

  const getPincode = async () => {
    const negPincode = await negativePincode({
      pincode: props?.data?.pinCode,
      address: props?.data?.address1 + " " + props?.data?.address2,
      applicantUniqueId: params?.id,
    });
    setNegativePin(negPincode);
  };

  const currentAddress = (
    <img
      src={getFilePath(
        props?.data?.currentAddressFilePath
          ? props?.data?.currentAddressFilePath
          : ""
      )}
      alt="Address Proof ID"
      height="200px"
      width="300px"
    />
  );
  
  const currentAddressBack = (
    <img
      src={getFilePath(
        props?.data?.currentAddressFilePathBack
          ? props?.data?.currentAddressFilePathBack
          : ""
      )}
      alt="Address Proof ID"
      height="200px"
      width="300px"
    />
  );

  return (
    <>
      {flagEdit ? (
        <>
          <Row justify="end" align="middle">
            {/* {!(props?.caseFreeze || props?.userFreeze) && (
              <EditOutlined
                onClick={() => setFlagEdit(false)}
                getData={props?.getData}
              />
            )} */}
          </Row>
          <Row>
            <Col lg={7}>
              <Label label={""} value={currentAddress} />
            </Col>
            <Col md={5} lg={4} xl={2} />
            <Col lg={7}>
              <Label label={""} value={currentAddressBack} />
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Label label="Address Line 1" value={props?.data?.address1} />
            </Col>
            <Col lg={8}>
              <Label label="Address Line 2" value={props?.data?.address2} />
            </Col>
            <Col lg={8}>
              <Label label="Landmark 1" value={props?.data?.landmark1} />
            </Col>
            <Col lg={8}>
              <Label label="Landmark 2" value={props?.data?.landmark2} />
            </Col>
            <Col lg={3}>
              <Label label="PIN Code" value={props?.data?.pinCode} />
            </Col>
            <Col lg={5} style={{ marginTop: "2.4%" }}>
              {negativePin?.data?.data?.pincodeStatus && (
                <Tag color="red">Negative Area </Tag>
              )}
            </Col>
            <Col lg={8}>
              <Label label="City" value={props?.data?.city} />
            </Col>
            <Col lg={8}>
              <Label label="State" value={props?.data?.state} />
            </Col>{" "}
            <Col lg={8}>
              <Label
                label="Residence Type"
                value={props?.data?.residenceType}
              />
            </Col>
            <Col lg={8}>
              <Label
                label="Residing at current address since"
                value={`${props?.data?.permaYear || 0} Years ${
                  props?.data?.permaMonth || 0
                } Months`}
              />
            </Col>
          </Row>{" "}
        </>
      ) : (
        <PermanentAddressEdit
          data={props?.data}
          setFlagEdit={setFlagEdit}
          flagEdit={flagEdit}
          getData={props?.getData}
          getPincode={getPincode}
          appId={params?.id}
        />
      )}
    </>
  );
}

export default PermanentAddress;
