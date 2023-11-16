/* eslint-disable react-hooks/exhaustive-deps */
import { CloseCircleOutlined } from "@ant-design/icons";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Button, Card, Col, Input, Radio, Row, Table } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import logo from "../../assets/Images/logo.png";
import { setHeading } from "../../Redux/Action/App";
import { setLeadListType } from "../../Redux/Action/Leads";
import { getAllLeadsBySearch, getLeadList } from "../../Redux/Services/leads";
import { public_url } from "../../Utility/Constant";
import { getLoanSummary } from "../../Redux/Services/LoanSummary";

import "./style.css";

function LeadList(props) {
  const leadType = props.leadType;
  const [leadList, setLeadList] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [searchLead, setSearchLead] = React.useState("");
  const [totalCount, setTotalCount] = React.useState(0);
  const [count, setCount] = React.useState(10);
  const [spinning, setSpinning] = React.useState(false);

  const freezeUser =
    props.Summary &&
    props.Summary.loansummary.data &&
    props.Summary.loansummary.data.modelAccess &&
    props.Summary.loansummary.data.modelAccess[0] &&
    props.Summary.loansummary.data.modelAccess[0].read;

  const columns = [
    {
      title: "Application ID",
      dataIndex: "id",
      key: "name",
      width: 120,
      align: "center",
    },
    {
      title: "Sourcing App ",
      dataIndex: "sourcingApp",
      key: "sourcingApp",
      width: 120,
      align: "center",
    },
    {
      title: "Lead Name",
      dataIndex: "leadName",
      key: "age",
      width: 180,
      align: "center",
    },
    {
      title: "Mobile No",
      dataIndex: "customerMobile",
      key: "mobileNumber",
      align: "center",
    },
    {
      title: "Email Address",
      dataIndex: "customerEmail",
      key: "address",
      align: "center",
       width: 180,
    },

    {
      title: "Module Status",
      dataIndex: "consentStatus",
      key: "status",
      width: 160,
      align: "center",
    },
    {
      title: "Case at Module",
      dataIndex: "caseModule",
      key: "caseModule",
      width: 170,
      align: "center",
      render: (text) =>
        leadType.toLowerCase() === "prospect" ? (
          <span>{text ? text : "-"}</span>
        ) : (
          <span>{"-"}</span>
        ),
    },
    {
      title: "Final Status",
      // dataIndex: "caseStatus",
      key: "caseStatus",
      width: 150,
      align: "center",
      visible: false,
      render: (text) =>
        leadType.toLowerCase() === "prospect" ? (
          <span>{text.caseStatus ? text.caseStatus : text.consentStatus}</span>
        ) : (
          <span>{text.caseStatus}</span>
        ),
    },
    {
      title: leadType.toLowerCase() === "prospect" ? "Remark" : null,
      dataIndex: leadType.toLowerCase() === "prospect" ? "remark" : null,
      key: leadType.toLowerCase() === "prospect" ? "remark" : null,
      width: leadType.toLowerCase() === "prospect" ? 150 : null,
      align: leadType.toLowerCase() === "prospect" ? "center" : null,
    },
    {
      title: "Date/Time",
      dataIndex: "updatedDate",
      key: "date-time",
      render: (updatedDate) => moment(updatedDate).format("DD-MM-YYYY, h:mm a"), // new Date(updatedDate).toLocaleDateString(),
      width: 170,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      fixed: "right",
      render: (item, record) => {
        return (
          <Button
            style={{ border: "none" }}
            type="link"
            onClick={() =>
              handleRedirection(
                item.id,
                item.consentStatus,
                item.applicantUniqueId
              )
            }
          >
            {leadType === "Lead" ? "Edit" : "Update Profile"}{" "}
          </Button>
        );
      },
    },
  ];

  const redirectToAddLead = () => {
    let productId = props.match.params.type;
    props.history.push(`/lead/applicant/add/${productId}`);
  };

  const handleRedirection = (id, consentStatus, applicantUniqueId) => {
    if (consentStatus === "Consent Pending") {
      props.history.push(`/lead/applicant/edit/${id}`);
    } else if (consentStatus !== "Consent Approved") {
      props.history.push(`${public_url.loanSummary}/${id}`);
    } else {
      props.history.push(
        `/applicant${public_url.qde}/add/${applicantUniqueId}`
      );
    }
  };

  const getAllLeadsAPI = async () => {
    setSpinning(true);
    const response = await props.getAllLeadsBySearch({
      searchString: searchLead,
      employeeId: JSON.parse(localStorage.getItem("UserData"))
        ? JSON.parse(localStorage.getItem("UserData")).employeeId
        : "",
      branchName: JSON.parse(localStorage.getItem("UserData"))
        ? JSON.parse(localStorage.getItem("UserData")).branchName
        : "",
      pageNumber: pageNumber,
      leadType: leadType,
      count: 10,
      productId: props.match.params.type,
    });
    setLeadList(response && response.data && response.data.leadlist);
    setTotalCount(response && response.data && response.data.totalCount);
    setSpinning(false);
  };

  useEffect(() => {
    props.setHeading("Lead Management");
    if (true) {
      let userData = localStorage.getItem("UserData");

      let userDataCopy = JSON.parse(userData);
    }
  }, []);

  useEffect(() => {
    setSpinning(true);
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      getAllLeadsAPI();
    }, 900);

    return () => clearTimeout(delayDebounceFn);
  }, [searchLead, pageNumber]);

  useEffect(() => {
    getAllLeadsAPI();
  }, [leadType]);

  const onSearchChange = (e) => {
    setSearchLead(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="LeadList">
      <Card>
        <Row
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}>
          <Col span={6} offset={10}>
            <Radio.Group
              onChange={(e) => {
                setSearchLead("");
                props.setLeadListType(e.target.value);
                setPageNumber(1);
              }}
              value={leadType}
              optionType="button"
              className="boxShadow">
              <Radio.Button
                className={
                  leadType.toLowerCase() === "lead"
                    ? "cancled-button leadToggle"
                    : "cancled-button"
                }
                value="Lead"
                style={{ lineHeight: "41px", height: "45px" }}>
                Lead
              </Radio.Button>
              <Radio.Button
                className={
                  leadType.toLowerCase() !== "lead"
                    ? "cancled-button leadToggle"
                    : "cancled-button"
                }
                value="Prospect"
                style={{ lineHeight: "41px", height: "45px" }}>
                Prospect
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <div className="searchWrapper">
              <Input
                className="searchInput"
                placeholder={
                  leadType === "Lead" ? "Search Lead" : "Search Prospect"
                }
                value={searchLead || ""}
                onChange={(event) => {
                  onSearchChange(event);
                }}
                size="large"
              />
              {searchLead.length ? (
                <CloseCircleOutlined
                  onClick={() => {
                    setSearchLead("");
                  }}
                  className="closeIcon"
                />
              ) : null}
            </div>
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            {!freezeUser && (
              <div className="addIconWrapper">
                <Fab
                  variant="extended"
                  aria-label="Delete"
                  onClick={redirectToAddLead}
                  className="fab-add-parent">
                  <AddIcon
                    className={"addIconFab"}
                    variant="contained"
                    size="small"
                    color="primary"
                  />
                  <span className="addLeadtxt">Add-Lead</span>
                </Fab>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              loading={{
                spinning: spinning,
                indicator: (
                  <img alt="logo" src={logo} className="loader_leadList" />
                ),
                size: "large",
              }}
             
              scroll={{ x: 1500, y: 300 }}
              size="small"
              className="table-striped-rows"
              bordered
              tableLayout
              pagination={{
                onChange: (page) => {
                  setPageNumber(page);
                },
                current: pageNumber,
                total: totalCount,
                pageSize: count,
                showSizeChanger: false,
                position: ["bottomLeft"],
              }}
              dataSource={leadList}
              columns={columns}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

const mapDispatchToProps = {
  getLeadList,
  getAllLeadsBySearch,
  setHeading,
  setLeadListType,
  getLoanSummary,
};

const mapStateToProps = (state) => {
  return {
    qde: state.qde,
    leadType: state.leads.leadListType,
    Summary: state.Summary,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeadList);
