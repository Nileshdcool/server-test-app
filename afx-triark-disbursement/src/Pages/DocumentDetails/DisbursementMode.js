import React from "react";
import { Col, Row, Button, Form, Radio, Input } from "antd";
import Label from "../../Components/label";
import InputText from "../../Components/Input";
import TextField from "@material-ui/core/TextField";
import {
  getDisbursementDetails,
  getPartnerBank,
  getDisbursementType,
  saveDisbursementDetails,
} from "../../Redux/Services/disbursementMode";
import { getDisbursmentAmount } from "../../Redux/Services/documentUpload";
import moment from "moment";
import { useParams } from "react-router-dom";

function DisbursementMode(props) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [mode, setMode] = React.useState("no");
  const [data, setData] = React.useState(null);
  const [type, setType] = React.useState([]);
  const [partnerBank, setPartnerBank] = React.useState([]);
  const { disbsData, setDisbsData } = props;

  const userFreeze =
    props.caseSummaryData?.modelAccess &&
    props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze =
    props.caseSummaryData?.mainapplicant &&
    props.caseSummaryData?.mainapplicant[0]?.disbursementFreeze;

  const onFinish = async (values) => {
    saveDisbursementDetails({
      ...data,
      partnerBank: values["PartnerBank"],
      disbursementType: values["disbursementType"],
      disbursementDate: values?.disbursementDate.format("YYYY-MM-DD"),
    });
    const response = await getDisbursmentAmount({
      applicantUniqueId: id,
    });
    setDisbsData(response);
  };

  const onFinishFailed = (errorInfo) => {};

  // const handleFormChange = async(changedFields, allFields) => {
  //
  //   if(changedFields?.disbursementDate){
  //
  //
  //     const response = await getDisbursmentAmount({
  //       applicantUniqueId: id,
  //     });
  //     setDisbsData(response);
  //   }
  // }

  React.useEffect(() => {
    (async () => {
      const response = await getDisbursementDetails({
        applicantUniqueId: id,
      });
      setData(response);
      form?.setFieldsValue({
        PartnerBank: response?.partnerBank,
        disbursementType: response?.disbursementType,
      });
      if (response?.disbursementDate) {
        form?.setFieldsValue({
          disbursementDate: moment(response?.disbursementDate, "YYYY-MM-DD"),
        });
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const response = await getPartnerBank();
      setPartnerBank(response);
    })();
  }, []);

  let disbsBank = partnerBank.map((re) => {
    return { label: re.bankName, value: re.bankName };
  });

  React.useEffect(() => {
    (async () => {
      const response = await getDisbursementType();
      setType(response);
    })();
  }, []);

  let disbsType = type.map((re) => {
    return { label: re.type, value: re.type };
  });

  return (
    <>
      <Row>
        <Col lg={24}>Transfer to Customer Account</Col>
        {/* <Form.Item name="mode"> */}
        <Radio.Group value={"no"} className="QDe-scheme-radio">
          <Radio disabled value={"yes"}>
            Yes
          </Radio>
          <Radio isChecked value={"no"}>
            No
          </Radio>
        </Radio.Group>
        {/* </Form.Item> */}
      </Row>
      {mode === "yes" && (
        <Row gutter={[40]}>
          <Col lg={8}>
            <InputText
              label={"Dealer Name"}
              type={"text"}
              defaultValue={data?.sourceName}
            />
          </Col>
          <Col lg={8}>
            <InputText
              label={"Bank Name"}
              type={"text"}
              defaultValue={data?.bankName}
            />
          </Col>
          <Col lg={8}>
            <InputText
              className="inputTextTop"
              label={"Branch"}
              type={"text"}
              defaultValue={data?.branchName}
            />
          </Col>
          <Col lg={8} className="inputTextTop">
            <InputText
              className="inputTextTop"
              label={"Account Holder Name"}
              type={"text"}
              defaultValue={data?.leadName}
            />
          </Col>
          <Col lg={8} className="inputTextTop">
            <InputText
              className="inputTextTop"
              label={"IFSC Code"}
              type={"text"}
              defaultValue={data?.ifscNumber}
            />
          </Col>
          <Col lg={8} className="inputTextTop">
            <InputText
              className="inputTextTop"
              label={"Contact Number"}
              type={"number"}
              defaultValue={data?.customerMobile}
            />
          </Col>
        </Row>
      )}
      {mode === "no" && (
        <Row>
          <Col lg={8} className="inputTextTop">
            <Label label="Dealer Name" value={data?.sourceName} />
          </Col>
          <Col lg={8} className="inputTextTop">
            <Label label="Bank Name" value={data?.bankName} />
          </Col>
          <Col lg={8} className="inputTextTop">
            <Label label="Branch" value={data?.branchName} />
          </Col>
          <Col lg={8} className="inputTextTop">
            <Label label="Account Holder Name" value={data?.leadName} />
          </Col>
          <Col lg={8} className="inputTextTop">
            <Label label="Account Number" value={data?.accountNumber} />
          </Col>
          <Col lg={8} className="inputTextTop">
            <Label label="IFSC Code" value={data?.ifscNumber} />
          </Col>
          <Col lg={8} className="inputTextTop">
            <Label label="Contact Number" value={data?.customerMobile} />
          </Col>
        </Row>
      )}
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        form={form}
        onFinishFailed={onFinishFailed}
        // onValuesChange={handleFormChange}
      >
        <Row gutter={40}>
          <Col lg={8} className="inputTextTop">
            <Form.Item
              name="disbursementType"
              rules={[
                {
                  required: true,
                  message: "Disbursement Type is mandatory",
                },
              ]}
            >
              <InputText
                disabled={userFreeze || caseFreeze}
                label={"Disbursement Type"}
                type={"dropdown"}
                options={disbsType}
              />
            </Form.Item>
          </Col>
          <Col lg={8} className="inputTextTop">
            <Form.Item
              name="PartnerBank"
              rules={[
                {
                  required: true,
                  message: "Partner Bank is mandatory",
                },
              ]}
            >
              <InputText
                disabled={userFreeze || caseFreeze}
                label={"Partner Bank"}
                type={"dropdown"}
                options={disbsBank}
              />
            </Form.Item>
          </Col>
          <Col lg={8} className="inputTextTop">
            <Form.Item
              name="disbursementDate"
              rules={[
                {
                  required: true,
                  message: "Disbursement Date is mandatory",
                },
              ]}
            >
              <InputText
                label={"Disbursement Date"}
                type={"date"}
                disabled={userFreeze || caseFreeze}
              />
            </Form.Item>
          </Col>
        </Row>
        <br />
        <br />
        <Row type={"flex"} justify={"center"}>
          <Button
            className={"reset-button"}
            htmlType="submit"
            disabled={userFreeze || caseFreeze}
          >
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default DisbursementMode;
