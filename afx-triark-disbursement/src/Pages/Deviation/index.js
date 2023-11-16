import { Button, Card, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import Spin from "../../Components/Spin";
import Tables from "../../Components/Table";
import { getDeviationDetails } from "../../Redux/Services/deviation.js";
import "./index.scss";

const columns = [
  {
    title: "Sr. No.",
    key: "srNo",
    width: 100,
    render: (record, index) => {
      return <span>{record?.key}</span>;
    },
  },
  {
    title: "Type",
    key: "type",
    render: (record, index) => {
      return (
        <span>
          {record?.value?.ismainapplicant
            ? "Application Id"
            : record?.value?.isguarantor
            ? "Guarantor"
            : "Co-Applicant"}
          {"-"}
          {record?.value?.applicationId}
        </span>
      );
    },
  },
  {
    title: "Criteria",
    key: "criteria",
    render: (record, index) => {
      return <span>{record?.value?.criteria}</span>;
    },
  },
  {
    title: "Rule",
    key: "rule",
    render: (record, index) => {
      return <span>{record?.value?.rule}</span>;
    },
  },
  {
    title: "Actual Value",

    key: "actualValue",
    render: (record, index) => {
      return <span>{record?.value?.actualValue}</span>;
    },
  },
  {
    title: "BRE Result",
    key: "breResult",
    render: (record, index) => {
      return <span>{record?.value?.breResult}</span>;
    },
  },
];

function deviation(props) {
  let applicantId = props.match.params.id;

  const [loader, setLoader] = useState(false);
  const { setHeading, setIsTimerVisible, start,reset } = useContext(App.CaseContext);
  const [data, setData] = React.useState({});
  useEffect(() => {
    setIsTimerVisible(true)
    setHeading("Deviation");
    //  let startTime = new Date().getTime();
    //  setStart(startTime)
    reset()
     start()

  }, []);

  useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getDeviationDetails({
        applicantUniqueId: props.match.params.id,
      });
      setData(response);
      setLoader(false);
    })();
      
       
  }, []);

  const deviationData = (data?.deviation || []).map((e, index) => {
    return { value: e, key: index + 1 };
  });

  const applicationId = deviationData
    ? deviationData[0]?.value?.applicationId
    : "";

  return (
    <Spin spinning={loader}>
      <Card
        className={"deviationWrapper"}
        title={`Application Id : ${applicationId}`}
      >
        <Row gutter={[0, 20]}>
          <Col lg={24}>
            <Tables
              columns={columns}
              dataSource={deviationData}
              size="medium"
              pagination={false}
            />
          </Col>
          <Col lg={14}></Col>
          <Col lg={5}>
            <p className={"finalDecision"}>Final Decision</p>
          </Col>
          <Col lg={4}>
            <p className="finalDecisionResult">
              {data?.breFinalResult ? data?.breFinalResult : ""}
            </p>
          </Col>
          <Col lg={24}>
            <Row type={"flex"} justify={"center"}>
              <Button
                className={"reset-button"}
                onClick={(e) => props.history.push("/disbursement/dashboard")}
              >
                {" "}
                Back{" "}
              </Button>
              <Button
                className={"reset-button"}
                onClick={(e) =>
                  props.history.push(`/case-summary/${props.match.params.id}`)
                }
              >
                {" "}
                Next{" "}
              </Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}

export default deviation;
