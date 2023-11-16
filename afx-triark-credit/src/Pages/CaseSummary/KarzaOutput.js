import { Col, Row, Tabs } from "antd";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import Spin from "../../Components/Spin";
import Label from "../../Components/label";
import Tables from "../../Components/Table";
import { getKarzaOutput } from "../../Redux/Services/Cases";

function KarzaOutput(props) {
  const [summaryData, setSummaryData] = useState([]);
  const [applicantUniqueId, setApplicantUniqueId] = useState(null);
  const [preDisbursalData, setPreDisbursalData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { TabPane } = Tabs;

  useEffect(() => {
    if (applicantUniqueId) {
      getData(applicantUniqueId);
    }
  }, applicantUniqueId);

  const getData = async (id) => {
    setLoader(true);
    const response = await getKarzaOutput({
      applicantUniqueId: id,
    });
    setLoader(false);
    const data = [
      {
        docName: "PAN",
        data: {
          panName: response?.data?.data?.PAN?.panName || "-",
          panNumber: response?.data?.data?.PAN?.panNumber || "-",
          dateOfBirth: response?.data?.data?.PAN?.dateOfBirth || "-",
          verifyStatus: response?.data?.data?.PAN?.verifyStatus || "-",
        },
      },
      {
        docName: "Aadhar",
        data: {
          aadharName: response?.data?.data?.Aadhar?.aadharName || "-",
          aadharId: response?.data?.data?.Aadhar?.aadharId || "-",
          address: response?.data?.data?.Aadhar?.address || "-",
          verifyStatus: response?.data?.data?.Aadhar?.verifyStatus || "-",
        },
      },
      {
        docName: "Voter",
        data: {
          epicNumber: response?.data?.data?.Voter?.epicNumber || "-",
          address: response?.data?.data?.Voter?.address || "-",
          verifyStatus: response?.data?.data?.Voter?.verifyStatus || "-",
        },
      },
      {
        docName: "Driving License",
        data: {
          address: response?.data?.data?.DrivingLicense?.address || "-",
          drivingLicenseNumber:
            response?.data?.data?.DrivingLicense?.drivingLicenseNumber || "-",
          dateOfBirth:
            response?.data?.data?.DrivingLicense?.dateOfBirthdateOfBirth || "-",
          verifyStatus:
            response?.data?.data?.DrivingLicense?.verifyStatus || "-",
        },
      },
      {
        docName: "Passport",
        data: {
          address: response?.data?.data?.Passport?.address || "-",
          dateOfBirth: response?.data?.data?.Passport?.dateOfBirth || "-",
          passportNumber: response?.data?.data?.Passport?.passportNumber || "-",
          verifyStatus: response?.data?.data?.Passport?.verifyStatus || "-",
        },
      },
      {
        docName: "Electricity Bill",
        data: {
          billNumer:
            response?.data?.data?.["Electricity Bill"]?.billNumer || "-",
          address: response?.data?.data?.["Electricity Bill"]?.address || "-",
          consumerNumber:
            response?.data?.data?.["Electricity Bill"]?.consumerNumber || "-",
          serviceProvider:
            response?.data?.data?.["Electricity Bill"]?.serviceProvider || "-",
          verifyStatus:
            response?.data?.data?.["Electricity Bill"]?.verifyStatus || "-",
        },
      },
      {
        docName: "GAS",
        data: {
          billNumer: response?.data?.data?.["GAS Bill"]?.billNumer || "-",
          address: response?.data?.data?.["GAS Bill"]?.address || "-",
          lpgId: response?.data?.data?.["GAS Bill"]?.lpgId || "-",
          verifyStatus: response?.data?.data?.["GAS Bill"]?.verifyStatus || "-",
          consumerNumber:
            response?.data?.data?.["GAS Bill"]?.consumerNumber || "-",
          serviceProvider:
            response?.data?.data?.["GAS Bill"]?.serviceProvider || "-",
        },
      },
      {
        docName: "Mobile Authentication BasisOTP",
        data: {
          name:
            response?.data?.data?.["Mobile Authentication with OTP"]?.name ||
            "-",
          emailId:
            response?.data?.data?.["Mobile Authentication with OTP"]?.emailId ||
            "-",
          type:
            response?.data?.data?.["Mobile Authentication with OTP"]?.type ||
            "-",
          serviceProvider:
            response?.data?.data?.["Mobile Authentication with OTP"]
              ?.provider || "-",
        },
      },
      {
        docName: "EPFO",
        data: {
          epfoValidation:
            response?.data?.data?.EPFO?.epfoValidation.toString() || "false",
          epfoCompanyNameMatchScore:
            response?.data?.data?.EPFO?.epfoCompanyNameMatchScore || "0",
          epfoCompanyName: response?.data?.data?.EPFO?.epfoCompanyName || "-",
          verifyStatus: response?.data?.data?.EPFO?.verifyStatus || "-",
        },
      },
      {
        docName: "Name Matching",
        data: {
          panAadhaarNameMatchScore:
            response?.data?.data?.NameMatching?.panAadhaarNameMatchScore || "0",
          karzaLosNameMatchScore:
            response?.data?.data?.NameMatching?.karzaLosNameMatchScore || "0",
        },
      },
      {
        docName: "Address Matching",
        data: {
          addressMatch:
            response?.data?.data?.AddressMatching?.addressMatch || "-",
          addressMatchScore:
            response?.data?.data?.AddressMatching?.addressMatchScore || "0",
        },
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
      title: "Data",
      key: "data",
      align: "left",
      render: (item, record) => {
        return (
          <Row gutter={[24, 16]}>
            {record?.data?.panName && (
              <Col span={6}>
                <Label label="PAN Name" value={record?.data?.panName} />
              </Col>
            )}
            {record?.data?.panNumber && (
              <Col span={6}>
                <Label label="PAN Number" value={record?.data?.panNumber} />
              </Col>
            )}
            {record?.data?.aadharName && (
              <Col span={6}>
                <Label label="Aadhar Name" value={record?.data?.aadharName} />
              </Col>
            )}
            {record?.data?.name && (
              <Col span={6}>
                <Label label="Name" value={record?.data?.name} />
              </Col>
            )}
            {record?.data?.epicNumber && (
              <Col span={6}>
                <Label label="Voter ID" value={record?.data?.epicNumber} />
              </Col>
            )}
            {record?.data?.drivingLicenseNumber && (
              <Col span={6}>
                <Label
                  label="Driving License Number"
                  value={record?.data?.drivingLicenseNumber}
                />
              </Col>
            )}
            {record?.data?.passportNumber && (
              <Col span={6}>
                <Label
                  label="Passport Number"
                  value={record?.data?.passportNumber}
                />
              </Col>
            )}
            {record?.data?.billNumer && (
              <Col span={6}>
                <Label label="Bill No." value={record?.data?.billNumer} />
              </Col>
            )}
            {record?.data?.address && (
              <Col span={6}>
                <Label label="Address" value={record?.data?.address} />
              </Col>
            )}
            {record?.data?.aadharId && (
              <Col span={6}>
                <Label label="Aadhar Id" value={record?.data?.aadharId} />
              </Col>
            )}
            {record?.data?.lpgId && (
              <Col span={6}>
                <Label label="LPG Id" value={record?.data?.lpgId} />
              </Col>
            )}
            {record?.data?.emailId && (
              <Col span={6}>
                <Label label="Email Id" value={record?.data?.emailId} />
              </Col>
            )}
            {record?.data?.dateOfBirth && (
              <Col span={6}>
                <Label label="DOB" value={record?.data?.dateOfBirth} />
              </Col>
            )}
            {record?.data?.epfoValidation && (
              <Col span={6}>
                <Label
                  label="EPFO Valid"
                  value={
                    record?.data?.epfoValidation === "true" ? "True" : "False"
                  }
                />
              </Col>
            )}
            {record?.data?.addressMatch && (
              <Col span={6}>
                <Label
                  label="Address Match"
                  value={
                    record?.data?.addressMatch === "Y"
                      ? "Yes"
                      : record?.data?.addressMatch === "N"
                      ? "No"
                      : "No"
                  }
                />
              </Col>
            )}
            {record?.data?.epfoCompanyNameMatchScore && (
              <Col span={6}>
                <Label
                  label="EPFO Score"
                  value={
                    parseFloat(record?.data?.epfoCompanyNameMatchScore).toFixed(
                      4
                    ) * 100
                  }
                />
              </Col>
            )}
            {record?.data?.epfoCompanyName && (
              <Col span={6}>
                <Label
                  label="EPFO Company Name"
                  value={record?.data?.epfoCompanyName}
                />
              </Col>
            )}
            {record?.data?.karzaLosNameMatchScore && (
              <Col span={6}>
                <Label
                  label="Karza Match Score"
                  value={parseFloat(
                    record?.data?.karzaLosNameMatchScore
                  ).toFixed(2)}
                />
              </Col>
            )}
            {record?.data?.panAadhaarNameMatchScore && (
              <Col span={6}>
                <Label
                  label="Name Match Score"
                  value={parseFloat(
                    record?.data?.panAadhaarNameMatchScore
                  ).toFixed(2)}
                />
              </Col>
            )}
            {record?.data?.addressMatchScore && (
              <Col span={6}>
                <Label
                  label="Address Match Score"
                  value={parseFloat(record?.data?.addressMatchScore)}
                />
              </Col>
            )}
            {record?.data?.serviceProvider && (
              <Col span={6}>
                <Label
                  label="Service Provider"
                  value={record?.data?.serviceProvider}
                />
              </Col>
            )}
            {record?.data?.consumerNumber && (
              <Col span={6}>
                <Label
                  label="Consumer No."
                  value={record?.data?.consumerNumber}
                />
              </Col>
            )}
            {record?.data?.type && (
              <Col span={6}>
                <Label label="Service Type" value={record?.data?.type} />
              </Col>
            )}
            {record?.data?.verifyStatus && (
              <Col span={6}>
                <Label
                  label="Verify Status"
                  value={record?.data?.verifyStatus}
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

export default KarzaOutput;
