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

function caseHistory(props) {
  const [response, setResponse] = useState([]);

  const { setHeading } = useContext(App.CaseContext);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setHeading("Case History");
  }, []);

  useEffect(() => {
    const getData = async (e) => {
      setLoader(true);
      const response = await getCaseHistory({
        applicantUniqueId: props.match.params.id,
      });
      if (response?.caseHistoryList) {
        setResponse(response?.caseHistoryList);
      }
      setLoader(false);
    };
    getData();
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
                onClick={(e) => {
                  props.history.push({
                    pathname: `/documents-upload/${props.match.params.id}`,
                    state: { from: props.location.state?.from },
                  });
                  // props.history.push(
                  //   `/documents-upload/${props.match.params.id}`
                  // );
                }}
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

export default caseHistory;
