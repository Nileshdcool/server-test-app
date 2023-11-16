/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Form, Button, Row, Radio, Card, Input } from "antd";
import PDC from "./PDC";
import CashOthers from "./CashOthers";
import { camsDataTwin2 } from "../../Redux/Services/repaymentTwin2";
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
      const response = await camsDataTwin2({
        gupdhupId: props.match.params.id,
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
        // const responseNach = await getNachDetails({
        //   applicantUniqueId: props.match.params.id,
        // });
        const responseNach = {
          emi: 4983,
          bankCode: "STATE BANK OF INDIA",
          mobileNumber: 9307631823,
          applicantUniqueId: "93076318231653917160107",
          emailId: "Nznnz@gmail.com",
          accountNumber: "9650058505058584",
          ifsc: "SBIN0000744",
          accountHolderName: "Avinash J",
          tenure: 12,
        };
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

  // If leadCode Get Repayment Data
  // React.useEffect(() => {
  //     (async () => {
  //       const response = await getRepaymentDetails({
  //         applicantUniqId: props.match.params.id,
  //       });
  //       const data = await response;
  //       setData(data);
  //       const repaymentMode =
  //         (await response) && response?.repaymentMode;
  //       setMode(repaymentMode);
  //       setRepayMode(repaymentMode);
  //       if (response?.payload?.data?.paymentType) {
  //         setEnachType(response?.payload?.data?.paymentType);
  //       }
  //       if (response?.payload?.data?.repaymentMode === "enach") {
  //         setRepayMode("enach");
  //         setMode("enach");
  //         form.setFieldsValue({
  //           mode: response.repaymentMode,
  //         });
  //         const responseNach = await getNachDetails({
  //           applicantUniqueId: props.match.params.id,
  //         });
  //         if (
  //           responseNach?.payload?.data?.txnStatus === "success" &&
  //           !(freezeUser || freezeCase)
  //         ) {
  //           setEnableDisbursement(true);
  //         }
  //       } else {
  //         setError(true);
  //       }
  //       flag = false;
  //     })();
  // }, []);

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
                // disabled={freezeCase || freezeUser}
                style={{ display: "flex", width: "100%" }}
                className="QDe-scheme-radio"
              >
                <Radio value={"enach"}>NACH</Radio>
                {/* <Radio value={"pdc"}>PDC</Radio> */}
                {/* <Radio value={"cash"}>Cash</Radio> */}
                {/* <Radio value={"other"}>Others</Radio> */}
              </Radio.Group>
            </Form.Item>
          </Row>
          {mode === "enach" && (
            <Nach
              saveRepayment={props.repayment?.saveRepayment}
              // saveUpdateRepayment={saveUpdateRepayment}
              // saveEnach={saveEnach}
              // getNachDetails={getNachDetails}
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
              // freezeCase={freezeCase}
              // freezeUser={freezeUser}
            />
          )}
          {mode === "pdc" && (
            <PDC
              // saveUpdateRepayment={saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              data={data}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              repaymentDetails={repaymentDetails}
              // freezeCase={freezeCase}
              // freezeUser={freezeUser}
            />
          )}
          {mode === "cash" && (
            <CashOthers
              // saveUpdateRepayment={saveUpdateRepayment}
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
              // freezeCase={freezeCase}
              // freezeUser={freezeUser}
            />
          )}
          {mode === "other" && (
            <CashOthers
              // saveUpdateRepayment={saveUpdateRepayment}
              applicantUniqueId={props.match.params.id}
              data={data}
              mode={mode}
              repayMode={repayMode}
              history={props.history}
              setEnableDisbursement={setEnableDisbursement}
              reset={reset}
              setReset={setReset}
              repaymentDetails={repaymentDetails}
              // freezeCase={freezeCase}
              // freezeUser={freezeUser}
            />
          )}
        </Form>
      </div>
    </Card>
  );
}

export default Repayment;