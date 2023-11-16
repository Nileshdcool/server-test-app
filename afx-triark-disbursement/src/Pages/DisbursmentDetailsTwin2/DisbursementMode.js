import React, { useEffect, useState } from "react";
import { Col, Row, Button, Form, Radio, Input } from "antd";
import Label from "../../Components/label";
import InputText from "../../Components/Input";
import {
  getDisbursementDetailsTwin2,
  saveDisbursementDetailsTwin2,
} from "../../Redux/Services/disbursementModeTwin2";
import moment from "moment";

function DisbursementMode(props) {
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [type, setType] = useState([]);
  const [partnerBank, setPartnerBank] = useState([]);

  const onFinish = async (values) => {
    saveDisbursementDetailsTwin2({
      gupdhupId: props?.match?.match.params.id,
      partnerBank: values["PartnerBank"],
      disbursementType: values["disbursementType"],
      disbursementDate: values?.disbursementDate.format("YYYY-MM-DD"),
    });
    const response = await getDisbursementDetailsTwin2({
      gupdhupId: props?.match?.match.params.id,
    });
    if (response?.partnerBank) {
      form?.setFieldsValue({
        PartnerBank: response?.partnerBank,
      });
    }
    if (response?.disbursementType) {
      form?.setFieldsValue({
        disbursementType: response?.disbursementType,
      });
    }
    if (response?.disbursementDate) {
      form?.setFieldsValue({
        disbursementDate: moment(response?.disbursementDate, "YYYY-MM-DD"),
      });
    }
    setData(response);
  };

  const onFinishFailed = (errorInfo) => {};

  useEffect(() => {
    (async () => {
      const response = await getDisbursementDetailsTwin2({
        gupdhupId: props?.match?.match.params.id,
      });
      if (response?.partnerBank) {
        form?.setFieldsValue({
          PartnerBank: response?.partnerBank,
        });
      }
      if (response?.disbursementType) {
        form?.setFieldsValue({
          disbursementType: response?.disbursementType,
        });
      }
      if (response?.disbursementDate) {
        form?.setFieldsValue({
          disbursementDate: moment(response?.disbursementDate, "YYYY-MM-DD"),
        });
      }
      setData(response);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // const response = await getPartnerBank();
      const bankNameresponse = [
        {
          bankName: "YES Bank",
          id: 1,
        },
        {
          bankName: "ICICI",
          id: 2,
        },
      ];
      setPartnerBank(bankNameresponse);
    })();
  }, []);

  let disbsBank = partnerBank?.map((re) => {
    return { label: re?.bankName, value: re?.bankName };
  });

  useEffect(() => {
    (async () => {
      // const response = await getDisbursementType();
      const typeResponse = [
        {
          id: 1,
          type: "NEFT",
        },
        {
          id: 2,
          type: "IMPS",
        },
        {
          id: 3,
          type: "RTGS",
        },
        {
          id: 4,
          type: "CHEQUE",
        },
      ];
      setType(typeResponse);
    })();
  }, []);

  let disbsType = type?.map((re) => {
    return { label: re?.type, value: re?.type };
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
      <Row>
        <Col lg={8} className="inputTextTop">
          <Label label="Dealer Name" value={data?.dealerName} />
        </Col>
        <Col lg={8} className="inputTextTop">
          <Label label="Bank Name" value={data?.bankName} />
        </Col>
        <Col lg={8} className="inputTextTop">
          <Label label="Branch" value={data?.branch} />
        </Col>
        <Col lg={8} className="inputTextTop">
          <Label label="Account Holder Name" value={data?.accountHolderName} />
        </Col>
        <Col lg={8} className="inputTextTop">
          <Label label="Account Number" value={data?.accountNumber} />
        </Col>
        <Col lg={8} className="inputTextTop">
          <Label label="IFSC Code" value={data?.ifscNumber} />
        </Col>
        <Col lg={8} className="inputTextTop">
          <Label label="Contact Number" value={data?.mobile} />
        </Col>
      </Row>
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
              <InputText label={"Disbursement Date"} type={"date"} />
            </Form.Item>
          </Col>
        </Row>
        <br />
        <br />
        <Row type={"flex"} justify={"center"}>
          <Button className={"reset-button"} htmlType="submit">
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default DisbursementMode;
