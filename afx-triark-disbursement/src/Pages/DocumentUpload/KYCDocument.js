import { Button, Col, Popconfirm, Row, Tag } from "antd";
import React, { useState } from "react";
import rejected from "../../Assets/rejected.png";
import verified from "../../Assets/verified.png";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import { saveVerifyStatus, negativePincode } from "../../Redux/Services/Cases";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";

function KYCDocument({ data, id, caseSummaryData, selfEmployedJourney }) {
  const [newData, setData] = useState(data);
  const [loader, setLoader] = useState(false);
  const [negativePin, setNegativePin] = useState("");

  const userFreeze = caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = caseSummaryData?.mainapplicant[0]?.creditFreeze;
  const verify = async (value) => {
    setLoader(true);
    const response = await saveVerifyStatus({
      applicantUniqueId: id,
      status: value,
      type: "kyc",
    });
    if (!response.data.error) {
      if (response?.data?.data?.filePath) {
        response.data.data.filePath = response?.data?.data?.filePath
          ? JSON.parse(response?.data?.data?.filePath)
          : "";
      }
      setData(response.data.data);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const front = (
    <img
      src={getFilePath(
        newData?.filePath[0]?.filePath ? newData?.filePath[0]?.filePath : ""
      )}
      alt="front"
      height="125px"
      width="125px"
    />
  );

  const back = (
    <img
      src={getFilePath(
        newData?.filePath[1]?.filePath ? newData?.filePath[1]?.filePath : ""
      )}
      alt="back"
      height="125px"
      width="125px"
    />
  );
  // React.useEffect( () => {
  //   (async() => {

  //     let flag = true;
  //     setData(data);
  //     if (flag && newData?.pinCode) {
  //       const negPincode = await negativePincode({
  //         pincode: newData?.pinCode,
  //       });
  //       setNegativePin(negPincode);
  //       flag = false;
  //     }
  //   })()
  // }, [data]);

  if (!data) {
    return (
      <div style={{ height: 100 }}>
        <Spin spinning={loader}>{""}</Spin>
      </div>
    );
  }
  if (!data) {
    return <></>;
  } else {
    return (
      <Spin spinning={loader}>
        <Row>
          {selfEmployedJourney && (
            <Col lg={8}>
              <Label label="Designation" value={newData?.kycDesignation} />
            </Col>
          )}
          <Col lg={8}>
            <Label label="Document Type" value={newData?.identityProofType} />
          </Col>
        </Row>

        <Row>
          {newData?.identityProofType === "passport" && (
            <Col lg={8}>
              <Label label="File Number" value={newData?.identityProofNo} />
            </Col>
          )}
          {newData?.identityProofType === "aadhar" && (
            <>
              <Col lg={8}>
                <Label label="Aadhar Id" value={newData?.identityProofNo} />
              </Col>
              {newData?.addharName && (
                <>
                  <Col lg={4}>
                    <Label label="Aadhar Name" value={newData?.addharName} />
                  </Col>
                  <Col lg={3}>
                    {/* <Label label="" value={newData?.panAdharNameMatchStatus} /> */}
                    <Tag color="blue">{newData?.panAdharNameMatchStatus}</Tag>
                  </Col>
                </>
              )}
            </>
          )}
          {newData?.identityProofType === "drivingLicense" && (
            <Col lg={8}>
              <Label label="DL No" value={newData?.identityProofNo} />
            </Col>
          )}
          {newData?.identityProofType === "voterId" && (
            <Col lg={8}>
              <Label label="Epic No" value={newData?.identityProofNo} />
            </Col>
          )}
          {newData?.identityProofType === "passport" && (
            <Col lg={8}>
              <Label label="Date of Birth" value={newData?.dateOfBirth} />
            </Col>
          )}
        </Row>

        <Row>
          <Col lg={4}>
            <Label label="Front" value={front} />
          </Col>
          {newData?.filePath[1]?.filePath && (
            <Col lg={4}>
              <Label label="Back" value={back} />
            </Col>
          )}
          <Col lg={1}></Col>
          {newData?.filePath && (
            <Col lg={7}>
              {newData?.verifyStatus === "Manual Certififed"
                ? "Manual Verified"
                : newData?.verifyStatus}
              {newData?.verifyStatus === "Rejected" ? (
                <img src={rejected} height="15px" width="15px" />
              ) : (
                (newData?.verifyStatus === "Manual Certififed" ||
                  newData?.verifyStatus === "Approved") && (
                  <img src={verified} height="15px" width="15px" />
                )
              )}
            </Col>
          )}
          {newData?.filePath && (
            <Col>
              <Popconfirm
                title="Are you sure you want to change the document verification status to Manual Verify? "
                onConfirm={() => {
                  verify("Manual Certififed");
                }}
                okText="Yes"
                cancelText="No"
              >
                {!(userFreeze || caseFreeze) && (
                  <Button className="reset-button marginRight10">
                    Manual Verify
                  </Button>
                )}
              </Popconfirm>
            </Col>
          )}
          {newData?.filePath && (
            <Col>
              <Popconfirm
                title="Are you sure you want to change the document verification status to Rejected? "
                onConfirm={() => {
                  verify("Rejected");
                }}
                okText="Yes"
                cancelText="No"
              >
                {!(userFreeze || caseFreeze) && (
                  <Button className="reset-button">Rejected</Button>
                )}
              </Popconfirm>
            </Col>
          )}
        </Row>

        <Row>
          <Col lg={8}>
            <Label label="Address Line 1" value={newData?.address1} />
          </Col>
          {newData?.address2 && (
            <Col lg={8}>
              <Label label="Address Line 2" value={newData?.address2} />
            </Col>
          )}
          <Col lg={8}>
            <Label
              // label={selfEmployedJourney ? "Office Type" : "Residence Type"}
              label={"Residence Type"}
              value={newData?.residenceType}
            />
          </Col>
          {/* {newData?.landmark1 && ( */}
          <Col lg={8}>
            <Label label="Landmark 1" value={newData?.landmark1} />
          </Col>
          {/* )} */}
          {/* {newData?.landmark2 && ( */}
          <Col lg={8}>
            <Label label="Landmark 2" value={newData?.landmark2} />
          </Col>
          {/* )} */}
          {/* <Col lg={8}>
            <Label label="PIN Code" value={newData?.pinCode} />
          </Col> */}
          <Col lg={3}>
            <Label label="Pin Code" value={newData?.pinCode} />
          </Col>
          <Col lg={5} style={{ marginTop: "2.4%" }}>
            {negativePin?.data?.data?.pincodeStatus && (
              <Tag color="red">Negative Pincode </Tag>
            )}
          </Col>
          <Col lg={8}>
            <Label label="City" value={newData?.city} />
          </Col>
          <Col lg={8}>
            <Label label="State" value={newData?.state} />
          </Col>
          <Col lg={8}>
            <Label
              label={"Residing at current address since"}
              value={`${newData?.kycYear} Years ${newData?.kycMonth} Months`}
            />
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default KYCDocument;
