import { Button, Card, Col, Form, Row, DatePicker, Input } from "antd";
import React, { useContext, useEffect, useState, useRef } from "react";
import App from "../../App";

import Spin from "../../Components/Spin";
import Tables from "../../Components/Table";

import { getGupshupDashboardDataByPaymentStatus } from "../../Redux/Services/dashboard";

import "./index.scss";

import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

const { Search } = Input;

const columns = [
  {
    title: "Application ID",
    dataIndex: "applicationId",
    key: "applicationId",
    width: 150,
    fixed: "left",
    align: "center",
  },
  {
    title: "Source Type",
    dataIndex: "sourceType",
    key: "sourceType",
    width: 150,
  },
  {
    title: "Applicant Name",
    dataIndex: "applicantName",
    key: "applicantName",
    width: 200,
  },

  {
    title: "Created Date",
    dataIndex: "createdDate",
    key: "createdDate",
    width: 120,
    render: (text, record) => {
      // Assuming "updatedDate" is in a standard date format
      const formattedDate = moment(text).format('YYYY-MM-DD HH:mm:ss'); // Custom format
      return formattedDate;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
  },

  {
    title: "Tenure (Months)",
    dataIndex: "tenure",
    key: "tenure",
    width: 100,
  },

  {
    title: "Vehicle Type",
    dataIndex: "vehicleType",
    key: "vehicleType",
    width: 150,
  },
  {
    title: "Vehicle Model",
    dataIndex: "vehicleModel",
    key: "vehicleModel",
    width: 150,
  },
  {
    title: "Dealer Name",
    dataIndex: "dealerName",
    key: "dealerName",
    width: 300,
  },
  {
    title: "ROI%",
    dataIndex: "roi",
    key: "roi",
    width: 120,
  },
  {
    title: "Loan Amount",
    dataIndex: "loanAmount",
    key: "loanAmount",
    width: 160,
  },
];

const redirect = (history, record) => {
  history.push({
    pathname: `/case-detailsTwin2/${record.id}`,
    state: { flagPaymentStatus: true, applicationId: record?.applicationId },
  });
};

function PaymentListingTwin2(props) {
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const initialFilters = {
    caseCount: {
      branchName: localStorage.getItem("branchName")?.toString()?.split(","),
      employeeId: localStorage.getItem("empId"),
      fromDate: "",
      toDate: "",
    },
    caseCountDate: {
      fromDate: "",
      toDate: "",
    },
    caseList: { rcuFilter: "", searchString: "", pageNumber: 1, pageSize: 10 },
  };
  const [spinning, setSpinning] = React.useState(false);
  const [filter, setFilter] = useState(initialFilters);

  const { setHeading } = useContext(App.CaseContext);

  const [caseList, setCaseList] = useState([]);

  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(100);
  const carousel = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setHeading("Dashboard");

    return () => {
      const a = localStorage.getItem("token");
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

  useEffect(() => {
    const mainCondition =
      filter.caseCount.fromDate === "" && filter.caseCount.toDate === "";
    const filterCondition =
      filter.caseCount.fromDate !== "" && filter.caseCount.toDate !== "";
    const getData = async () => {
      // setLoader(true);
      //   setSpinning(true);

      const res = await getGupshupDashboardDataByPaymentStatus({
        ...filter.caseList,
        ...filter.caseCount,
      });
      //

      setCaseList(res.gupshupList);
      setCount(res?.pageSize);

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
        filter.caseCount.fromDate !== "" && filter.caseCount.toDate !== "";
      if (filterCondition) {
        dateFilter = filter.caseCount;
      }
      setSpinning(true);
      const res = await getPaymentStatusCaseListing({
        ...filter.caseList,
        ...dateFilter,
      });
      // setCaseList(caseList.caseList);
      //
      // setCount(caseList?.listCount);
      setCaseList(res.gupshupList);
      setCount(res?.pageSize);
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
        name="dynamic_form_nest_item"
        autoComplete="off"
        form={form}
        s
      >
        <Card>
          <Row className={"dashboardContainer"} gutter={[0, 20]}>
            <Col lg={24}>
              <Card
                title={"Payment Status Dashboard"}
                bordered={false}
                extra={
                  <Row type={"flex"} gutter={[20, 35]}>
                    <Col>
                      <Form.Item name={"search"}>
                        <Input
                          placeholder="Search"
                          allowClear
                          className="search-dashboard"
                          size="large"
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
                  size="small"
                  loading={{
                    indicator: (
                      <div>
                        <LoadingOutlined style={{ fontSize: 40 }} spin />
                      </div>
                    ),
                    spinning: false,
                  }}
                  columns={columns}
                  dataSource={caseList}
                  scroll={{ x: 1000 }}
                  onRow={(record, index) => {
                    return {
                      onClick: (e) => redirect(props.history, record),
                      // onClick: (e) => (props.history, record),
                    };
                  }}
                  rowClassName={(record, index) => {
                    return record?.isColourChange
                      ? "row-color"
                      : record?.isColourChangeCaseRelook && "row-color-alt";
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
                    position: ["bottomLeft"],
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

export default PaymentListingTwin2;
