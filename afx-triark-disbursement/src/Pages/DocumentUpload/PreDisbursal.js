import { Button, Checkbox, Col, Row, Table, Tabs } from "antd";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spin from "../../Components/Spin";
import {
  getPreDisbrsalData,
  savePredusbursalData,
} from "../../Redux/Services/documentUpload";
import { BASE } from "../../Redux/Utils/httpInterceptor";
import { saveAs } from "file-saver";

function PreDisbursal(props) {
  const [summaryData, setSummaryData] = useState([]);
  const [applicantUniqueId, setApplicantUniqueId] = useState(null);
  const [preDisbursalData, setPreDisbursalData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { TabPane } = Tabs;

  const userFreeze = props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze =
    props.caseSummaryData?.mainapplicant[0]?.disbursementFreeze;

  useEffect(() => {
    if (applicantUniqueId) {
      getData(applicantUniqueId);
    }
  }, applicantUniqueId);

  const getData = async (id) => {
    setLoader(true);
    const data = await getPreDisbrsalData({ applicantUniqueId: id });
    setLoader(false);
    setPreDisbursalData(data);
  };

  const saveData = async () => {
    setLoader(true);
    const data = await savePredusbursalData({
      data: preDisbursalData,
      applicantUniqueId,
    });
    setPreDisbursalData(data);
    setLoader(false);
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

  const markAsViewed = (record, checked) => {
    const newRecords = preDisbursalData.map((item) => {
      const key = `${item.id}${item?.documentSection?.replace(/\s/g, "")}`;
      const rKey = `${record.id}${record?.documentSection?.replace(/\s/g, "")}`;
      if (item?.fileName === record?.fileName) {
        item.markAsViewed = checked;
      }
      return item;
    });
    setPreDisbursalData(newRecords);
  };
  const columns = [
    {
      title: "Section",
      dataIndex: "documentSection",
      key: "key",
      width: 220,
      align: "center",
    },
    {
      title: "Document",
      dataIndex: "fileName",
      key: "document",
      width: 400,
      align: "center",
    },

    {
      title: "Action",
      key: "action",
      align: "center",
      // fixed: "right",
      render: (item, record) => {
        return (
          record.markAsViewed !== null && (
            <Row gutter={30} type={"flex"} justify={"space-around"}>
              <Col>
                <a
                  href={record?.filePath?.replace("/var/www/html", BASE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </Col>
              <Col>
                <Link
                  // to={path}
                  // target={"_blank"}
                  onClick={(e) => {
                    saveAs(record?.filePath?.replace("/var/www/html", BASE));
                  }}
                >
                  Download
                </Link>
              </Col>
            </Row>
          )
        );
      },
    },
    {
      title: "Mark as Viewed",
      dataIndex: "4",
      key: "4",
      align: "center",
      render: (item, record) => {
        if (record.markAsViewed === null) {
          return (
            <>
              <Button
                className={"reset-button"}
                onClick={saveData}
                disabled={userFreeze || caseFreeze}
              >
                {" "}
                Save{" "}
              </Button>
            </>
          );
        }
        return (
          <>
            <Checkbox
              disabled={userFreeze || caseFreeze}
              defaultChecked={record.markAsViewed}
              onChange={(e) => {
                markAsViewed(record, e?.target?.checked);
              }}
            />
          </>
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
            <Table
              pagination={false}
              columns={columns}
              dataSource={[...preDisbursalData, { markAsViewed: null }]}
            />
          </Spin>
        </TabPane>
      ))}
    </Tabs>
  );
}

export default PreDisbursal;
