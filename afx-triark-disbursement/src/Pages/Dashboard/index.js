import { Button, Card, Col, Form, Row, DatePicker, Input, Modal } from 'antd';
import React, { useContext, useEffect, useState, useRef } from 'react';
import App from '../../App';
import InputText from '../../Components/Input';
import Spin from '../../Components/Spin';
import Tables from '../../Components/Table';
import { motion } from 'framer-motion';
import {
  exportDump,
  getCaseCounts,
  getCaseList,
  getLock,
  releaseLock,
} from '../../Redux/Services/dashboard';
import Cards from './Cards';
import './index.scss';
import moment from 'moment';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { releaseLockTwin2 } from '../../Redux/Services/dashboardTwin2';

const { Search } = Input;

const tilesData = [
  /*  {
    name: "All",
    id: "",
    count: 0,
  }, */
  {
    name: 'Disbursement Query Resolved',
    id: 'Disbursement Query Resolved',
    count: 10,
  },
  {
    name: 'Sanction',
    id: 'Sanctioned',
    count: 20,
  },
];

const columns = [
  {
    title: 'Application ID',
    dataIndex: 'leadId',
    key: 'leadId',
    width: 150,
  },
  {
    title: 'Sourcing App',
    dataIndex: 'sourcingApp',
    key: 'sourcingApp',
    width: 150,
  },
  {
    title: 'Applicant Name',
    dataIndex: 'applicantName',
    key: 'applicantName',
    width: 200,
  },
  {
    title: 'FOS ID',
    dataIndex: 'employeeId',
    key: 'employeeId',
    width: 200,
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
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    width: 150,
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
    width: 140,
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
    width: 140,
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
    width: 120,
  },
  {
    title: 'Vehicle Type',
    dataIndex: 'vehicleType',
    key: 'vehicleType',
    width: 120,
  },
  {
    title: 'Vehicle Model',
    dataIndex: 'vehicleModel',
    key: 'vehicleModel',
    width: 120,
  },
  {
    title: 'Dealer Name',
    dataIndex: 'dealerName',
    key: 'dealerName',
    width: 320,
  },
  {
    title: 'DSA Name',
    dataIndex: 'dsaName',
    key: 'dsaName',
    width: 200,
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
      history.push(`/documents-upload/${record.applicationId}`);
    }
  })();
};

function index(props) {
  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();
  const initialFilters = {
    caseCount: {
      branchName: localStorage.getItem('branchName')?.toString()?.split(','),
      employeeId: localStorage.getItem('empId'),
      fromDate: '1900-01-01',
      toDate: '2090-01-01',
    },
    caseCountDate: {
      fromDate: '',
      toDate: '',
    },
    caseModalDateRange: {
      fromDate: '',
      toDate: '',
    },
    caseList: {
      rcuFilter: '',
      searchString: tileSelected,
      pageNumber: 1,
      pageSize: 10,
    },
  };
  const [exportToExcelModalVisible, setExportToExcelModalVisible] =
    useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const [filter, setFilter] = useState(initialFilters);

  const { setHeading } = useContext(App.CaseContext);

  const [tilesCount, setTilesCount] = useState('');

  const [caseList, setCaseList] = useState([]);

  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(0);
  const carousel = useRef();
  const [width, setWidth] = useState(0);
  const [tileSelected, setTileSelected] = useState('');
  const [tileCardCount, setTileCardCount] = useState(0);

  const handleTileClick = (id) => {
    setSpinning(true);
    let tempCaseList = filter;
    tempCaseList.caseList.searchString = id;
    setTileSelected(id);
    setSpinning(false);
  };

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);

  useEffect(() => {
    setHeading('Dashboard');

    return () => {
      const a = localStorage.getItem('token');
      //
    };
  }, []);

  const redirectListing = () => {
    props.history.push(`/caseListing`);
  };

  const redirectListing1 = () => {
    props.history.push(`/dashboardTwin2`);
  };
  const redirectPaymentListing = () => {
    props.history.push(`/paymentStatus`);
  };
  const redirectPremiumLisiting = () => {
    props.history.push(`/dashboardPremiumDealer`);
  };

  useEffect(() => {
    const mainCondition =
      filter.caseCount.fromDate === '' && filter.caseCount.toDate === '';
    const filterCondition =
      filter.caseCount.fromDate !== '' && filter.caseCount.toDate !== '';
    const getData = async () => {
      // setLoader(true);
      setSpinning(true);
      // const caseCounts = await getCaseCounts(filter.caseCount);
      /* if (!mainCondition) {
        const caseList = await getCaseList({
          ...filter.caseList,
          ...filter.caseCount,
        });
        setCaseList(caseList.caseList);
      } */
      const caseList = await getCaseList({
        ...filter.caseList,
        ...filter.caseCount,
      });
      setCaseList(caseList.caseList);
      // setTilesCount(caseCounts);
      setSpinning(false);
    };
    if (filterCondition || mainCondition) {
      getData();
    }
  }, [filter.caseCount.fromDate, filter.caseCount.toDate]);

  useEffect(() => {
    if (localStorage.getItem('appId')) {
      (async () => {
        const response = await releaseLock({
          applicantUniqueId: localStorage.getItem('appId')?.toString(),
          employeeId: localStorage.getItem('empId'),
        });

        if (!response?.error) {
          localStorage.removeItem('appId');
        }
        //
      })();
    }
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
    return () => {
      const a = localStorage.getItem('token');
    };
  }, []);

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
      const caseCounts = await getCaseCounts(filter.caseCount);
      const caseList = await getCaseList({
        ...filter.caseList,
        ...dateFilter,
      });
      setCaseList(caseList.caseList);
      setTilesCount(caseCounts);
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
        fromDate: dateStrings[0] === '' ? '1900-01-01' : dateStrings[0],
        toDate: dateStrings[1] === '' ? '2090-01-01' : dateStrings[1],
      },
      caseCountDate: {
        ...filter.caseCountDate,
        fromDate: dateStrings[0] === '' ? '1900-01-01' : dateStrings[0],
        toDate: dateStrings[1] === '' ? '2090-01-01' : dateStrings[1],
      },
    });
  }

  const onFinishDump = async (a) => {
    await exportDump({
      ...filter.caseModalDate,
    });
    form.resetFields();
  };

  useEffect(() => {
    const count = isNaN(
      tilesCount['Disbursement Query Resolved'] + tilesCount?.Sanctioned
    )
      ? 0
      : tilesCount['Disbursement Query Resolved'] + tilesCount?.Sanctioned;
    setTileCardCount(count);
  }, [tilesCount['Disbursement Query Resolved'], tilesCount?.Sanctioned]);
  return (
    <Spin spinning={loader}>
      <Form
        initialValues={{
          remember: true,
        }}
        name='dynamic_form_nest_item'
        autoComplete='off'
        form={form}
      >
        <Card>
          <Row className={'dashboardContainer'} gutter={[0, 20]}>
            <Col lg={24} style={{ display: 'flex' }}>
              <Col lg={12}>
                <Row
                  type={'flex'}
                  gutter={[20, 20]}
                  style={{ marginBottom: 25 }}
                >
                  <div className='dashBoardBtn'>
                    <Button
                      onClick={redirectListing}
                      className={'reset-button'}
                    >
                      View Listing
                    </Button>
                  </div>
                </Row>
              </Col>
              <Col span={12} style={{ paddingRight: '2%' }}>
                {true && (
                  <Row
                    gutter={[15]}
                    type={'flex'}
                    justify={'end'}
                    style={{ paddingBottom: 15 }}
                  >
                    <Button
                      className={'save-button'}
                      onClick={() => setExportToExcelModalVisible(true)}
                    >
                      Export To Excel
                    </Button>
                  </Row>
                )}
              </Col>
            </Col>
            <Col lg={24}>
              <motion.div ref={carousel} className='carousel'>
                <motion.div
                  drag='x'
                  dragConstraints={{ right: 0, left: -width }}
                  className='inner-carousel'
                >
                  {tilesData?.length > 0 &&
                    tilesData.map((tile) => {
                      tileSelected === tile.id
                        ? 'dashboardContainer selectedTile'
                        : 'dashboardContainer';

                      return (
                        <React.Fragment key={tile.id}>
                          <Cards
                            className='cardSelected'
                            title={tile.name}
                            value={
                              tilesCount[tile.id] !== undefined
                                ? tilesCount[tile.id]
                                : tile?.id === ''
                                ? tileCardCount
                                : 0
                            }
                            id={tile.id}
                            tileSelected={tileSelected}
                            // handleTileClick={() => handleTileClick(tile.id)}
                            handleTileClick={() => null}
                          />
                        </React.Fragment>
                      );
                    })}
                  {/* <Cards
                    title="Query Resolved Cases"
                    value={tilesCount.disbursementQueryResolved}
                  />

                  <Cards title="RCU Approved" value={tilesCount.rcuApproved2} /> */}
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
                      <Form.Item name={'rangepicker'}>
                        <RangePicker
                          className='rangepicker-dashboard'
                          onChange={onChange}
                          placeholder={['From Date', 'To Date']}
                          // defaultValue={[
                          //   moment(filter.caseCountDate.fromDate, dateFormat),
                          //   moment(filter.caseCountDate.toDate, dateFormat),
                          // ]}
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
                          setTileSelected('');
                        }}
                        className={'reset-button'}
                      >
                        Reset
                      </Button>
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
                  loading={{
                    indicator: (
                      <div>
                        <LoadingOutlined style={{ fontSize: 40 }} spin />
                      </div>
                    ),
                    spinning: spinning,
                  }}
                  columns={columns}
                  dataSource={caseList}
                  scroll={{ x: 2000 }}
                  onRow={(record, index) => {
                    return {
                      onClick: (e) => redirect(props.history, record),
                      // onClick: (e) => (props.history, record),
                    };
                  }}
                  rowClassName={(record, index) => {
                    //
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
        <Modal
          title={'Export Dump'}
          visible={exportToExcelModalVisible}
          onCancel={() => {
            form.resetFields();
            setExportToExcelModalVisible(false);
          }}
          centered={true}
          footer={null}
        >
          <Form onFinish={onFinishDump} form={form}>
            <Row type={'flex'} justify={'end'} gutter={[20, 30]}>
              <Col span={12}>
                <Form.Item
                  name={'fromDate'}
                  rules={[
                    {
                      required: true,
                      message: 'From Date is mandatory',
                    },
                  ]}
                >
                  <InputText
                    label={'From'}
                    type={'date'}
                    value={filter.caseModalDateRange.fromDate}
                    disabledDate={(current) => {
                      let customDate = new Date();
                      return (
                        current && current > moment(customDate, 'YYYY-MM-DD')
                      );
                    }}
                    onChange={(e, dateString) => {
                      return setFilter({
                        ...filter,
                        caseModalDate: {
                          ...filter.caseModalDate,
                          fromDate: dateString,
                        },
                        caseModalDateRange: {
                          ...filter.caseModalDateRange,
                          fromDate: e,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={'toDate'}
                  rules={[
                    {
                      required: true,
                      message: 'To Date is mandatory',
                    },
                  ]}
                >
                  <InputText
                    label={'Tos'}
                    type={'date'}
                    value={filter.caseModalDateRange.toDate}
                    disabledDate={(current) => {
                      let customDate = new Date();
                      return (
                        current && current > moment(customDate, 'YYYY-MM-DD')
                      );
                    }}
                    onChange={(e, dateString) => {
                      setFilter({
                        ...filter,
                        caseModalDate: {
                          ...filter.caseModalDate,
                          toDate: dateString,
                        },
                        caseModalDateRange: {
                          ...filter.caseModalDateRange,
                          toDate: e,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} />
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button htmlType={'submit'} className={'save-button'}>
                  Download
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Form>
    </Spin>
  );
}

export default index;
