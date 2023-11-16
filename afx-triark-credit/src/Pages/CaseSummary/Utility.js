import { Button, Col, Popconfirm, Row, Tag } from "antd";
import React, { useState } from "react";
import rejected from "../../Assets/rejected.png";
import verified from "../../Assets/verified.png";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import {
  saveVerifyStatus,
  negativePincode,
  getUltilityDetails,
} from "../../Redux/Services/Cases";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { BASE } from "../../Redux/Utils/httpInterceptor";
import { EditOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import UtilityEdit from "./UtilityEdit";

const Utility = (props) => {
  const { caseSummaryData, id } = props;
  const userFreeze = caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = caseSummaryData?.mainapplicant[0]?.creditFreeze;
  const [flagEdit, setFlagEdit] = React.useState(true);
  const params = useParams();
  const [newData, setNewData] = useState(data);
  const [loader, setLoader] = useState(false);
  const [negativePin, setNegativePin] = useState("");
  const [data, setData] = useState("");

  const verify = async (value) => {
    setLoader(true);
    const response = await saveVerifyStatus({
      applicantUniqueId: id,
      status: value,
      type: "utility",
    });
    setLoader(false);
    if (!response.data.error) {
    }
  };

  const getUtilityDoc = () => {
    (async () => {
      setLoader(true);
      const response = await getUltilityDetails({
        applicantUniqueId: id,
      });
      setData(response?.data?.data);
      setLoader(false);
    })();
  };

  React.useEffect(() => {
    getUtilityDoc();
  }, []);

  React.useEffect(() => {
    setNewData(data);
  }, [data]);

  const getExt = (filename) => {
    if (filename) {
      return filename?.split(".")?.pop();
    }
  };

  const getFileName = (filename) => {
    if (filename) {
      return filename?.split("/").pop();
    }
  };

  return (
    <Spin spinning={loader}>
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
            {data?.billType && (
              <Col lg={8}>
                <Label label="Document Type" value={newData?.billType} />
              </Col>
            )}
          </Row>

          <Row>
            {newData?.billType === "electricity" && (
              <>
                <Col lg={8}>
                  <Label
                    label="Service Provider"
                    value={newData?.serviceProvider}
                  />
                </Col>
                <Col lg={8}>
                  <Label label="Consumer Number" value={newData?.billNumer} />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Consumer Name"
                    value={newData?.idProofConsumerName}
                  />
                </Col>
              </>
            )}
            {newData?.billType === "gas" && (
              <Col lg={8}>
                <Label label="LPG Id" value={newData?.lpgId} />
              </Col>
            )}
            {newData?.billType === "landline" && (
              <>
                <Col lg={4}>
                  <Label label="STD" value={newData?.std} />
                </Col>
                <Col lg={4}>
                  <Label label="Number" value={newData?.landLineNumber} />
                </Col>
                <Col lg={4}>
                  <Label label="City" value={newData?.landLineCity} />
                </Col>
              </>
            )}

            {newData?.billType === "other" && (
              <Col lg={8}>
                <Label label="" value={newData?.otherResidanceType} />
              </Col>
            )}
          </Row>

          <Row>
            {newData?.filePath && getExt(newData?.filePath) == "pdf" ? (
              <>
                <Col>
                  <a
                    href={`${newData?.filePath?.replace(
                      "/var/www/html",
                      BASE
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getFileName(newData?.filePath)}
                  </a>
                </Col>
                <Col span={2}></Col>
                <Col>
                  <a
                    href={`${newData?.filePath?.replace(
                      "/var/www/html",
                      BASE
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getFileName(newData?.filePathBack)}
                  </a>
                </Col>
              </>
            ) : (
              <>
                <Col>
                  <img
                    src={getFilePath(
                      newData?.filePath ? newData?.filePath : ""
                    )}
                    alt="bill"
                    height="200px"
                    width="270px"
                  />
                </Col>
                <Col lg={1}></Col>
                <Col>
                  <img
                    src={getFilePath(
                      newData?.filePathBack ? newData?.filePathBack : ""
                    )}
                    alt="bill"
                    height="200px"
                    width="270px"
                  />
                </Col>
              </>
            )}
            <Col>
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

            {newData?.filePath && (
              <Col style={{ marginLeft: 10 }}>
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
            <Col lg={4}>
              <Label
                label="FI/CPV waiver for"
                value={
                  newData?.addressType?.toLowerCase() === "currentaddress"
                    ? "Current Address"
                    : newData?.addressType?.toLowerCase() === "permanentaddress"
                    ? "Permanent Address"
                    : ""
                }
              />
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Label label="Address Line 1" value={newData?.address1} />
            </Col>
            <Col lg={8}>
              <Label label="Address Line 2" value={newData?.address2} />
            </Col>
            <Col lg={8}>
              <Label label="Landmark 1" value={newData?.landmark1} />
            </Col>
            <Col lg={8}>
              <Label label="Landmark 2" value={newData?.landmark2} />
            </Col>
            <Col lg={8}>
              <Label label="Residence Type" value={newData?.residenceType} />
            </Col>
            <Col lg={4}>
              <Label label="Pin Code" value={newData?.pincode} />
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
            <Col lg={8}>
              <Label label="City" value={newData?.city} />
            </Col>
            <Col lg={8}>
              <Label label="State" value={newData?.state} />
            </Col>
          </Row>
        </>
      ) : (
        <UtilityEdit
          data={newData}
          appId={id}
          getUtilityDoc={getUtilityDoc}
          setFlagEdit={setFlagEdit}
        />
      )}
    </Spin>
  );
};

export default Utility;
