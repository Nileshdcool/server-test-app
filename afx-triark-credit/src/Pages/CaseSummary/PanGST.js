import { Col, Row, Tag } from "antd";
import React, { useState } from "react";
import rejected from "../../Assets/rejected.png";
import verified from "../../Assets/verified.png";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import { saveVerifyStatus, getPanGstDetails } from "../../Redux/Services/Cases";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import PanEdit from "./PanEdit";

function PanGST(props) {
  const { caseSummaryData, selfEmployedJourney } = props;
  const [newData, setNewData] = useState(data);
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [flagEdit, setFlagEdit] = React.useState(true);
  const [isUploaded, setIsUploaded] = React.useState(false);

  const verify = async (value) => {
    setLoader(true);
    const response = await saveVerifyStatus({
      applicantUniqueId: props?.id,
      status: value,
      type: "pan",
    });
    setLoader(false);
    if (!response.data.error) {
      setNewData(response.data.data);
    }
  };
  const pan = (
    <img
      src={getFilePath(newData?.filePath ? newData?.filePath : "")}
      alt="pan"
      height="200px"
      width="300px"
    />
  );
  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoader(true);
    const response = await getPanGstDetails({
      applicantUniqueId: props?.id,
    });
    setData(response?.data?.data);
    setIsUploaded(response?.data?.data?.filePath);
    setLoader(false);
  };

  React.useEffect(() => {
    if (data) {
      setNewData(data);
    }
  }, [data]);

  return (
    <Spin spinning={loader}>
      {flagEdit ? (
        <>
          <Row justify="end" align="middle">
            {/* <EditOutlined
              onClick={() => setFlagEdit(false)}
            /> */}
          </Row>
          <Row>
            <Col lg={8}>
              <Label
                label="Customer Type"
                value={
                  newData?.customerType?.charAt(0).toUpperCase() +
                  newData?.customerType?.slice(1)
                }
              />
            </Col>{" "}
            <Col lg={8}>
              <Label
                label="Document Type"
                value={
                  newData?.documentType?.charAt(0).toUpperCase() +
                  newData?.documentType?.slice(1)
                }
              />
            </Col>
            <Col lg={8}>
              <Label
                label="Occupation Type"
                value={
                  newData?.occupationType?.charAt(0).toUpperCase() +
                  newData?.occupationType?.slice(1)
                }
              />
            </Col>
            {newData?.occupationType == "selfemployed" && (
              <Col lg={8}>
                <Label
                  label="Entity Type"
                  value={
                    newData?.entity?.charAt(0).toUpperCase() +
                    newData?.entity?.slice(1)
                  }
                />
              </Col>
            )}
          </Row>

          <Row>
            <Col lg={7}>
              <Label label={newData?.documentType?.toUpperCase()} value={pan} />
            </Col>

            <Col lg={1}></Col>
            {newData?.filePath && (
              <Col lg={7}>
                {newData?.verifyStatus === "Manual Certififed"
                  ? "Manual Verified"
                  : newData?.verifyStatus}
                {newData?.verifyStatus === "Rejected" ? (
                  <img
                    style={{ marginLeft: 10 }}
                    src={rejected}
                    height="15px"
                    width="15px"
                  />
                ) : (
                  (newData?.verifyStatus === "Manual Certififed" ||
                    newData?.verifyStatus === "Approved") && (
                    <img
                      style={{ marginLeft: 10 }}
                      src={verified}
                      height="15px"
                      width="15px"
                    />
                  )
                )}
              </Col>
            )}
          </Row>

          <Row>
            {newData?.panNumber && (
              <Col lg={8}>
                <Label label="PAN Number" value={newData?.panNumber} />
              </Col>
            )}
            <Col lg={8}>
              <Label
                label={
                  selfEmployedJourney
                    ? "Date of Incorporation"
                    : "Date of Birth"
                }
                value={newData?.dateOfBirth}
              />
            </Col>
            <Col lg={8}>
              <Label label="Name" value={newData?.panName} />
            </Col>
            {selfEmployedJourney ? (
              newData?.gst && (
                <Col lg={8}>
                  <Label label="GST" value={newData?.gst} />
                </Col>
              )
            ) : (
              <Col lg={8}>
                <Label label="Gender" value={newData?.gender} />
              </Col>
            )}
            {newData?.karzaLosNameMatchStatus && (
              <Col lg={8}>
                <Label
                  label="Name Match Status"
                  value={
                    <Tag color="blue">{newData?.karzaLosNameMatchStatus}</Tag>
                  }
                />
              </Col>
            )}
          </Row>
        </>
      ) : (
        <>
          <PanEdit
            data={newData}
            setFlagEdit={setFlagEdit}
            getData={getData}
          />
        </>
      )}
    </Spin>
  );
}

export default PanGST;
