import { Button, Card, Col, Form, Row, DatePicker, Input } from "antd";
import React, { useContext, useEffect, useState, useRef } from "react";
import App from "../../App";
import InputText from "../../Components/Input";
import Spin from "../../Components/Spin";
import Tables from "../../Components/Table";
import { motion } from "framer-motion";
import { getPaymentStatusCaseListing } from "../../Redux/Services/dashboard";
import Cards from "./Cards";
import "./index.scss";
import moment from "moment";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";

const { Search } = Input;

const columns = [
  {
    title: "Application ID",
    dataIndex: "leadId",
    key: "leadId",
    width: 150,
  },
  {
    title: "Sourcing App",
    dataIndex: "sourcingApp",
    key: "sourcingApp",
    width: 150,
  },
  {
    title: "Applicant Name",
    dataIndex: "applicantName",
    key: "applicantName",
    width: 200,
  },
  {
    title: "FOS ID",
    dataIndex: "employeeId",
    key: "employeeId",
    width: 200,
  },
  {
    title: "Dedupe Match",
    dataIndex: "dedupeMatch",
    key: "dedupeMatch",
    width: 120,
  },
  {
    title: "Dedupe Application ID",
    dataIndex: "dedupeApplicantId",
    key: "dedupeApplicantId",
    width: 200,
    align: "center",
  },
  {
    title: "Branch",
    dataIndex: "branch",
    key: "branch",
    width: 120,
  },
  {
    title: "Loan Amount",
    dataIndex: "loanAmount",
    key: "loanAmount",
    width: 120,
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
    title: "Updated Date",
    dataIndex: "updatedDate",
    key: "updatedDate",
    width: 120,
  },
  {
    title: "Scheme",
    dataIndex: "scheme",
    key: "scheme",
    width: 100,
  },
  {
    title: "Tenure (Months)",
    dataIndex: "tenure",
    key: "tenure",
    width: 100,
  },
  {
    title: "ROI (%)",
    dataIndex: "roi",
    key: "roi",
    width: 70,
  },
  {
    title: "Source Type",
    dataIndex: "sourceType",
    key: "sourceType",
    width: 120,
  },
  {
    title: "Vehicle Type",
    dataIndex: "vehicleType",
    key: "vehicleType",
    width: 120,
  },
  {
    title: "Vehicle Model",
    dataIndex: "vehicleModel",
    key: "vehicleModel",
    width: 120,
  },
  {
    title: "Dealer Name",
    dataIndex: "dealerName",
    key: "dealerName",
    width: 320,
  },
  {
    title: "DSA Name",
    dataIndex: "dsaName",
    key: "dsaName",
    width: 200,
  },
];

const redirect = (history, record) => {
  history.push(`/documents-upload/${record.applicationId}`);
  history.push({
    pathname: `/documents-upload/${record.applicationId}`,

    state: { flagPaymentStatus: true },
  });
};

function index(props) {
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

  const [tilesCount, setTilesCount] = useState("");

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
      setSpinning(true);

      const caseList = await getPaymentStatusCaseListing({
        ...filter.caseList,
        ...filter.caseCount,
      });
      //

      setCaseList(caseList.caseList);

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
      const caseList = await getPaymentStatusCaseListing({
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
        name="dynamic_form_nest_item"
        autoComplete="off"
        form={form}
        s
      >
        <Card>
          <Row className={"dashboardContainer"} gutter={[0, 20]}>
            <Col lg={24}>
              <Card
                title={"Case Listing"}
                bordered={false}
                extra={
                  <Row type={"flex"} gutter={[20, 35]}>
                    <Col>
                      <Form.Item name={"rangepicker"}>
                        <RangePicker
                          className="rangepicker-dashboard"
                          onChange={onChange}
                          placeholder={["From Date", "To Date"]}
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
                        htmlType={"reset"}
                        onClick={(e) => {
                          form.resetFields();

                          setFilter(initialFilters);
                        }}
                        className={"reset-button"}
                      >
                        Reset
                      </Button>
                    </Col>
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

export default index;
