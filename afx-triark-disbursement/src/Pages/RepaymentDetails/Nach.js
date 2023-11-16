import React from "react";
import { Form, Button, Row, Upload, Radio, Col, DatePicker } from "antd";
import TextField from "@material-ui/core/TextField";
// import { public_url } from "../../Utility/Constant";
// import SelectIcon from "../../assets/Images/select.svg";
import _ from "lodash";
import { UploadOutlined } from "@ant-design/icons";
import Label from "./Label";
import moment from "moment";
import {
  getCamsData,
  getCamsUrl,
  camsData,
  saveUpdateRepayment,
} from "./../../Redux/Services/repayment";

function Nach(props) {
  const [form] = Form.useForm();
  const [physicalNach, setPhysicalNach] = React.useState(false);
  const [eNach, setENach] = React.useState(false);
  const [mode, setMode] = React.useState("N");
  const [proceed, setProceed] = React.useState(false);
  const [showFrame, setShowFrame] = React.useState(true);
  const [data, setData] = React.useState("");
  const [nachDetails, setNachDetails] = React.useState("");
  const [nachEnable, setNachEnable] = React.useState(true);
  const [camsDataa, setCamsData] = React.useState(null);
  const [isAadharEmpty, setIsAadharEmpty] = React.useState(true);

  const onFinish = async (values) => {
    props.saveUpdateRepayment({
      repaymentMode: "nach",
      applicantUniqId: props.applicantUniqueId,
      aadharNo: form && form.getFieldValue("aadharNo"),
      authenticationMode: mode,
    });
  };

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields?.nachType === "PhysicalNACH") {
      setPhysicalNach(true);
      setENach(false);
      setProceed(false);
    } else if (changedFields?.nachType === "enach") {
      setPhysicalNach(false);
      setENach(true);
      setProceed(false);
    } else if (changedFields?.debitStartDate !== null) {
      setPhysicalNach(false);
      setENach(true);
      setProceed(true);
    }
    if (_?.isEmpty(allFields?.aadharNo)) {
      setIsAadharEmpty(true);
    } else {
      setIsAadharEmpty(false);
    }
    if (_?.isEmpty(allFields?.debitStartDate)) {
      setIsAadharEmpty(true);
    } else {
      setIsAadharEmpty(false);
    }
  };

  const customFormat = (value) => {
    return value?.format("DD-MM-YYYY");
  };

  const onFinishFailed = (errorInfo) => {};

  // const inputProps = {
  //   readOnly: props.freezeCase || props.freezeUser,
  //   disabled: props.freezeCase || props.freezeUser,
  // };

  //   aadharNo: "832017168236"
  // applicantUniqId: "95039925831631875826841"
  // debitStartDate: "31-05-2022"
  // paymentType: "enach"
  // repaymentMode: "enach

  React.useEffect(() => {
    if (
      props?.repaymentDetails?.aadharNo &&
      props?.repaymentDetails?.debitStartDate
    ) {
      form &&
        form.setFieldsValue({
          debitStartDate: moment(
            props?.repaymentDetails?.debitStartDate,
            "DD-MM-YYYY"
          ),
          aadharNo: props?.repaymentDetails?.aadharNo,
          authenticationMode: mode,
        });
      setIsAadharEmpty(false);
    }
  }, []);

  const submitEnach = async () => {
    if (eNach) {
      setShowFrame(true);

      const responseR = await saveUpdateRepayment({
        applicantUniqId: props.applicantUniqueId,
        debitStartDate: customFormat(form?.getFieldValue("debitStartDate")),
        repaymentMode: "enach",
        paymentType: form?.getFieldValue("nachType"),
        aadharNo: form?.getFieldValue("aadharNo"),
        authenticationMode: mode,
      });

      const response = await getCamsUrl({
        // applicantUniqueId: props.applicantUniqueId,
        debitStartDate: customFormat(form?.getFieldValue("debitStartDate")),
        aadharNo: (form && form?.getFieldValue("aadharNo")) || "",
        authenticationMode: mode,
        ...camsDataa,
      });

      // const data = await response?.data.enachResponseUrl?.split("Redirecting to")[1];
      const data = await response?.enachResponseUrl;

      const redirectUrl = data?.split("Redirecting to")[1];

      if (redirectUrl) {
        window.open(redirectUrl);
      }
    }
  };

  const getEnachDetails = async () => {
    props.setError(false);

    const responseR = await saveUpdateRepayment({
      applicantUniqId: props.applicantUniqueId,
      debitStartDate: customFormat(form?.getFieldValue("debitStartDate")),
      repaymentMode: "enach",
      paymentType: form?.getFieldValue("nachType"),
      aadharNo: form?.getFieldValue("aadharNo"),
      authenticationMode: mode,
    });

    const response = await camsData({
      id: props.applicantUniqueId,
      // debitStartDate: customFormat(form?.getFieldValue("debitStartDate")),
      // repaymentMode: "enach",
      // paymentType: form?.getFieldValue("nachType"),
    });

    setNachDetails(response);
    if (!response.error) {
      setShowFrame(false);
    }
    // let error = await response?.payload?.error;
    // if (!error) {
    //   const response = await props.getNachDetails({
    //     applicantUniqueId: props.applicantUniqueId,
    //   });
    //   setShowFrame(false);
    // }
  };

  React.useEffect(() => {
    // get Loan Details
    (async () => {
      const response = await getCamsData({
        id: props?.applicantUniqueId,
      });

      setCamsData(response);
    })();
  }, [props?.applicantUniqueId]);

  React.useEffect(() => {
    if (!_.isEmpty(props?.nach)) {
      setNachDetails(props?.nach);
    }
  }, [props?.nach]);

  React.useEffect(() => {
    if (!_.isEmpty(props?.nachDetails)) {
      // setNachDetails(props?.nach);

      setNachDetails(props?.nachDetails);
      if (props?.nachDetails?.debitStartDate) {
        form &&
          form.setFieldsValue({
            debitStartDate: moment(
              props?.nachDetails?.debitStartDate,
              "DD-MM-YYYY"
            ),
          });
      }
      setShowFrame(false);
      if (props?.nachDetails?.aadharNo) {
        form && form.setFieldsValue("aadharNo", props?.nachDetails?.aadharNo);
      }
    }
  }, [props?.nachDetails]);

  React.useEffect(() => {
    setMode(props?.repaymentDetails?.authenticationMode);
    form &&
      form.setFieldsValue({
        authenticationMode: props?.repaymentDetails?.authenticationMode,
      });
  }, [props?.repaymentDetails?.authenticationMode]);

  React.useEffect(() => {
    (async () => {
      if (props.repaymentDetails.repaymentMode) {
        form.setFieldsValue({
          nachType: props.repaymentDetails.repaymentMode,
        });

        if (props.repaymentDetails.repaymentMode === "enach") {
          const response = await camsData({
            id: props.applicantUniqueId,
          });
          // setShowFrame(false);
          setNachDetails(response);
          if (props?.data?.debitStartDate) {
            // set debit date
            form.setFieldsValue({
              nachType: "enach",
            });
            form.setFieldsValue({
              debitStartDate: moment(
                //  response?.payload?.data?.debitStartDate,
                props?.data?.debitStartDate,
                "DD-MM-YYYY"
              ),
            });
          }
          if (response?.payload?.data?.txnStatus === "success") {
            setNachEnable(false);
          }
          form.setFieldsValue({
            nachType: "enach",
          });
          setENach(true);
        }
      }
    })();
  }, [props.enachType]);

  const inputProps = {
    readOnly: props.freezeCase || props.freezeUser,
    disabled: props.freezeCase || props.freezeUser,
  };

  const onChangeMode = (e) => {
    setMode(e.target.value);
  };

  return (
    <div>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        onValuesChange={handleFormChange}
      >
        <span className="QDe-para-normal">NACH Type</span>
        <Row>
          <Form.Item
            name="nachType"
            rules={[
              {
                required: true,
                message: "NACH Type is mandatory",
              },
            ]}
          >
            <Radio.Group
              inputProps={inputProps}
              disabled={props.freezeCase || props.freezeUser}
              style={{ display: "flex", width: "100%" }}
              className="QDe-scheme-radio"
            >
              <Radio value={"enach"}>eNACH</Radio>
              {/* <Radio value={"PhysicalNACH"}>Physical NACH</Radio>  */}
            </Radio.Group>
          </Form.Item>
        </Row>
        <br />
        <span className="QDe-para-normal">NACH Mode</span>
        <Row>
          <Form.Item
            name="authenticationMode"
            rules={[
              {
                required: true,
                message: "NACH Type is mandatory",
              },
            ]}
          >
            <Radio.Group
              onChange={onChangeMode}
              value={mode}
              defaultValue={mode}
              inputProps={inputProps}
              disabled={props.freezeCase || props.freezeUser}
              style={{ display: "flex", width: "100%" }}
              className="QDe-scheme-radio"
            >
              <Radio value={"N"}>Net Banking</Radio>
              <Radio value={"D"}>Debit Card</Radio>
              <Radio value={"A"}>Aadhaar</Radio>
              {/* <Radio value={"PhysicalNACH"}>Physical NACH</Radio>  */}
            </Radio.Group>
          </Form.Item>
        </Row>
        <br />
        {physicalNach && (
          <Row>
            <Col lg={8}>
              <Form.Item
                name="nachForm"
                rules={[{ required: true, message: "NACH Form is mandatory" }]}
              >
                <Upload
                  inputProps={inputProps}
                  showUploadList={false}
                  beforeUpload={() => {
                    return false;
                  }}
                  id="file"
                  accept=".pdf"
                  disabled={props.freezeCase || props.freezeUser}
                  maxCount={1}
                  multiple={false}
                >
                  <Button
                    className="agreementCancleBtn"
                    icon={<UploadOutlined />}
                  >
                    Upload NACH Form
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name="UMRN"
                rules={[{ required: true, message: "UMRN is mandatory" }]}
              >
                <TextField
                  id="outlined-name"
                  label="UMRN*"
                  variant="standard"
                  disabled={props.freezeCase || props.freezeUser}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <div className={"mui-dropdown-wrapper"}>
                {/* <img alt={"select"} src={SelectIcon} className="searchIcon" /> */}
                <Form.Item
                  name={"nachStatus"}
                  rules={[
                    {
                      required: true,
                      message: "NACH Status is mandatory",
                    },
                  ]}
                >
                  <TextField
                    disabled={props.freezeCase || props.freezeUser}
                    inputProps={inputProps}
                    // InputLabelProps={InputLabelProps}
                    label="NACH Status*"
                    select
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option hidden></option>
                    <option>FY-2020</option>
                    <option>FY-2021</option>
                  </TextField>
                </Form.Item>
              </div>
            </Col>
          </Row>
        )}
        {eNach && (
          <Row gutter={16}>
            <Col lg={6}>
              Debit Start Date
              <Form.Item
                name={"debitStartDate"}
                rules={[
                  {
                    required: true,
                    message: "Debit Start Date is mandatory",
                  },
                ]}
              >
                <DatePicker
                  placeholder=""
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, "day")) ||
                    props.freezeCase ||
                    props.freezeUser
                  }
                  fullWidth
                  style={{ width: "100%" }}
                  format={customFormat}
                  labelId={"date-picker-label"}
                  bordered={true}
                  className={
                    "loanDetailDatePicker MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                  }
                />
              </Form.Item>
            </Col>

            {mode == "A" && (
              <Col lg={6} className="">
                <Form.Item
                  name="aadharNo"
                  rules={[
                    {
                      pattern: new RegExp(/^[0-9]{12}$/),
                      message: "Invalid Aadhar number",
                    },
                    {
                      required: true,

                      message: "Aadhar Number is mandatory",
                    },
                  ]}
                >
                  <TextField
                    style={{ marginTop: "0.5rem" }}
                    id="outlined-basic"
                    label=" Aadhar No."
                    variant="standard"
                    fullWidth
                    disabled={props.freezeCase || props.freezeUser}
                    // defaultValue={
                    //   crifData?.aadharNumber || customerResponse?.AadarCard
                    // }
                    onInput={(e) => {
                      e.target.value = e.target.value.toString().slice(0, 12);
                    }}
                  />
                </Form.Item>
              </Col>
            )}

            <Button
              className="save-button mr-3"
              style={{ marginTop: "22px", marginLeft: "10px" }}
              disabled={!nachEnable || props.freezeCase || props.freezeUser}
              onClick={() => getEnachDetails()}
            >
              {" "}
              Get eNACH{" "}
            </Button>

            {!showFrame && !props.error && (
              <>
                <br />
                <Col lg={8}></Col>
                <Col lg={8}>
                  <Label
                    label="Transaction Status"
                    value={nachDetails?.status}
                  />
                </Col>

                <Col lg={8}>
                  <Label
                    label="Transaction Message"
                    // value={nachDetails?.txnMsg}
                    value={
                      nachDetails?.statusDesc?.split("|")[1] == "N/A"
                        ? "SUCCESS"
                        : nachDetails?.statusDesc?.split("|")[1]
                    }
                  />
                </Col>

                <Col lg={8}>
                  <Label
                    label="Client Transaction Reference"
                    value={nachDetails?.trxnNo}
                  />
                </Col>

                <Col lg={8}>
                  <Label
                    label="Transaction Amount"
                    value={nachDetails?.enachAmount}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Acceptance Ref Number"
                    value={
                      nachDetails?.acceptanceRefNo
                        ? nachDetails?.acceptanceRefNo
                        : ""
                    }
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Mandate Ref Number"
                    value={nachDetails?.mandateRefNo}
                  />
                </Col>

                <br />
              </>
            )}
          </Row>
        )}
        {showFrame && <></>}
        <Row gutter={[30, 20]} justify={"center"}>
          <Button
            onClick={submitEnach}
            className="save-button mr-3"
            // htmlType={"submit"}
            // !proceed || props?.freezeUser || !nachEnable || isAadharEmpty
            disabled={
              props?.freezeUser ||
              isAadharEmpty ||
              props.freezeCase ||
              nachDetails?.status == "SUCCESS"
            }
          >
            {" "}
            Submit eNACH{" "}
          </Button>
        </Row>
        <br />
      </Form>
    </div>
  );
}

export default Nach;
