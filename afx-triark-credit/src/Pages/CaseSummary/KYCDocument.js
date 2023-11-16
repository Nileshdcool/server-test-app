import { Button, Col, Popconfirm, Row, Tag } from "antd";
import React, { useState } from "react";
import rejected from "../../Assets/rejected.png";
import verified from "../../Assets/verified.png";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import {
  getDLAndOtherDocuments,
  saveVerifyStatus,
  negativePincode,
} from "../../Redux/Services/Cases";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import KYCDocumentEdit from "./KYCDocumentEdit";

function KYCDocument(props) {
  const { data, id, caseSummaryData, selfEmployedJourney, getData, docType } = props;
  const [newData, setData] = useState(data);
  const [additionalData, setAdditionalData] = useState({});
  const [loader, setLoader] = useState(false);
  const [negativePin, setNegativePin] = useState("");
  const [flagEdit, setFlagEdit] = React.useState(false);
  const [editSection, setEditSection] = React.useState("");

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

  React.useEffect(() => {
    let flag = true;
    setData(data);
    (async () => {
      if (flag && newData?.pinCode) {
        const negPincode = await negativePincode({
          pincode: newData?.pinCode,
          address: newData?.address1 + " " + newData?.address2,
          applicantUniqueId: id,
        });
        setNegativePin(negPincode);
        flag = false;
      }
    })();
  }, []);

  if (!data) {
    return (
      <div style={{ height: 100 }}>
        <Spin spinning={loader}>{""}</Spin>
      </div>
    );
  }

  const HandleFetchData = async () => {
    await getData();
    setData(data);
    setEditSection("");
    getOtherDocData();
  };

  const getOtherDocData = async () => {
    const documentData = await getDLAndOtherDocuments({
      applicant_uniqueid: id,
    });
    setAdditionalData(documentData?.additionalDetails);
  };
  React.useEffect(() => {
    getOtherDocData();
  }, [id]);

  return (
    <Spin spinning={loader}>
      {editSection === "adhaar" ? (
        <KYCDocumentEdit
          data={data}
          appId={id}
          flagEdit={flagEdit}
          getData={getData}
          setFlagEdit={setFlagEdit}
          otherProps={props}
          docType={docType}
          HandleFetchData={HandleFetchData}
          editSection={editSection}
        />
      ) : (
        <React.Fragment>
          {" "}
          <Row justify="end" align="middle">
            {/* {!(props?.caseFreeze || props?.userFreeze) && (
              <EditOutlined
                onClick={() => {
                  setFlagEdit(true);
                  setEditSection("adhaar");
                }}
              />
            )} */}
          </Row>
          <Row>
            {selfEmployedJourney && (
              <Col lg={8}>
                <Label label="Designation" value={data?.kycDesignation} />
              </Col>
            )}
            <Col lg={8}>
              <Label label="Document Type" value={data?.identityProofType} />
            </Col>
          </Row>
          <Row>
            {data?.identityProofType === "passport" && (
              <Col lg={8}>
                <Label label="File Number" value={data?.identityProofNo} />
              </Col>
            )}
            {data?.identityProofType === "aadhar" && (
              <>
                <Col lg={8}>
                  <Label label="Aadhar Id" value={data?.identityProofNo} />
                </Col>
                {data?.addharName && (
                  <>
                    <Col lg={4}>
                      <Label label="Aadhar Name" value={data?.addharName} />
                    </Col>
                    <Col lg={3}>
                      <Tag color="blue">{data?.panAdharNameMatchStatus}</Tag>
                    </Col>
                  </>
                )}
              </>
            )}
            {data?.identityProofType === "drivingLicense" && (
              <Col lg={8}>
                <Label label="DL No" value={data?.identityProofNo} />
              </Col>
            )}
            {data?.identityProofType === "voterId" && (
              <Col lg={8}>
                <Label label="Epic No" value={data?.identityProofNo} />
              </Col>
            )}
            {data?.identityProofType === "passport" && (
              <Col lg={8}>
                <Label label="Date of Birth" value={data?.dateOfBirth} />
              </Col>
            )}
          </Row>
          <Row>
            <Col lg={4}>
              <Label label="Front" value={front} />
            </Col>
            {data?.filePath[1]?.filePath && (
              <Col lg={4}>
                <Label label="Back" value={back} />
              </Col>
            )}
            <Col lg={1}></Col>
            {data?.filePath && (
              <Col lg={7}>
                {data?.verifyStatus === "Manual Certififed"
                  ? "Manual Verified"
                  : data?.verifyStatus}
                {data?.verifyStatus === "Rejected" ? (
                  <img src={rejected} height="15px" width="15px" />
                ) : (
                  (data?.verifyStatus === "Manual Certififed" ||
                    data?.verifyStatus === "Approved") && (
                    <img src={verified} height="15px" width="15px" />
                  )
                )}
              </Col>
            )}
            {data?.filePath && (
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
            {data?.filePath && (
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
              <Label label="Address Line 1" value={data?.address1} />
            </Col>
            {data?.address2 && (
              <Col lg={8}>
                <Label label="Address Line 2" value={data?.address2} />
              </Col>
            )}
            <Col lg={8}>
              <Label label={"Residence Type"} value={data?.residenceType} />
            </Col>
            <Col lg={8}>
              <Label label="Landmark 1" value={data?.landmark1} />
            </Col>
            <Col lg={8}>
              <Label label="Landmark 2" value={data?.landmark2} />
            </Col>
            <Col lg={3}>
              <Label label="Pin Code" value={data?.pinCode} />
            </Col>
            <Col lg={5} style={{ marginTop: "2.4%" }}>
              {negativePin?.data?.data?.pincodeStatus && (
                <Tag color="red">Negative Area </Tag>
              )}
            </Col>
            <Col lg={8}>
              <Label label="City" value={data?.city} />
            </Col>
            <Col lg={8}>
              <Label label="State" value={data?.state} />
            </Col>
            <Col lg={8}>
              <Label
                label={"Residing at current address since"}
                value={`${data?.kycYear} Years ${data?.kycMonth} Months`}
              />
            </Col>
          </Row>
        </React.Fragment>
      )}

      {editSection === "DL" ? (
        <React.Fragment>
          <hr></hr>
          <KYCDocumentEdit
            data={additionalData?.dlDetails}
            appId={id}
            flagEdit={flagEdit}
            getData={getData}
            setFlagEdit={setFlagEdit}
            otherProps={props}
            docType={docType}
            HandleFetchData={HandleFetchData}
            editSection={editSection}
          />
        </React.Fragment>
      ) : (
        <>
          {/* DL Section */}
          {additionalData?.dlDetails && (
            <>
              <hr></hr>
              <Row justify="end" align="middle">
                {/* {!(props?.caseFreeze || props?.userFreeze) && (
                  <EditOutlined
                    onClick={() => {
                      setFlagEdit(true);
                      setEditSection("DL");
                    }}
                  />
                )} */}
              </Row>
              <Row>
                <Col lg={8}>
                  <Label
                    label="Document Type"
                    value={additionalData?.dlDetails?.identityProofType}
                  />
                </Col>
              </Row>

              <Row>
                <Col lg={8}>
                  <Label
                    label="DL No"
                    value={additionalData?.dlDetails?.identityProofNo}
                  />
                </Col>
                <Col lg={8}>
                  <Label label="Date Of Birth" value={additionalData?.dlDetails?.dateOfBirth} />
                </Col>
              </Row>

              <Row>
                <Col lg={4}>
                  <Label
                    label="Front"
                    value={
                      <img
                        src={getFilePath(
                          additionalData?.dlDetails?.filePath[0]?.filePath
                            ? additionalData?.dlDetails?.filePath[0]?.filePath
                            : ""
                        )}
                        alt="front"
                        height="125px"
                        width="125px"
                      />
                    }
                  />
                </Col>
                {additionalData?.dlDetails?.filePath[1]?.filePath && (
                  <Col lg={4}>
                    <Label
                      label="Back"
                      value={
                        <img
                          src={getFilePath(
                            additionalData?.dlDetails?.filePath[1]?.filePath
                              ? additionalData?.dlDetails?.filePath[1]?.filePath
                              : ""
                          )}
                          alt="Back"
                          height="125px"
                          width="125px"
                        />
                      }
                    />
                  </Col>
                )}
                <Col lg={1}></Col>
                {additionalData?.dlDetails?.filePath && (
                  <Col lg={7}>
                    {additionalData?.dlDetails?.verifyStatus ===
                    "Manual Certififed"
                      ? "Manual Verified"
                      : additionalData?.dlDetails?.verifyStatus}
                    {additionalData?.dlDetails?.verifyStatus === "Rejected" ? (
                      <img src={rejected} height="15px" width="15px" />
                    ) : (
                      (additionalData?.dlDetails?.verifyStatus ===
                        "Manual Certififed" ||
                        additionalData?.dlDetails?.verifyStatus ===
                          "Approved") && (
                        <img src={verified} height="15px" width="15px" />
                      )
                    )}
                  </Col>
                )}
                {additionalData?.dlDetails?.filePath && (
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
                {additionalData?.dlDetails?.filePath && (
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
                  <Label
                    label="Address Line 1"
                    value={additionalData?.dlDetails?.address1}
                  />
                </Col>
                {additionalData?.dlDetails?.address2 && (
                  <Col lg={8}>
                    <Label
                      label="Address Line 2"
                      value={additionalData?.dlDetails?.address2}
                    />
                  </Col>
                )}
                <Col lg={8}>
                  <Label
                    label={"Residence Type"}
                    value={additionalData?.dlDetails?.residenceType}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Landmark 1"
                    value={additionalData?.dlDetails?.landmark1}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Landmark 2"
                    value={additionalData?.dlDetails?.landmark2}
                  />
                </Col>
                <Col lg={3}>
                  <Label
                    label="Pin Code"
                    value={additionalData?.dlDetails?.pinCode}
                  />
                </Col>
                <Col lg={5} style={{ marginTop: "2.4%" }}>
                  {negativePin?.data?.data?.pincodeStatus && (
                    <Tag color="red">Negative Pincode </Tag>
                  )}
                </Col>
                <Col lg={8}>
                  <Label label="City" value={additionalData?.dlDetails?.city} />
                </Col>
                <Col lg={8}>
                  <Label
                    label="State"
                    value={additionalData?.dlDetails?.state}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label={"Residing at current address since"}
                    value={`${additionalData?.dlDetails?.kycYear} Years ${additionalData?.dlDetails?.kycMonth} Months`}
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}

      {editSection === "other" ? (
        <React.Fragment>
          <hr></hr>
          <KYCDocumentEdit
            data={additionalData?.optionalDetails}
            appId={id}
            flagEdit={flagEdit}
            getData={getData}
            setFlagEdit={setFlagEdit}
            otherProps={props}
            docType={docType}
            HandleFetchData={HandleFetchData}
            editSection={editSection}
          />
        </React.Fragment>
      ) : (
        <>
          {/* Other Document section */}
          {additionalData?.optionalDetails && (
            <>
              <hr></hr>
              <Row justify="end" align="middle">
                {/* {!(props?.caseFreeze || props?.userFreeze) && (
                  <EditOutlined
                    onClick={() => {
                      setFlagEdit(true);
                      setEditSection("other");
                    }}
                  />
                )} */}
              </Row>
              <Row>
                <Col lg={8}>
                  <Label
                    label="Document Type"
                    value={additionalData?.optionalDetails?.identityProofType}
                  />
                </Col>
              </Row>

              <Row>
                {additionalData?.optionalDetails?.identityProofType ===
                  "passport" && (
                  <Col lg={8}>
                    <Label
                      label="File Number"
                      value={additionalData?.optionalDetails?.identityProofNo}
                    />
                  </Col>
                )}

                {additionalData?.optionalDetails?.identityProofType ===
                  "voterId" && (
                  <Col lg={8}>
                    <Label
                      label="Epic No"
                      value={additionalData?.optionalDetails?.identityProofNo}
                    />
                  </Col>
                )}
                {additionalData?.optionalDetails?.identityProofType ===
                  "passport" && (
                  <Col lg={8}>
                    <Label
                      label="Date of Birth"
                      value={additionalData?.optionalDetails?.dateOfBirth}
                    />
                  </Col>
                )}
              </Row>

              <Row>
                <Col lg={4}>
                  <Label
                    label="Front"
                    value={
                      <img
                        src={getFilePath(
                          additionalData?.optionalDetails?.filePath[0]?.filePath
                            ? additionalData?.optionalDetails?.filePath[0]
                                ?.filePath
                            : ""
                        )}
                        alt="front"
                        height="125px"
                        width="125px"
                      />
                    }
                  />
                </Col>
                {additionalData?.optionalDetails?.filePath[1]?.filePath && (
                  <Col lg={4}>
                    <Label
                      label="Back"
                      value={
                        <img
                          src={getFilePath(
                            additionalData?.optionalDetails?.filePath[1]
                              ?.filePath
                              ? additionalData?.optionalDetails?.filePath[1]
                                  ?.filePath
                              : ""
                          )}
                          alt="Back"
                          height="125px"
                          width="125px"
                        />
                      }
                    />
                  </Col>
                )}
                <Col lg={1}></Col>
                {additionalData?.optionalDetails?.filePath && (
                  <Col lg={7}>
                    {additionalData?.optionalDetails?.verifyStatus ===
                    "Manual Certififed"
                      ? "Manual Verified"
                      : additionalData?.optionalDetails?.verifyStatus}
                    {additionalData?.optionalDetails?.verifyStatus ===
                    "Rejected" ? (
                      <img src={rejected} height="15px" width="15px" />
                    ) : (
                      (additionalData?.optionalDetails?.verifyStatus ===
                        "Manual Certififed" ||
                        additionalData?.optionalDetails?.verifyStatus ===
                          "Approved") && (
                        <img src={verified} height="15px" width="15px" />
                      )
                    )}
                  </Col>
                )}
                {additionalData?.optionalDetails?.filePath && (
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
                {additionalData?.optionalDetails?.filePath && (
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
                  <Label
                    label="Address Line 1"
                    value={additionalData?.optionalDetails?.address1}
                  />
                </Col>
                {additionalData?.optionalDetails?.address2 && (
                  <Col lg={8}>
                    <Label
                      label="Address Line 2"
                      value={additionalData?.optionalDetails?.address2}
                    />
                  </Col>
                )}
                <Col lg={8}>
                  <Label
                    label={"Residence Type"}
                    value={additionalData?.optionalDetails?.residenceType}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Landmark 1"
                    value={additionalData?.optionalDetails?.landmark1}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Landmark 2"
                    value={additionalData?.optionalDetails?.landmark2}
                  />
                </Col>
                <Col lg={3}>
                  <Label
                    label="Pin Code"
                    value={additionalData?.optionalDetails?.pinCode}
                  />
                </Col>
                <Col lg={5} style={{ marginTop: "2.4%" }}>
                  {negativePin?.data?.data?.pincodeStatus && (
                    <Tag color="red">Negative Pincode </Tag>
                  )}
                </Col>
                <Col lg={8}>
                  <Label
                    label="City"
                    value={additionalData?.optionalDetails?.city}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="State"
                    value={additionalData?.optionalDetails?.state}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label={"Residing at current address since"}
                    value={`${additionalData?.optionalDetails?.kycYear} Years ${additionalData?.optionalDetails?.kycMonth} Months`}
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </Spin>
  );
}

export default KYCDocument;
