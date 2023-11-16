/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { Form, Button, Row, Radio, Card, Input } from "antd";
import PDC from "./PDC";
import CashOthers from "./CashOthers";
import {
  saveUpdateComment,
  getRepaymentData,
  saveUpdateRepayment,
  getCommentData,
  saveEnach,
  getEnach,
  getCamsDetails,
  postCamsDetails,
  getCams,
} from "../../Redux/Services/Repayment";
import { getQdeDetail } from "../../Redux/Services/Qde";
import { connect } from "react-redux";
import "./style.scss";
import { setHeading } from "../../Redux/Action/App";
import { getLoanSummary } from "../../Redux/Services/LoanSummary";
import Nach from "./Nach";

function Repayment(props) {
  const [mode, setMode] = React.useState("");
  const [repayMode, setRepayMode] = React.useState("");
  const [data, setData] = React.useState([]);
  const [enableDisbursement, setEnableDisbursement] = React.useState(false);
  const [reset, setReset] = React.useState(false);
  const [nach, setNach] = React.useState("");
  const [enachType, setEnachType] = React.useState("");
  const [error, setError] = React.useState(false);
  const [camsData, setCamsData] = React.useState(null);
  const [nachDetails, setEnachData] = React.useState(null);
  const [showFrame, setShowFrame] = React.useState(false);
  const [nachType, setNachType] = React.useState("");
  const [debitdate, setDebitDate] = React.useState("");
  const [aadharNo, setAadharNo] = React.useState("");
  const [form] = Form.useForm();
  const flagRef = useRef(true);

  const employeeId = localStorage.getItem("employeeId");

  const customFormat = (value) => {
    return value?.format("DD-MM-YYYY");
  };

  React.useEffect(() => {
    props.getQdeDetail({
      applicant_uniqueid: props.match.params.id,
      ismainapplicant: props.match.params.journey === "applicant",
      isguarantor: props.match.params.journey === "guarantor",
    });

    let userData = localStorage.getItem("UserData");
    let userDataCopy = JSON.parse(userData);
    props.getLoanSummary({
      applicant_uniqueid: props.match.params.id,
      roleId: userDataCopy && userDataCopy.roleId,
    });
  }, []);

  // set Heading
  React.useEffect(() => {
    props.setHeading("Repayment");
  }, [props.setHeading]);

  // If leadCode Get Repayment Data
  React.useEffect(() => {
    console.log(
      "props.qde?.getQdeSectionDetails?.data?",
      props.qde?.getQdeSectionDetails?.data
    );
    // let flag = true;
    if (
      props.qde?.getQdeSectionDetails?.data?.pangstdetails?.leadCode &&
      flagRef.current
    ) {
      (async () => {
        const response = await props.getRepaymentData({
          applicantUniqId: props.match.params.id,
          leadCode: props.qde.getQdeSectionDetails.data.pangstdetails.leadCode,
        });
        const data = await response?.payload?.data;
        setData(data);
        const repaymentMode =
          (await response) && response?.payload?.data?.repaymentMode;
        setMode(repaymentMode);
        setRepayMode(repaymentMode);
        if (response?.payload?.data?.paymentType) {
          setEnachType(response?.payload?.data?.paymentType);
        }
        if (response?.payload?.data?.repaymentMode === "enach") {
          setRepayMode("enach");
          setMode("enach");
          form.setFieldsValue({
            //  comments: commentResponse?.payload?.data?.disbursementComments,
            mode: response?.payload?.data?.repaymentMode,
          });
          const responseNach = await props.getEnach({
            applicantUniqueId: props.match.params.id,
          });
          if (
            responseNach?.payload?.data?.txnStatus === "success" &&
            !(freezeUser || freezeCase)
          ) {
            setEnableDisbursement(true);
          }
        } else {
          setError(true);
        }
        // setShowFrame(false);
        // setNachDetails(response?.payload?.data);
        const getData = async () => {
          const commentResponse = await props.getCommentData({
            applicantUniqId: props.match.params.id,
            type: "repayment",
          });

          if (response && response.payload) {
            form &&
              form.setFieldsValue({
                comments: commentResponse?.payload?.data?.disbursementComments,
                mode: response?.payload?.data?.repaymentMode,
              });

            if (response?.payload?.data?.repaymentMode) {
            }
          }
        };
        getData();
        flagRef.current = false;
      })();
    }
  }, [props.qde?.getQdeSectionDetails?.data?.pangstdetails?.leadCode]);

  React.useEffect(() => {
    (async () => {
      const response = await props?.getCamsDetails({
        id: props.match.params.id,
      });
      setCamsData(response?.data);
    })();
  }, []);

  const getCamsDeta = async (obj) => {
    const response = await props?.postCamsDetails(obj);
    return response;
  };

  // Form-On finish
  const onFinish = (values) => {
    setTimeout(() => {
      let userData = localStorage.getItem("UserData");
      let userDataCopy = JSON.parse(userData);
      props.getLoanSummary({
        applicant_uniqueid: props.match.params.id,
        roleId: userDataCopy && userDataCopy.roleId,
      });
    }, [1000]);
    props.saveUpdateComment({
      applicantUniqId: props.match.params.id,
      disbursementComments: values.comments,
      employeeId: employeeId,
      repaymentMode: mode,
      type: "repayment",
    });
  };

  //  Handle Form Change
  const handleFormChange = (changedFields, allFields) => {
    setMode(allFields.mode);
    if (changedFields.mode) {
      form && form.resetFields(["comments"]);
      setReset(true);
      setEnableDisbursement(false);
    }
  };

  const getEnachDetails = async (aadharNo) => {
    const response = await props.saveUpdateRepayment({
      applicantUniqId: props.match.params.id,
      debitStartDate: debitdate,
      repaymentMode: "enach",
      paymentType: nachType,
      aadharNo:aadharNo
    });

    let error = await response?.payload?.error;
    if (!error) {
      const response = await props?.getCams({
        id: props.match.params.id,
      });
      // setNachDetails(response?.payload?.data);
      if (!response?.error) {
        setShowFrame(true);
        setEnachData(response?.data);
      }
    }
  };

  const freezeCase =
    props.Summary &&
    props.Summary.loansummary &&
    props.Summary.loansummary.data &&
    props.Summary.loansummary.data.mainapplicant &&
    props.Summary.loansummary.data.mainapplicant.preSalesFreeze;

  const freezeUser =
    props.Summary &&
    props.Summary.loansummary &&
    props.Summary.loansummary.data &&
    props.Summary.loansummary.data.modelAccess &&
    props.Summary.loansummary.data.modelAccess[0] &&
    props.Summary.loansummary.data.modelAccess[0].read;

  const inputProps = {
    readOnly: freezeCase || freezeUser,
    disabled: freezeCase || freezeUser,
  };

  // Enable Submit to disbursement
  React.useEffect(() => {
    if (props.repayment?.saveRepayment) {
      setEnableDisbursement(true);
    }
  }, [props.repayment]);

  //Revisit if Success then enable Submit to Disbursement
  React.useEffect(() => {
    if (props.repayment?.saveRepayment) {
      setEnableDisbursement(true);
    }
  }, [props.repayment]);

  return (
    <Card>
      <div className="AddLeadContainer p-3">
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          // onFinishFailed={onFinishFailed}
          form={form}
          name="control-hooks"
        >
          <span className="QDe-para-normal">Repayment Mode</span>
          <br />

          <Row>
            <Form.Item
              name="mode"
              rules={[
                {
                  required: true,
                  message: "Repayment Mode is mandatory",
                },
              ]}
            >
              <Radio.Group
                // disabled={freezeCase || freezeUser}
                style={{ display: "flex", width: "100%" }}
                className="QDe-scheme-radio"
              >
                <Radio value={"enach"}>NACH</Radio>
                <Radio value={"pdc"}>PDC</Radio>
                {/* <Radio value={"cash"}>Cash</Radio> */}
                <Radio value={"other"}>Others</Radio>
              </Radio.Group>
            </Form.Item>
          </Row>
          {mode === "enach" && (
            <Nach
              saveRepayment={props.repayment?.saveRepayment}
              saveUpdateRepayment={props.saveUpdateRepayment}
              saveEnach={props.saveEnach}
              getEnach={props.getEnach}
              applicantUniqueId={props.match.params.id}
              data={data}
              nach={nach}
              setError={setError}
              error={error}
              enachType={enachType}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              freezeCase={freezeCase}
              freezeUser={freezeUser}
              getCamsDeta={getCamsDeta}
              camsData={camsData}
              getEnachDetails={getEnachDetails}
              setShowFrame={setShowFrame}
              showFrame={showFrame}
              nachDetails={nachDetails}
              setDebitDate={setDebitDate}
              setNachType={setNachType}
              setAadharNo={setAadharNo}
              aadharNo={aadharNo}
            />
          )}
          {mode === "pdc" && (
            <PDC
              saveUpdateRepayment={props.saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              data={data}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              freezeCase={freezeCase}
              freezeUser={freezeUser}
            />
          )}
          {mode === "cash" && (
            <CashOthers
              saveUpdateRepayment={props.saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              cash={true}
              mode={mode}
              data={data}
              repayMode={repayMode}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              freezeCase={freezeCase}
              freezeUser={freezeUser}
            />
          )}
          {mode === "other" && (
            <CashOthers
              saveUpdateRepayment={props.saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              data={data}
              mode={mode}
              repayMode={repayMode}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              freezeCase={freezeCase}
              freezeUser={freezeUser}
            />
          )}
          <span className="QDe-para-normal">Submit to Disbursement</span>
          <br />
          <Form.Item
            name="comments"
            label="Comments"
            rules={[
              {
                required: true,
                message: "comment is mandatory",
              },
            ]}
          >
            <Input.TextArea
              disabled={inputProps.readOnly}
              fullWidth
              multiline
              rowsMax={4}
              InputLabelProps={{
                shrink: true,
              }}
              key={Math.random()}
            />
          </Form.Item>

          <Row justify={"center"}>
            {!(freezeCase || freezeUser) && (
              <Button
                className="save-button mr-3"
                htmlType={"submit"}
                disabled={!enableDisbursement}
              >
                {" "}
                Submit to Disbursement{" "}
              </Button>
            )}
          </Row>
        </Form>
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    repayment: state.repayment,
    Summary: state.Summary,
    qde: state.qde,
  };
};

const mapDispatchToProps = {
  saveUpdateComment,
  getRepaymentData,
  saveUpdateRepayment,
  setHeading,
  getCommentData,
  getLoanSummary,
  saveEnach,
  getQdeDetail,
  getEnach,
  getCamsDetails,
  postCamsDetails,
  getCams,
};

export default connect(mapStateToProps, mapDispatchToProps)(Repayment);
