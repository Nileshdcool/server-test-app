import { Button, Card, Col, List, Row, Tabs } from "antd";
import { saveAs } from "file-saver";
import React, { useContext, useEffect, useState } from "react";
import App from "../../App";
import Spin from "../../Components/Spin";
import {
  getCaseReport,
  createOrUpdateCustomer,
} from "../../Redux/Services/Cases";
import { BASE } from "../../Redux/Utils/httpInterceptor";
import "./index.scss";

function CaseReports(props) {
  const { TabPane } = Tabs;

  const [resData, setResData] = useState([]);
  const [loader, setLoader] = useState(false);

  const { setHeading } = useContext(App.CaseContext);

  useEffect(() => {
    setHeading("Case Reports");
  }, []);

  const getAPIData = async () => {
    setLoader(true);
    const response = await getCaseReport({
      applicantUniqueId: props.match.params.id,
    });
    const data = [
      ...response.mainapplicant.map((e) => {
        e.title = "Main App";
        e.ismainapplicant = true;
        e.isguarantor = false;
        return e;
      }),
      ...response.coapplicant.map((e, index) => {
        e.title = `Co App ${index + 1}`;
        e.ismainapplicant = false;
        e.isguarantor = false;
        return e;
      }),
      ...response.gurantor.map((e, index) => {
        e.title = `Guarantor ${index + 1}`;
        e.ismainapplicant = false;
        e.isguarantor = true;
        return e;
      }),
    ];
    setResData(data);
    setLoader(false);
  };
  useEffect(() => {
    getAPIData();
  }, []);

  const crifCall = (item) => {
    const getData = async () => {
      setLoader(true);
      const response = await createOrUpdateCustomer({
        applicant_uniqueid:
          item?.applicantUniqueId || item?.coapplicantUniqueId,
        ismainapplicant: item?.ismainapplicant,
        isguarantor: item?.isguarantor,
        type: "bureau",
      });
      if (response) {
        setLoader(false);
        getAPIData();
      }
    };
    getData();
  };

  const tabs = resData.map((item, index) => {
    return (
      <TabPane tab={item.title} key={`case_report_${index}`}>
        <Col lg={24}>
          <List itemLayout="horizontal">
            <List.Item>
              <List.Item.Meta title={"Bureau Report"} />
              {/* Added  Manual Bureau Call*/}
              <div style={{ marginRight: 15 }}>
                <Button
                  className={"reset-button"}
                  onClick={() => crifCall(item)}
                >
                  Manual Bureau Call
                </Button>
              </div>
              {/* Added  Manual Bureau Call*/}
              <div>
                <Button
                  className={"reset-button"}
                  onClick={(e) => {
                    saveAs(item.crifReport.replace("/var/www/html", BASE));
                  }}
                >
                  Download
                </Button>
              </div>
            </List.Item>
            {item.bankReport && (
              <List.Item>
                <List.Item.Meta title={"Bank Statement Report"} />
                <div>
                  <Button
                    className={"reset-button"}
                    onClick={(e) =>
                      saveAs(item.bankReport.replace("/var/www/html", BASE))
                    }
                  >
                    Download
                  </Button>
                </div>
              </List.Item>
            )}
            {item.itrReport && (
              <List.Item>
                <List.Item.Meta title={"ITR Report"} />
                <div>
                  <Button
                    className={"reset-button"}
                    onClick={(e) =>
                      saveAs(item.itrReport.replace("/var/www/html", BASE))
                    }
                  >
                    Download
                  </Button>
                </div>
              </List.Item>
            )}
            {item.loanAgreement && (
              <List.Item>
                <List.Item.Meta title={"Loan Agreement"} />
                <div>
                  <Button
                    className="marginRight10"
                    target="_blank"
                    href={item.loanAgreement.replace("/var/www/html", BASE)}
                  >
                    View
                  </Button>
                  <Button
                    className={"reset-button"}
                    onClick={(e) =>
                      saveAs(item.loanAgreement.replace("/var/www/html", BASE))
                    }
                  >
                    Download
                  </Button>
                </div>
              </List.Item>
            )}
            {item.bankStatementList && (
              <List.Item>
                <li>
                  <h4 style={{ marginBottom: "10%", marginTop: "5%" }}>
                    Bank Statement Analysis{" "}
                  </h4>
                  {item.bankStatementList.map((item) => {
                    return (
                      <a
                        href={item.finbitFileLink.replace(
                          "/var/www/html",
                          BASE
                        )}
                      >
                        {item.fileName} &nbsp;&nbsp;
                        <br />
                        <br />
                      </a>
                    );
                  })}
                  <br />
                </li>
              </List.Item>
            )}
          </List>
        </Col>
      </TabPane>
    );
  });

  return (
    <Spin spinning={loader}>
      <Card>
        <Tabs defaultActiveKey="1">{tabs}</Tabs>
        <Row type={"flex"} justify={"center"}>
          <Button
            onClick={(e) => {
              props.history.push({
                pathname: `/case-summary/${props.match.params.id}`,
                state: { from: props.location.state?.from },
              });
            }}
            className={"reset-button"}
          >
            Back To Case Summary
          </Button>
        </Row>
      </Card>
    </Spin>
  );
}

export default CaseReports;
