import { Button, Col, Row, Table, Tabs } from 'antd';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spin from '../../Components/Spin';
import { getDocData } from '../../Redux/Services/dashboard';
import { BASE } from '../../Redux/Utils/httpInterceptor';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import axios from 'axios';
import { getDownloadAllDoc } from '../../Redux/Services/Cases';

function DocumentUpload(props) {
  const [summaryData, setSummaryData] = useState([]);
  const [applicantUniqueId, setApplicantUniqueId] = useState(null);
  const [preDisbursalData, setPreDisbursalData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const { TabPane } = Tabs;
  const zip = new JSZip();

  useEffect(() => {
    if (applicantUniqueId) {
      getData(applicantUniqueId);
    }
  }, applicantUniqueId);

  const getData = async (id) => {
    setLoader(true);
    const data = await getDocData({ applicantUniqueId: id });
    setLoader(false);
    setPreDisbursalData(data);
  };

  const download = async (item) => {
    return axios
      .get(
        `https://cors-anywhere.herokuapp.com/${item.filePath?.replace(
          '/var/www/html',
          BASE
        )}`,
        {
          responseType: 'blob',
        }
      )
      .then((resp) => {
        zip.file(item?.filePath?.split('/')?.pop(), resp?.data);
      });
  };

  const downloadAllDocs = () => {
    getDownloadAllDoc(applicantUniqueId);
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
      title: 'Section',
      dataIndex: 'documentSection',
      key: 'key',
      width: 220,
      align: 'center',
    },
    {
      title: 'Document',
      dataIndex: 'fileName',
      key: 'document',
      width: 400,
      align: 'center',
    },

    {
      title: 'Action',
      key: 'action',
      align: 'center',
      // fixed: "right",
      render: (item, record) => {
        return (
          record.markAsViewed !== null && (
            <Row gutter={30} type={'flex'} justify={'space-around'}>
              <Col>
                <a
                  href={record?.filePath?.replace('/var/www/html', BASE)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View
                </a>
              </Col>
              <Col>
                <Link
                  // to={path}
                  // target={"_blank"}
                  onClick={(e) => {
                    saveAs(record?.filePath?.replace('/var/www/html', BASE));
                  }}

                  //Cors url added for testing download functionality
                  // onClick={(e) => {
                  //   saveAs(
                  //     `https://cors-anywhere.herokuapp.com/${record?.filePath?.replace(
                  //       '/var/www/html',
                  //       BASE
                  //     )}`
                  //   );
                  // }}
                >
                  Download
                </Link>
              </Col>
            </Row>
          )
        );
      },
    },
  ];

  return (
    <>
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
                dataSource={preDisbursalData}
              />
            </Spin>
          </TabPane>
        ))}
      </Tabs>
      <Row>
        <Col offset={20}>
          <Button
            loading={loading}
            className={'reset-button'}
            onClick={downloadAllDocs}
          >
            Download All
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default DocumentUpload;
