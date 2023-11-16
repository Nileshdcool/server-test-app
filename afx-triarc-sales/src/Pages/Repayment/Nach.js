import React from "react";
import { Form, Button, Row, Upload, Radio, Col, DatePicker } from "antd";
import TextField from "@material-ui/core/TextField";
import { public_url } from "../../Utility/Constant";
import SelectIcon from "../../assets/Images/select.svg";
import _ from "lodash";
import { UploadOutlined } from "@ant-design/icons";
import Label from "../common/Label";
import moment from "moment";
import { getCams } from "../../Redux/Services/Repayment";

function Nach(props) {
  const [form] = Form.useForm();
  const [physicalNach, setPhysicalNach] = React.useState(false);
  const [eNach, setENach] = React.useState(false);

  const [proceed, setProceed] = React.useState(false);
  const [showFrame, setShowFrame] = React.useState(false);
  const [data, setData] = React.useState("");
  const [aadhar, setAadhar] = React.useState("");
  const [nachEnable, setNachEnable] = React.useState(true);
  const { nachDetails } = props;

  const onFinish = async (values) => {
    props.saveUpdateRepayment({
      repaymentMode: "nach",
      applicantUniqId: props.applicantUniqueId,
    });

    
  };

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields?.nachType === "PhysicalNACH") {
      setPhysicalNach(true);
      setENach(false);
      setProceed(false);
    } else if (changedFields?.nachType === "eNACH") {
      setPhysicalNach(false);
      setENach(true);
      setProceed(false);
    } else if (changedFields?.debitStartDate !== null) {
      setPhysicalNach(false);
      setENach(true);
      setProceed(true);
    }
    if (changedFields?.aadharNo) {
      console.log("sss", changedFields?.aadharNo);
      props.setAadharNo(changedFields?.aahdarNo);
      setAadhar(changedFields?.aahdarNo);
    }
  };

  const customFormat = (value) => {
    return value?.format("DD-MM-YYYY");
  };

  const onFinishFailed = (errorInfo) => {};

  const inputProps = {
    readOnly: props.freezeCase || props.freezeUser,
    disabled: props.freezeCase || props.freezeUser,
  };

  const submitEnach = () => {
    if (eNach) {
      setShowFrame(true);
      // ...props?.nachDetails

      const getData = async () => {
        const datar = await {
          //  applicantUniqueId: props.applicantUniqueId,
          debitStartDate: customFormat(form?.getFieldValue("debitStartDate")),
        };
        const response = await props.getCamsDeta({
          ...datar,
          ...props?.camsData,
        });
        const data = await response?.data.enachResponseUrl?.split("to")[1];
        if (data) {
          window.open(data);
        }
        setData(data);
      };
      getData();
    }
  };

  if (form?.getFieldValue("nachType")) {
    props.setNachType(form?.getFieldValue("nachType"));
  }
  if (form?.getFieldValue("debitStartDate")) {
    let date = customFormat(form?.getFieldValue("debitStartDate"));
    props.setDebitDate(date);
  }

  React.useEffect(() => {
    (async () => {
      let flag = true;
      if (props.enachType && flag) {
        form.setFieldsValue({
          nachType: props.enachType,
        });
        flag = false;
        if (props.enachType === "eNACH") {
          const response = await props.getEnach({
            applicantUniqueId: props.applicantUniqueId,
          });
          setShowFrame(false);
          // setNachDetails(response?.payload?.data);
          if (props?.data?.debitStartDate) {
            // set debit date
            form.setFieldsValue({
              nachType: "eNACH",
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
            nachType: "eNACH",
          });
          setENach(true);
        }
      }
    })();
  }, [props.enachType]);

  console.log("form?.getFieldValue", form?.getFieldValue("nachType"));

  return (
    <div>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={submitEnach}
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
              // disabled={props.freezeCase || props.freezeUser}
              style={{ display: "flex", width: "100%" }}
              className="QDe-scheme-radio"
            >
              <Radio value={"eNACH"}>eNACH</Radio>
              {/* <Radio value={"PhysicalNACH"}>Physical NACH</Radio> */}
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
                  showUploadList={false}
                  beforeUpload={() => {
                    return false;
                  }}
                  id="file"
                  accept=".pdf"
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
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <div className={"mui-dropdown-wrapper"}>
                <img alt={"select"} src={SelectIcon} className="searchIcon" />
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
          <Row gutter={18}>
            <Col lg={6}>
              <label
                id={"date-picker-label"}
                className={`MuiFormLabel-root MuiInputLabel-root ${
                  form && form.getFieldValue("dateOfbirth")
                    ? "MuiInputLabel-animated MuiInputLabel-shrink"
                    : ""
                } MuiInputLabel-formControl MuiInputLabel-animated`}
                data-shrink="false"
                for="panNo"
              ></label>
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
                  // disabledDate={(current) => current.isBefore(moment()) || props?.freezeUser}
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, "day")) ||
                    props?.freezeUser
                  }
                  fullWidth
                  style={{ width: "100%", zIndex: 2 }}
                  format={customFormat}
                  labelId={"date-picker-label"}
                  bordered={true}
                  className={
                    "loanDetailDatePicker MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={"aadharNo"}
                rules={[
                  {
                    required: true,
                    message: "Debit Start Date is mandatory",
                  },
                ]}
              >
                <TextField
                  id="outlined-name"
                  label="Aadhar Number*"
                  variant="standard"
                  fullWidth
                />
              </Form.Item>
            </Col>

            <Button
              className="cancle-button ml-3 mt-3"
              // disabled={!nachEnable || props.freezeCase}
              onClick={() => props?.getEnachDetails(aadhar)}
            >
              {" "}
              Get eNACH{" "}
            </Button>

            {props?.showFrame && (
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
                    value={nachDetails?.acceptanceRefNo}
                  />
                </Col>
                <Col lg={8}>
                  <Label
                    label="Mandate Ref Number"
                    value={nachDetails?.mandateRegNo}
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
            className="cancle-button mr-3"
            onClick={(e) => {
              props.history.push(
                `${public_url.loanSummary}/${props.data && props.data.leadId}`
              );
            }}
          >
            {" "}
            Loan Summary{" "}
          </Button>
          {true && (
            <Button
              // onClick={}
              className="save-button mr-3"
              htmlType={"submit"}
              disabled={!proceed || props?.freezeUser || !nachEnable}
            >
              {" "}
              Submit eNACH{" "}
            </Button>
          )}
          {/* {!(props.freezeCase || props.freezeUser) && (
          <Button className="save-button mr-3" htmlType={"submit"}>
            {" "}
            Save{" "}
          </Button> 
           )}  */}
        </Row>
        <br />
      </Form>
    </div>
  );
}

export default Nach;
