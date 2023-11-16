import { Button, Card, Col, Form, Input, Row, DatePicker } from 'antd';
import React, { useContext, useEffect, useState, useRef } from 'react';
import App from '../../App';
import InputText from '../../Components/Input';
import Spin from '../../Components/Spin';
import Tables from '../../Components/Table';
import { motion } from 'framer-motion';
import {
  getCaseCounts,
  getCaseList,
  getLock,
  releaseLock,
} from '../../Redux/Services/dashboard';
import Cards from './Cards';
import './index.scss';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';

const columns = [
  {
    title: 'Application ID',
    dataIndex: 'leadId',
    key: 'leadId',
    width: 150,
  },
  // {
  //   title: "Sourcing App",
  //   dataIndex: "sourcingApp",
  //   key: "sourcingApp",
  //   width: 150,
  // },
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
    width: 100,
  },
  {
    title: 'Updated Date',
    dataIndex: 'updatedDate',
    key: 'updatedDate',
    width: 120,
    render: (text, record) => {
      // Assuming "updatedDate" is in a standard date format
      const formattedDate = moment(text).format('YYYY-MM-DD HH:mm:ss'); // Custom format
      return formattedDate;
    },
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
    width: 120,
  },
];

function index(props) {
  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();
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

  const {
    setHeading,
    setIsTimerVisible,
    pause,
    setOffTimer,
    convertDurationtoSeconds,
  } = useContext(App.CaseContext);

  const [tilesCount, setTilesCount] = useState('');
  const [caseList, setCaseList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(100);
  const carousel = useRef();
  const [width, setWidth] = useState(0);
  const [spinning, setSpinning] = React.useState(false);

  const redirect = (history, record) => {
    (async () => {
      const response = await getLock({
        applicantUniqueId: record.applicationId,
        employeeId: localStorage.getItem('empId'),
      });

      if (!response?.error) {
        sessionStorage.setItem('is_reloaded', false);

        setOffTimer(response?.data?.lockReleaseTime);

        localStorage.setItem('appId', record.applicationId);
        history.push(`/deviation/${record.applicationId}`);
      }
    })();
  };
  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);

  useEffect(() => {
    setHeading('Dashboard');
    setIsTimerVisible(false);
    // pause();

    if (sessionStorage['is_reloaded']) {
      unlockAPI();
    }
    return () => {
      const a = localStorage.getItem('token');
    };
    setIsTimerVisible(false);
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

  const redirectListing = () => {
    props.history.push(`/caseListing`);
  };

  useEffect(() => {
    const mainCondition =
      filter.caseCount.fromDate === '' && filter.caseCount.toDate === '';
    const filterCondition =
      filter.caseCount.fromDate !== '' && filter.caseCount.toDate !== '';
    const getData = async () => {
      setSpinning(true);
      const caseCounts = await getCaseCounts(filter.caseCount);
      if (!mainCondition) {
        const caseList = await getCaseList({
          ...filter.caseList,
          ...filter.caseCount,
        });
        setCaseList(caseList.caseList);
      }
      setTilesCount(caseCounts);
      setSpinning(false);
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
      setSpinning(true);
      const caseList = await getCaseList({
        ...filter.caseList,
        ...dateFilter,
      });
      setCaseList(caseList.caseList);

      setCount(caseList?.listCount);
      setSpinning(false);
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
      <Form
        initialValues={{
          remember: true,
        }}
        name='dynamic_form_nest_item'
        autoComplete='off'
        form={form}
        s
      >
        <Card>
          <Row className={'dashboardContainer'} gutter={[0, 20]}>
            <Col lg={24}>
              <Row type={'flex'} gutter={[20, 20]} style={{ marginBottom: 25 }}>
                <div className='dashBoardBtn'>
                  <Button onClick={redirectListing} className={'reset-button'}>
                    View Listing
                  </Button>
                </div>
              </Row>
              <Row type={'flex'} justify={'end'} gutter={20}>
                <Col>
                  <Form.Item name={'rangepicker'}>
                    <RangePicker
                      className='rangepicker-dashboard'
                      onChange={onChange}
                      placeholder={['From Date', 'To Date']}
                      format={dateFormat}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    htmlType={'reset'}
                    onClick={(e) => {
                      form.resetFields();

                      setFilter(initialFilters);
                    }}
                    className={'reset-button'}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col lg={24}>
              <motion.div ref={carousel} className='carousel'>
                <motion.div
                  drag='x'
                  dragConstraints={{ right: 0, left: -width }}
                  className='inner-carousel'
                >
                  <Cards
                    title='Total Applications'
                    value={tilesCount.totalApplications}
                  />
                  <Cards
                    title='Credit Approved'
                    value={tilesCount.creditApproved}
                  />{' '}
                  <Cards
                    title='Credit Rejected'
                    value={tilesCount.creditRejected}
                  />
                  <Cards title='Approve STP' value={tilesCount.approveStp} />{' '}
                  <Cards
                    title='Stage Reversal'
                    value={tilesCount.stageReversal}
                  />{' '}
                  <Cards
                    title='Query Resolved'
                    value={tilesCount.queryResolved}
                  />{' '}
                  <Cards
                    title='Bureau STP Rejected'
                    value={tilesCount.bureauStpRejected}
                  />
                </motion.div>
              </motion.div>
            </Col>
            <Col lg={24}>
              <Card
                title={'Case Listing'}
                bordered={false}
                extra={
                  <Row type={'flex'} gutter={[20, 35]}>
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
                      <Form.Item name={'search'}>
                        <Input
                          placeholder='Search'
                          allowClear
                          className='search-dashboard'
                          size='large'
                          suffix={<SearchOutlined />}
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
                      </Form.Item>
                    </Col>
                  </Row>
                }
              >
                <Tables
                  size='small'
                  columns={columns}
                  loading={{
                    indicator: (
                      <div>
                        <LoadingOutlined style={{ fontSize: 40 }} spin />
                      </div>
                    ),
                    spinning: spinning,
                  }}
                  dataSource={caseList}
                  scroll={{ x: 2000 }}
                  onRow={(record, index) => {
                    return {
                      onClick: (e) => redirect(props.history, record),
                      // onClick: (e) => (props.history, record),
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
                    // defaultCurrent: 1,
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
      </Form>
    </Spin>
  );
}

export default index;
