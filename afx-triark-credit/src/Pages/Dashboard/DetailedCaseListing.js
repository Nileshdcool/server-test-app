import { Card, Col, Row, DatePicker } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import App from '../../App';
import InputText from '../../Components/Input';
import Spin from '../../Components/Spin';
import Tables from '../../Components/Table';
import {
  getCaseCounts,
  getLock,
  releaseLock,
  getCaseListingDetails,
} from '../../Redux/Services/dashboard';
import './index.scss';
import moment from 'moment';

const columns = [
  {
    title: 'Application ID',
    dataIndex: 'leadId',
    key: 'leadId',
    width: 150,
    fixed: 'left',
    align: 'center',
  },
  {
    title: 'Applicant Name',
    dataIndex: 'applicantName',
    key: 'applicantName',
    width: 120,
  },
  {
    title: 'Dedupe Match',
    dataIndex: 'dedupeMatch',
    key: 'dedupeMatch',
    width: 120,
  },
  {
    title: 'Dedupe Application ID',
    dataIndex: 'dedupeApplicantId',
    key: 'dedupeApplicantId',
    width: 200,
    align: 'center',
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
  },
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    key: 'createdDate',
    width: 120,
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
    width: 160,
  },
  {
    title: 'Updated Date',
    dataIndex: 'updatedDate',
    key: 'updatedDate',
    width: 120,
  },
  {
    title: 'Scheme',
    dataIndex: 'scheme',
    key: 'scheme',
    width: 100,
  },
  {
    title: 'Tenure (Months)',
    dataIndex: 'tenure',
    key: 'tenure',
    width: 100,
  },
  {
    title: 'ROI (%)',
    dataIndex: 'roi',
    key: 'roi',
    width: 70,
  },
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
    width: 270,
  },
  {
    title: 'DSA Name',
    dataIndex: 'dsaName',
    key: 'dsaName',
    width: 180,
  },
];

const redirect = (history, record) => {
  (async () => {
    const response = await getLock({
      applicantUniqueId: record.applicationId,
      employeeId: localStorage.getItem('empId'),
    });
    if (!response?.error) {
      localStorage.setItem('appId', record.applicationId);
      history.push(`/deviation/${record.applicationId}`);
    }
  })();
};

function DetailedCaseListing(props) {
  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY-MM-DD';
  const initialFilters = {
    caseCount: {
      branchName: localStorage.getItem('branchName')?.toString()?.split(','),
      employeeId: localStorage.getItem('empId'),
      fromDate: '',
      toDate: '',
    },
    caseCountDate: {
      fromDate: '',
      toDate: '',
    },
    caseList: { rcuFilter: '', searchString: '', pageNumber: 1, pageSize: 10 },
  };
  const [filter, setFilter] = useState(initialFilters);

  const { setHeading, setIsTimerVisible, pause, convertDurationtoSeconds } =
    useContext(App.CaseContext);

  const [tilesCount, setTilesCount] = useState('');

  const [caseList, setCaseList] = useState([]);

  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(100);

  useEffect(() => {
    setHeading('Dashboard');
    setIsTimerVisible(false);
    pause();
    if (localStorage.getItem('appId')) {
      (async () => {
        if (sessionStorage['is_reloaded']) {
          unlockAPI();
        }
      })();
    }
    sessionStorage.setItem('is_reloaded', false);
    return () => {
      const a = localStorage.getItem('token');
    };
  }, []);

  const unlockAPI = async () => {
    if (localStorage.getItem('appId')) {
      const response = await releaseLock({
        applicantUniqueId: localStorage.getItem('appId')?.toString(),
        employeeId: localStorage.getItem('empId'),
        lockReleaseTime: convertDurationtoSeconds(),
      });

      if (!response?.error) {
        localStorage.removeItem('appId');
      }
    }
  };

  React.useEffect(() => {
    (async () => {
      const response = await getCaseListingDetails({
        fromDate: '1900-01-01',
        toDate: '2090-01-01',
        searchString: '',
        rcuFilter: '',
        pageSize: 1000,
        pageNumber: 1,
        branchName: ['ALL'],
        employeeId: 'DSA01',
      });
    })();
  }, []);

  useEffect(() => {
    const mainCondition =
      filter.caseCount.fromDate === '' && filter.caseCount.toDate === '';
    const filterCondition =
      filter.caseCount.fromDate !== '' && filter.caseCount.toDate !== '';
    const getData = async () => {
      setLoader(true);
      const caseCounts = await getCaseCounts(filter.caseCount);
      if (!mainCondition) {
        const caseList = await getCaseListingDetails({
          ...filter.caseList,
          ...filter.caseCount,
        });
        setCount(caseList?.listCount);
        setCaseList(caseList.caseList);
      }
      setTilesCount(caseCounts);
      setLoader(false);
    };
    if (mainCondition || filterCondition) {
      getData();
    }
  }, [filter.caseCount.fromDate, filter.caseCount.toDate]);

  useEffect(() => {
    let timer;
    const getData = async () => {
      let dateFilter = initialFilters.caseCount;
      const filterCondition =
        filter.caseCount.fromDate !== '' && filter.caseCount.toDate !== '';
      if (filterCondition) {
        dateFilter = filter.caseCount;
      }
      setLoader(true);
      const caseList = await getCaseListingDetails({
        ...filter.caseList,
        ...dateFilter,
      });
      setCaseList(caseList.caseList);
      setCount(caseList?.listCount);
      setLoader(false);
    };
    timer = setTimeout(getData, 700);

    return () => clearTimeout(timer);
  }, [
    filter.caseList.rcuFilter,
    filter.caseList.searchString,
    filter.caseList.pageNumber,
  ]);

  function onChange(dates, dateStrings) {
    setFilter({
      ...filter,
      caseCount: {
        ...filter.caseCount,
        fromDate: dateStrings[0],
        toDate: dateStrings[1],
      },
      caseCountDate: {
        ...filter.caseCountDate,
        fromDate: dateStrings[0],
        toDate: dateStrings[1],
      },
    });
  }

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
                      allowClear={true}
                      value={filter.caseList.rcuFilter}
                      label={'RCU Filter'}
                      type={'dropdown'}
                      options={[
                        {
                          label: 'All System Approved',
                          value: 'All System Approved',
                        },
                        {
                          label: 'Partial System Approved',
                          value: 'Partial System Approved',
                        },
                        {
                          label: 'None System Approved',
                          value: 'None System Approved',
                        },
                      ]}
                      onChange={(rcuFilter) => {
                        setFilter({
                          ...filter,
                          caseList: {
                            ...filter.caseList,
                            rcuFilter,
                          },
                        });
                      }}
                    />
                  </Col>
                  <Col>
                    <RangePicker
                      className='rangepicker-dashboard'
                      onChange={onChange}
                      placeholder={['From Date', 'To Date']}
                      format={dateFormat}
                    />
                  </Col>
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
                </Row>
              }
            >
              <Tables
                style={{ position: 'relative' }}
                size='small'
                columns={columns}
                dataSource={caseList}
                scroll={{ x: 1300 }}
                onRow={(record, index) => {
                  return {
                    onClick: (e) => redirect(props.history, record),
                  };
                }}
                rowClassName={(record, index) => {
                  return record?.isColourChange
                    ? 'row-color'
                    : record?.isColourChangeCaseRelook && 'row-color-alt';
                }}
                pagination={{
                  onChange: (page) => {
                    setFilter({
                      ...filter,
                      caseList: { ...filter.caseList, pageNumber: page },
                    });
                  },
                  current: filter.caseList.pageNumber,
                  total: count,
                  pageSize: filter.caseList.pageSize,
                  showSizeChanger: false,
                  position: ['bottomLeft'],
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

export default DetailedCaseListing;
