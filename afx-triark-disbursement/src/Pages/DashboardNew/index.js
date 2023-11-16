import { Card, Col, Row, Button } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import App from '../../App';
import InputText from '../../Components/Input';
import Spin from '../../Components/Spin';
import Tables from '../../Components/Table';
import {
  getCaseListTwin2,
  getLockTwin2,
  releaseLockTwin2,
} from '../../Redux/Services/dashboardTwin2';
import './index.scss';
import moment from 'moment';

const columns = [
  {
    title: 'Application ID',
    dataIndex: 'applicationId',
    key: 'applicationId',
    width: 180,
  },
  {
    title: 'Applicant Name',
    dataIndex: 'applicantName',
    key: 'applicantName',
    width: 160,
  },
  {
    title: 'Branch',
    dataIndex: 'branch',
    key: 'branch',
    width: 120,
  },
  {
    title: 'Loan Amount',
    dataIndex: 'loanAmount',
    key: 'loanAmount',
    width: 120,
    render: (item, record) => {
      return (
        <Row>
          <Col lg={24}>
            <span>
              {parseFloat(item).toLocaleString('en-IN', {
                style: 'decimal',
                currency: 'INR',
              })}
            </span>
          </Col>
        </Row>
      );
    },
  },
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    key: 'createdDate',
    width: 150,
    render: (text, record) => {
      // Assuming "updatedDate" is in a standard date format
      const formattedDate = moment(text).format('YYYY-MM-DD HH:mm:ss'); // Custom format
      return formattedDate;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 140,
  },
  // {
  //   title: "Tenure (Months)",
  //   dataIndex: "tenure",
  //   key: "tenure",
  //   width: 100,
  // },
  // {
  //   title: "ROI (%)",
  //   dataIndex: "roi",
  //   key: "roi",
  //   width: 70,
  // },
  {
    title: 'Source Type',
    dataIndex: 'sourceType',
    key: 'sourceType',
    width: 90,
  },
  {
    title: 'Vehicle Type',
    dataIndex: 'vehicleType',
    key: 'vehicleType',
    width: 90,
  },
  {
    title: 'Vehicle Model',
    dataIndex: 'vehicleModel',
    key: 'vehicleModel',
    width: 90,
  },
  {
    title: 'Dealer Name',
    dataIndex: 'dealerName',
    key: 'dealerName',
    width: 150,
  },
];

function DashboardNew(props) {
  const initialFilters = {
    caseList: {
      searchString: '',
      pageSize: 10,
      pageNumber: 1,
    },
  };
  const [filter, setFilter] = useState(initialFilters);

  const { setHeading } = useContext(App.CaseContext);

  const [caseList, setCaseList] = useState([]);

  const [loader, setLoader] = useState(false);

  const redirect = (history, record) => {
    (async () => {
      console.log(record, 'record');
      const response = await getLockTwin2({
        gupshupId: record?.id,
        employeeId: localStorage.getItem('empId'),
      });
      console.log('kb', response);
      if (!response?.error) {
        history.push(`/case-detailsTwin2/${record.id}`);
        localStorage.setItem('applicantId', record?.id);
      }
    })();
  };

  useEffect(() => {
    if (localStorage.getItem('applicantId')) {
      (async () => {
        const response = await releaseLockTwin2({
          gupshupId: localStorage.getItem('applicantId')?.toString(),
          employeeId: localStorage.getItem('empId'),
        });

        if (!response?.error) {
          localStorage.removeItem('applicantId');
        }
        // console.log("response", response);
      })();
    }
  }, []);

  useEffect(() => {
    setHeading('Dashboard Twin2');
    localStorage.removeItem('applicationId');
  }, []);

  useEffect(() => {
    let timer;
    const getData = async () => {
      setLoader(true);
      const caseList = await getCaseListTwin2({
        ...filter.caseList,
      });

      setCaseList(caseList.gupshupList);
      setFilter({
        ...filter,
        caseList: {
          ...filter.caseList,
          total: caseList.totalCount,
        },
      });
      setLoader(false);
    };
    timer = setTimeout(getData, 700);
    return () => clearTimeout(timer);
  }, [filter.caseList.searchString, filter.caseList.pageNumber]);

  const redirectPaymentListing = () => {
    props.history.push(`/paymentStatusTwin2`);
  };
  return (
    <Spin spinning={loader}>
      <Card>
        <Row className={'dashboardContainer'} gutter={[0, 20]}>
          <Col lg={24}>
            <Card
              title={'Case Listing'}
              bordered={false}
              extra={
                <Row type={'flex'} gutter={20}>
                  <Col>
                    <InputText
                      label={'Search'}
                      onChange={(e) => {
                        setFilter({
                          ...filter,
                          caseList: {
                            ...filter.caseList,
                            searchString: e.target.value,
                          },
                        });
                      }}
                    />
                  </Col>
                  <Col lg={12}>
                    <Row
                      type={'flex'}
                      gutter={[20, 20]}
                      style={{ marginBottom: 25 }}
                    >
                      <div className='dashBoardBtn twin2Button'>
                        <Button
                          onClick={redirectPaymentListing}
                          className={'reset-button'}
                        >
                          Update Payment Status
                        </Button>
                      </div>{' '}
                    </Row>
                  </Col>
                </Row>
              }
            >
              <Tables
                size='small'
                columns={columns}
                dataSource={caseList}
                scroll={{ x: 300 }}
                onRow={(record, index) => {
                  return {
                    onClick: (e) => redirect(props.history, record),
                  };
                }}
                pagination={{
                  onChange: (page) => {
                    setFilter({
                      ...filter,
                      caseList: { ...filter.caseList, pageNumber: page },
                    });
                  },
                  current: caseList && caseList.pageNumber,
                  defaultCurrent: 1,
                  total: filter && filter.caseList.total,
                  pageSize: caseList && caseList.pageSize,
                  showSizeChanger: false,
                  position: ['bottomRight'],
                }}
              />
            </Card>
          </Col>
          <Col lg={24}></Col>
        </Row>
      </Card>
    </Spin>
  );
}

export default DashboardNew;
