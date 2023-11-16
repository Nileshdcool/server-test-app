import { Col, Row, Tabs } from "antd";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import Spin from "../../Components/Spin";
import Label from "../../Components/label";
import Tables from "../../Components/Table";
import { ckycListing } from "../../Redux/Services/Cases";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";

function CKYCDocument(props) {
  const [summaryData, setSummaryData] = useState([]);
  const [applicantUniqueId, setApplicantUniqueId] = useState(null);
  const [preDisbursalData, setPreDisbursalData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { TabPane } = Tabs;

  const userFreeze = props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze =
    props.caseSummaryData?.mainapplicant[0]?.disbursementFreeze;

    function checkURL(url) {
      return url.match(/\.(jpeg|jpg|png|JPEG|JPG|PNG|png)$/) != null;
    }

  const getImage = (filePath = "") =>
    checkURL(filePath) ? (
      <>
        <a target="_blank" href={getFilePath(filePath)}>
          <img
            src={getFilePath(filePath ? filePath : "")}
            height="200px"
            width="300px"
          />
        </a>
      </>
    ) : (
      <a href={getFilePath(filePath)} target="_blank" rel="noopener noreferrer">
        {filePath?.split("/")?.pop()}
      </a>
    );

  useEffect(() => {
    if (applicantUniqueId) {
      getData(applicantUniqueId);
    }
  }, applicantUniqueId);



  const getData = async (id) => {
    const response = await ckycListing({
      applicantUniqueId: id,
    });

    const data = [
      {
        docName: "Consumer Photo",
        fos: {
          photoFilePath: response?.data?.data?.fos?.photoFilePath,
        },

        ckyc: {
          ckycPhotoFilePath: response?.data?.data?.ckyc?.ckycPhotoFilePath,
        },
      },
      {
        docName: "Aadhaar",
        fos: {
          aadhaarId: response?.data?.data?.fos?.aadhaarId,
          aadhaarFrontFilePath: response?.data?.data?.fos?.aadhaarFrontFilePath,
          aadhaarBackFilePath: response?.data?.data?.fos?.aadhaarBackFilePath,
        },
        ckyc: {
          ckycAadhaarId: response?.data?.data?.ckyc?.ckycAadhaarId,
          ckycAadhaarFilePath: response?.data?.data?.ckyc?.ckycAadhaarFilePath,
        },
      },
      {
        docName: "PAN",
        fos: {
          panNumber: response?.data?.data?.fos?.panNumber,
          panFilePath: response?.data?.data?.fos?.panFilePath,
        },
        ckyc: {
          ckycPANNumber: response?.data?.data?.ckyc?.ckycPANNumber,
          ckycPanFilePath: response?.data?.data?.ckyc?.ckycPanFilePath,
        },
      },
      {
        docName: "Voter",
        fos: {
          voterId: response?.data?.data?.fos?.voterId,
          voterFrontFilePath: response?.data?.data?.fos?.voterFrontFilePath,
          voterBackFilePath: response?.data?.data?.fos?.voterBackFilePath,
        },
        ckyc: {
          ckycVoterId: response?.data?.data?.ckyc?.ckycVoterId,
          ckycVoterIdFilePath: response?.data?.data?.ckyc?.ckycVoterIdFilePath,
        },
      },
      {
        docName: "Driving License",
        fos: {
          drivingLicenceNumber: response?.data?.data?.fos?.drivingLicenceNumber,
          drivingLicenceFrontFilePath:
            response?.data?.data?.fos?.drivingLicenceFrontFilePath,
        },
        ckyc: {
          ckycDrivingLicenceNumber:
            response?.data?.data?.ckyc?.ckycDrivingLicenceNumber,
          ckycDlFilePath: response?.data?.data?.ckyc?.ckycDlFilePath,
        },
      },
      {
        docName: "Passport",
        fos: {
          passportNumber: response?.data?.data?.fos?.passportNumber,
          passportFrontFilePath:
            response?.data?.data?.fos?.passportFrontFilePath,
          passportBackFilePath: response?.data?.data?.fos?.passportBackFilePath,
        },
        ckyc: {
          ckycPassportNumber: response?.data?.data?.ckyc?.ckycPassportNumber,
          ckycPassportFilePath:
            response?.data?.data?.ckyc?.ckycPassportFilePath,
        },
      },
      {
        docName: "Other Document",
        fos: {
          otherIdNumber: response?.data?.data?.fos?.otherIdNumber,
          otherFilePath: response?.data?.data?.fos?.otherFilePath,
        },
        ckyc: {},
      },
    ];
    setPreDisbursalData(data);
  };

  useEffect(() => {
    if (!isEmpty(props?.caseSummaryData)) {
      setSummaryData([
        {
          id: props?.caseSummaryData?.mainapplicant[0]?.applicantUniqueId,
          title: `Main App - ${props?.caseSummaryData?.mainapplicant[0]?.customerName} `,
          isMainApp: true,
        },
        ...props?.caseSummaryData?.coapplicant?.map((item, index) => {
          return {
            id: item.coapplicantUniqueId,
            title: `Co App ${index + 1} - ${item?.customerName}`,
            isMainApp: false,
          };
        }),
        ...props?.caseSummaryData?.gurantor?.map((item, index) => {
          return {
            id: item.coapplicantUniqueId,
            title: `Guarantor ${index + 1} - ${item?.customerName}`,
            isMainApp: false,
          };
        }),
      ]);
      if (props?.caseSummaryData?.mainapplicant[0]?.applicantUniqueId) {
        setApplicantUniqueId(
          props?.caseSummaryData?.mainapplicant[0]?.applicantUniqueId
        );
      }
    }
  }, []);

  const columns = [
    {
      title: "Document",
      dataIndex: "docName",
      key: "docName",
      width: 200,
    },
    {
      title: "FOS",
      key: "fos",
      align: "left",
      width: 250,
      render: (item, record) => {
        return (
          <Row gutter={[24, 16]}>
            {record?.fos?.photoFilePath && (
              <Col>
                <Label label="" value={getImage(record?.fos?.photoFilePath)} />
              </Col>
            )}{" "}
            {record?.fos?.aadhaarId && (
              <Col>
                <Label label="Aadhaar Id" value={record?.fos?.aadhaarId} />
              </Col>
            )}
            {record?.fos?.aadhaarFrontFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.fos?.aadhaarFrontFilePath)}
                />
              </Col>
            )}{" "}
            {record?.fos?.aadhaarBackFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.fos?.aadhaarBackFilePath)}
                />
              </Col>
            )}{" "}
            {record?.fos?.panNumber && (
              <Col>
                <Label label="Pan Number" value={record?.fos?.panNumber} />
              </Col>
            )}{" "}
            {record?.fos?.panFilePath && (
              <Col>
                <Label label="" value={getImage(record?.fos?.panFilePath)} />
              </Col>
            )}{" "}
            {record?.fos?.voterId && (
              <Col>
                <Label label="Voter Id" value={record?.fos?.voterId} />
              </Col>
            )}{" "}
            {record?.fos?.voterFrontFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.fos?.voterFrontFilePath)}
                />
              </Col>
            )}{" "}
            {record?.fos?.voterBackFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.fos?.voterBackFilePath)}
                />
              </Col>
            )}{" "}
            {record?.fos?.passportNumber && (
              <Col>
                <Label label="Voter Id" value={record?.fos?.passportNumber} />
              </Col>
            )}{" "}
            {record?.fos?.passportFrontFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.fos?.passportFrontFilePath)}
                />
              </Col>
            )}{" "}
            {record?.fos?.passportBackFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.fos?.passportBackFilePath)}
                />
              </Col>
            )}{" "}
            {record?.fos?.drivingLicenceNumber && (
              <Col>
                <Label
                  label="Driving Licence Number"
                  value={record?.fos?.drivingLicenceNumber}
                />
              </Col>
            )}{" "}
            {record?.fos?.drivingLicenceFrontFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.fos?.drivingLicenceFrontFilePath)}
                />
              </Col>
            )}{" "}
            {record?.fos?.otherIdNumber && (
              <Col>
                <Label label="other Id" value={record?.fos?.otherIdNumber} />
              </Col>
            )}{" "}
            {record?.fos?.otherFilePath && (
              <Col>
                <Label label="" value={getImage(record?.fos?.otherFilePath)} />
              </Col>
            )}
          </Row>
        );
      },
    },
    {
      title: "C-KYC",
      key: "ckyc",
      align: "left",
      width: 250,
      render: (item, record) => {
        return (
          <Row gutter={[24, 16]}>
            {record?.ckyc?.ckycPhotoFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.ckyc?.ckycPhotoFilePath)}
                />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycAadhaarId && (
              <Col>
                <Label
                  label="CKYC Aadhar Id"
                  value={record?.ckyc?.ckycAadhaarId}
                />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycAadhaarFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.ckyc?.ckycAadhaarFilePath)}
                />
              </Col>
            )}
            {record?.ckyc?.ckycPANNumber && (
              <Col>
                <Label label="PAN Number" value={record?.ckyc?.ckycPANNumber} />
              </Col>
            )}
            {record?.ckyc?.ckycPanFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.ckyc?.ckycPanFilePath)}
                />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycPassportNumber && (
              <Col>
                <Label
                  label="Passport Number"
                  value={record?.ckyc?.ckycPassportNumber}
                />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycPassportFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.ckyc?.ckycPassportFilePath)}
                />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycDrivingLicenceNumber && (
              <Col>
                <Label
                  label="Driving Licence Number"
                  value={record?.ckyc?.ckycDrivingLicenceNumber}
                />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycDlFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.ckyc?.ckycDlFilePath)}
                />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycVoterId && (
              <Col>
                <Label label="Voter Id" value={record?.ckyc?.ckycVoterId} />
              </Col>
            )}{" "}
            {record?.ckyc?.ckycVoterIdFilePath && (
              <Col>
                <Label
                  label=""
                  value={getImage(record?.ckyc?.ckycVoterIdFilePath)}
                />
              </Col>
            )}
          </Row>
        );
      },
    },
  ];
  
  return (
    <Tabs
      onChange={(e) => {
        setApplicantUniqueId(e);
      }}
    >
      {summaryData.map((item, index) => (
        <TabPane tab={`${item.title}`} key={`${item.id}`}>
          <Spin spinning={loader}>
            <Tables
              pagination={false}
              columns={columns}
              scroll={{ x: 1000 }}
              dataSource={preDisbursalData}
            />
          </Spin>
        </TabPane>
      ))}
    </Tabs>
  );
}

export default CKYCDocument;
