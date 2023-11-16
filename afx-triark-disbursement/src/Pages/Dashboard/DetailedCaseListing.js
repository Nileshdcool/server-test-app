import { Button, Card, Col, Form, Row, DatePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import App from '../../App';
import InputText from '../../Components/Input';
import Spin from '../../Components/Spin';
import Tables from '../../Components/Table';
import {
  getCaseCounts,
  getCaseListingDetails,
} from '../../Redux/Services/dashboard';
import { motion } from 'framer-motion';
import Cards from './Cards';

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
    title: 'Sourcing App',
    dataIndex: 'sourcingApp',
    key: 'sourcingApp',
    width: 150,
  },
  {
    title: 'Applicant Name',
    dataIndex: 'applicantName',
    key: 'applicantName',
    width: 120,
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
    width: 180,
  },
];

const tilesData = [
  /*   {
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
    name: 'Post Disbursal Upload Done',
    id: 'Post Disbursal Upload Done',
    count: 10,
  },
  {
    name: 'Sanction',
    id: 'Sanctioned',
    count: 20,
  },
  {
    name: 'Submit To LMS',
    id: 'Submit to LMS',
    count: 20,
  },
];

function DetailedCaseListing(props) {
  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY-MM-DD';
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
    caseList: { rcuFilter: '', searchString: '', pageNumber: 1, pageSize: 10 },
  };
  const [filter, setFilter] = useState(initialFilters);

  const { setHeading } = useContext(App.CaseContext);

  const [caseList, setCaseList] = useState([]);

  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(0);
  const carousel = useRef();
  const [width, setWidth] = useState(0);
  const [tileSelected, setTileSelected] = useState('');
  const [tilesCount, setTilesCount] = useState('');
  const [tileCardCount, setTileCardCount] = useState(0);

  const handleTileClick = (id) => {
    let tempCaseList = filter;
    tempCaseList.caseList.searchString = id;
    setTileSelected(id);
  };

  useEffect(() => {
    setHeading('Dashboard');

    return () => {};
  }, []);

  React.useEffect(() => {
    (async () => {
      const response = await getCaseListingDetails({
        fromDate: '1900-01-01',
        toDate: '2090-01-01',
        searchString: '',
        rcuFilter: '',
        pageSize: 1000,
        pageNumber: 1,
        branchName: [localStorage.getItem('branchName')],
        employeeId: localStorage.getItem('empId'),
      });
    })();
  }, []);

  useEffect(() => {
    const mainCondition =
      filter.caseCount.fromDate === '' && filter.caseCount.toDate === '';
    const filterCondition =
      filter.caseCount.fromDate !== '' && filter.caseCount.toDate !== '';
    const getData = async () => {
      // const caseCounts = await getCaseCounts(filter.caseCount);
      const caseList = await getCaseListingDetails({
        ...filter.caseList,
        ...filter.caseCount,
      });

      // setTilesCount(caseCounts);
      setCount(caseList?.listCount);
      setCaseList(caseList.caseList);
      /* if (!mainCondition) {
        const caseList = await getCaseListingDetails({
          ...filter.caseList,
          ...filter.caseCount,
        });

        setTilesCount(caseCounts);
        setCount(caseList?.listCount);
        setCaseList(caseList.caseList);
      } */
    };
    if (filterCondition || mainCondition) {
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
      const caseCounts = await getCaseCounts(filter.caseCount);
      const caseList = await getCaseListingDetails({
        ...filter.caseList,
        ...dateFilter,
      });
      setCaseList(caseList.caseList);
      setTilesCount(caseCounts);
      setCount(caseList?.listCount);
    };
    timer = setTimeout(getData, 700);

    return () => clearTimeout(timer);
  }, [
    filter.caseList.rcuFilter,
    filter.caseList.searchString,
    filter.caseList.pageNumber,
  ]);

  const redirect = (history, record) => {
    history.push(`/documents-upload/${record.applicationId}`);
  };

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

  useEffect(() => {
    const count = isNaN(
      tilesCount['Submit to LMS']
        ? tilesCount['Submit to LMS']
        : 0 + tilesCount['Post Disbursal Upload Done']
        ? tilesCount['Post Disbursal Upload Done']
        : 0
    )
      ? 0
      : tilesCount['Post Disbursal Upload Done']
      ? tilesCount['Post Disbursal Upload Done']
      : 0 + tilesCount['Submit to LMS']
      ? tilesCount['Submit to LMS']
      : 0;
    setTileCardCount(count);
  }, [
    tilesCount['Post Disbursal Upload Done'],
    tilesCount['Submit to LMS'],
    tilesCount?.sanctioned,
  ]);
  return (
    <Spin spinning={loader}>
      <Card>
        <Row className={'dashboardContainer'} gutter={[0, 20]}>
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
              </motion.div>
            </motion.div>
          </Col>
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
                      // defaultValue={[
                      //   moment(filter.caseCountDate.fromDate, dateFormat),
                      //   moment(filter.caseCountDate.toDate, dateFormat),
                      // ]}
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
    </Spin>
  );
}

export default DetailedCaseListing;
