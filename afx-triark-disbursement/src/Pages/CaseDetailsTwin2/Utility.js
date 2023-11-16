import { Col, Row, Tag } from "antd";
import React, { useState } from "react";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import { getUtilityDetailsTwin2 } from "../../Redux/Services/caseDetailsTwin2";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { useParams } from "react-router-dom";

const Utility = ({ id }) => {

  const params = useParams();

  const [newData, setNewData] = useState(data);
  const [loader, setLoader] = useState(false);
  const [negativePin, setNegativePin] = useState("");
  const [data, setData] = useState("");


  React.useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getUtilityDetailsTwin2({
        gupdhupId: id,
      });
      setData(response);
      setLoader(false);
    })();
  }, []);

  React.useEffect(() => {
    setNewData(data);
    // (async() => {
    //   setNewData(data);
    //   let flag = true;
    //   if (flag && newData?.pincode) {
    //     const negPincode = await negativePincode({
    //       pincode: newData?.pincode,
    //     });
    //     setNegativePin(negPincode);
    //     flag = false;
    //   }

    // })()
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
      <Row>
        {data?.idProofType && (
          <Col lg={8}>
            <Label label="Document Type" value={newData?.idProofType} />
          </Col>
        )}
      </Row>

      <Row>
        {newData?.idProofType === "Electricity Bill" && (
          <>
            {/* <Col lg={8}>
              <Label
                label="Service Provider"
                value={newData?.serviceProvider}
              />
            </Col> */}
            <Col lg={8}>
              <Label
                label="Consumer Number"
                value={newData?.idProofConsumerId}
              />
            </Col>
          </>
        )}

        {newData?.idProofType === "gas" && (
          <Col lg={8}>
            <Label label="LPG Id" value={newData?.lpgId} />
          </Col>
        )}

        {newData?.idProofType === "landline" && (
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

        {newData?.idProofType === "other" && (
          <Col lg={8}>
            <Label label="" value={newData?.otherResidanceType} />
          </Col>
        )}
      </Row>

      <Row>
        {newData?.filePath && getExt(newData?.filePath) == "pdf" ? (
          <a
            href={`${newData?.addressproofUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getFileName(newData?.filePath)}
          </a>
        ) : (
          <Col lg={9}>
            <img
              src={getFilePath(
                newData?.addressproofUrl ? newData?.addressproofUrl : ""
              )}
              alt="bill"
              height="200px"
              width="200px"
            />
          </Col>
        )}
        {/* <Col lg={7}>
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
        </Col> */}

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
        )} */}
      </Row>
      <Row>
        <Col lg={8}>
          <Label label="" />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Label label="Address" value={newData?.idProofAddress} />
        </Col>
        <Col lg={8}>
          <Label label="Residence Type" value={newData?.residentType} />
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
            <Tag color="red">Negative Pincode </Tag>
          )}
        </Col>
        <Col lg={8}>
          <Label label="City" value={newData?.city} />
        </Col>
        <Col lg={8}>
          <Label label="State" value={newData?.state} />
        </Col>
      </Row>
    </Spin>
  );
};

export default Utility;
