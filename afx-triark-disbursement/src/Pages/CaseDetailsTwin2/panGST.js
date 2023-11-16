import { Button, Col, Popconfirm, Row } from "antd";
import React, { useState } from "react";
import rejected from "../../Assets/rejected.png";
import verified from "../../Assets/verified.png";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import { saveVerifyStatus, getPanGstDetails } from "../../Redux/Services/Cases";
import { getPANDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { useParams } from "react-router-dom";

function panGST(props) {
  const { selfEmployedJourney } = props;
  const [newData, setNewData] = useState(data);
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);

  const params = useParams();

  const verify = async (value) => {
    // setLoader(true);
    // const response = await saveVerifyStatus({
    //   applicantUniqueId: props?.id,
    //   status: value,
    //   type: "pan",
    // });
    // setLoader(false);
    // if (!response.data.error) {
    //   setNewData(response.data.data);
    // }
  };
  const pan = (
    <img
      src={getFilePath(newData?.panImgUrl ? newData?.panImgUrl : "")}
      alt="pan"
      height="200px"
      width="300px"
    />
  );
  React.useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getPANDetailsTwin2({
        gupdhupId: props?.id,
      });
      setData(response);
      setLoader(false);
    })();
  }, []);

  React.useEffect(() => {
    if (data) {
      setNewData(data);
    }
  }, [data]);

  return (
    <Spin spinning={loader}>
      <Row>
        <Col lg={8}>
          <Label
            label="Occupation Type"
            value={
              newData?.occupationtype?.charAt(0).toUpperCase() +
              newData?.occupationtype?.slice(1)
            }
          />
        </Col>
      </Row>

      <Row>
        <Col lg={7}>
          <Label label={newData?.documentType?.toUpperCase()} value={pan} />
        </Col>

        <Col lg={1}></Col>
        {/* {newData?.filePath && (
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
        )} */}
        {/* {newData?.filePath && (
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
                <Button className="reset-button marginRight10 ">
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
                <Button className="reset-button ">Rejected</Button>
              )}
            </Popconfirm>
          </Col>
        )} */}
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
              selfEmployedJourney ? "Date of Incorporation" : "Date of Birth"
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
      </Row>
    </Spin>
  );
}

export default panGST;
