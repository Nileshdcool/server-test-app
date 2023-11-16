import { Button, Card, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { getCaseHistory } from "../../Redux/Services/Cases";
import App from "../../App";
import Spin from "../../Components/Spin";
import Tables from "../../Components/Table";

const columns = [
  {
    title: "LOS Application ID",
    dataIndex: "leadId",
    key: "leadId",
    width: 200,
  },
  {
    title: "User",
    key: "userName",
    render: (row) => {
      return (
        <Row type="flex">
          <Col lg="24">
            {" "}
            <>
              {" "}
              {row.userName} <br /> {row.roleName}
            </>
          </Col>
        </Row>
      );
    },
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "To",
    dataIndex: "to",
    key: "to",
  },
  {
    title: "Date & Time",
    key: "date",
    render: (row) => {
      return (
        <Row type="flex">
          <Col lg="24">
            {" "}
            <>
              {" "}
              {row.date} <br /> {row.time}
            </>
          </Col>
        </Row>
      );
    },
  },
  {
    title: "Reason",
    dataIndex: "reason",
    key: "reason",
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
  },
];

function CaseHistoryTwin2(props) {
  const [response, setResponse] = useState([]);

  const { setHeading } = useContext(App.CaseContext);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setHeading("Case History");
  }, []);

  useEffect(() => {
    const response = {
      caseHistoryList: [
        {
          date: "02-06-2022",
          caseStatus: "Query Resolved",
          employeeId: "adm001",
          userName: "Kalyanib ",
          leadCode: "NTWDLR300520221326009691",
          roleName: "SALES EXECUTIVE",
          comment: "Sub to credit 1",
          from: "Sales Module",
          applicantUniqueId: "93076318231653917160107",
          time: "06:52 AM",
          to: "Credit Module",
          id: 2229,
          leadId: 85335,
        },
        {
          date: "01-06-2022",
          caseStatus: "In Query",
          employeeId: "adm001",
          userName: "Kalyanib ",
          leadCode: "NTWDLR300520221326009691",
          roleName: "SALES EXECUTIVE",
          comment: "test11",
          from: "Credit Module",
          applicantUniqueId: "93076318231653917160107",
          time: "04:17 PM",
          to: "Sales Module",
          id: 2219,
          leadId: 85335,
        },
        {
          date: "01-06-2022",
          caseStatus: "Query Resolved",
          employeeId: "adm001",
          userName: "Kalyanib ",
          leadCode: "NTWDLR300520221326009691",
          roleName: "SALES EXECUTIVE",
          comment: "Sub crd 1",
          from: "Sales Module",
          applicantUniqueId: "93076318231653917160107",
          time: "02:11 PM",
          to: "Credit Module",
          id: 2205,
          leadId: 85335,
        },
        {
          date: "01-06-2022",
          caseStatus: "In Query",
          employeeId: "adm001",
          userName: "Kalyanib ",
          leadCode: "NTWDLR300520221326009691",
          roleName: "SALES EXECUTIVE",
          comment: "test",
          from: "Credit Module",
          applicantUniqueId: "93076318231653917160107",
          time: "02:05 PM",
          to: "Sales Module",
          id: 2202,
          leadId: 85335,
        },
        {
          date: "01-06-2022",
          caseStatus: "Manual Underwriting",
          employeeId: "adm001",
          userName: "Kalyanib ",
          leadCode: "NTWDLR300520221326009691",
          roleName: "SALES EXECUTIVE",
          comment: "Sub to credit test",
          from: "Sales Module",
          applicantUniqueId: "93076318231653917160107",
          time: "01:14 PM",
          to: "Credit Module",
          id: 2200,
          leadId: 85335,
        },
      ],
    };
    setResponse(response?.caseHistoryList);
    // const getData = async (e) => {
    //   setLoader(true);
    //   const response = await getCaseHistory({
    //     applicantUniqueId: props.match.params.id,
    //   });
    //   if (response?.caseHistoryList) {
    //     setResponse(response?.caseHistoryList);
    //   }
    //   setLoader(false);
    // };
    // getData();
  }, []);

  return (
    <Spin spinning={loader}>
      <Card className={"caseHistoryWrapper"} title={`Case History`}>
        <Row gutter={[0, 20]}>
          <Col lg={24}>
            <Tables
              columns={columns}
              dataSource={response}
              size="medium"
              pagination={true}
            />
          </Col>
          <Col lg={24}>
            <Row type={"flex"} justify={"center"}>
              <Button
                className={"reset-button"}
                onClick={(e) =>
                  props.history.push(
                    `/case-detailsTwin2/${props.match.params.id}`
                  )
                }
              >
                {" "}
                Back to Documents Upload{" "}
              </Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}

export default CaseHistoryTwin2;
