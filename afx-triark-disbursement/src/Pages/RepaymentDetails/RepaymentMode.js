/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Form, Button, Row, Radio, Card, Input } from "antd";
import PDC from "./PDC";
import CashOthers from "./CashOthers";
import {
  saveUpdateComment,
  getRepaymentDetails,
  saveUpdateRepayment,
  getCommentData,
  // saveEnach,
  getNachDetails,
} from "./../../Redux/Services/repayment";
// import { getQdeDetail } from "../../Redux/Services/Qde";
import { connect } from "react-redux";
import "./style.scss";
// import { setHeading } from "../../Redux/Action/App";
// import { getLoanSummary } from "../../Redux/Services/LoanSummary";
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
  const [repaymentDetails, setRepaymentDetails] = React.useState(null);
  const [nachDetails, setNachDetails] = React.useState(null);

  const [form] = Form.useForm();

  const employeeId = localStorage.getItem("employeeId");

  React.useEffect(() => {
    let userData = localStorage.getItem("UserData");
    let userDataCopy = JSON.parse(userData);
  }, []);

  let freezeUser =
    props?.caseSummaryData?.mainapplicant?.[0]?.disbursementFreeze;
  let freezeCase = props?.caseSummaryData?.modelAccess?.[0]?.read;

  //  React.useEffect(() => {
  //   (async () => {
  //     const response = await getRepaymentDetails({ applicantUniqId: props.match.params.id });
  //     setRepaymentDetails(response);
  //     setMode(response?.repaymentMode);
  //     setRepayMode(response?.repaymentMode);
  //     form?.setFieldsValue({
  //       mode: response?.repaymentMode,
  //     });
  //     if (response?.repaymentMode === "enach") {
  //       // const response = await getNachDetails({ applicantUniqueId: props.match.params.id });
  //       // setNachDetails(response);
  //     }
  //   })();
  // }, []);

  React.useEffect(() => {
    (async () => {
      const response = await getRepaymentDetails({
        applicantUniqId: props.match.params.id,
      });
      setRepaymentDetails(response);
      setMode(response?.repaymentMode);
      setRepayMode(response?.repaymentMode);
      form?.setFieldsValue({
        mode: response?.repaymentMode,
      });
      const data = await response?.payload?.data;
      setData(data);
      const repaymentMode = (await response) && response?.repaymentMode;
      setMode(repaymentMode);
      setRepayMode(repaymentMode);
      if (response?.paymentType) {
        setEnachType(response?.paymentType);
      }

      if (response?.repaymentMode === "enach") {
        setRepayMode("enach");
        setMode("enach");
        form.setFieldsValue({
          //  comments: commentResponse?.payload?.data?.disbursementComments,
          mode: response?.repaymentMode,
        });
        const responseNach = await getNachDetails({
          applicantUniqueId: props.match.params.id,
        });
        setNachDetails(responseNach);

        if (
          responseNach?.status?.toLowerCase() === "success" &&
          !(freezeUser || freezeCase)
        ) {
          setEnableDisbursement(true);
        }
      } else {
        setError(true);
      }
    })();
    // }
  }, []);

  const onFinish = (values) => {};

  //  Handle Form Change
  const handleFormChange = (changedFields, allFields) => {
    setMode(allFields.mode);
    if (changedFields.mode) {
      form && form.resetFields(["comments"]);
      setReset(true);
      setEnableDisbursement(false);
    }
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
                disabled={freezeCase || freezeUser}
                style={{ display: "flex", width: "100%" }}
                className="QDe-scheme-radio"
              >
                <Radio value={"salary"}>Salary</Radio>

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
              saveUpdateRepayment={saveUpdateRepayment}
              // saveEnach={saveEnach}
              getNachDetails={getNachDetails}
              nachDetails={nachDetails}
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
              repaymentDetails={repaymentDetails}
              freezeCase={freezeCase}
              freezeUser={freezeUser}
            />
          )}
          {mode === "pdc" && (
            <PDC
              saveUpdateRepayment={saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              data={data}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              repaymentDetails={repaymentDetails}
              freezeCase={freezeCase}
              freezeUser={freezeUser}
            />
          )}
          {mode === "cash" && (
            <CashOthers
              saveUpdateRepayment={saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              cash={true}
              mode={mode}
              data={data}
              repayMode={repayMode}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              repaymentDetails={repaymentDetails}
              freezeCase={freezeCase}
              freezeUser={freezeUser}
            />
          )}
          {mode === "other" && (
            <CashOthers
              saveUpdateRepayment={saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              data={data}
              mode={mode}
              repayMode={repayMode}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              repaymentDetails={repaymentDetails}
              freezeCase={freezeCase}
              freezeUser={
                props?.caseSummaryData?.mainapplicant[0].disbursementFreeze
              }
            />
          )}
        </Form>
      </div>
    </Card>
  );
}

export default Repayment;
