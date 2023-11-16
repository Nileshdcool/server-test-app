import React from "react";
import { Form, Col, Row, Button, Radio } from "antd";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  saveCreditInformation,
} from "../../Redux/Services/Cases";
import {YES_NO} from "../../Utils/constants";

const CreditInformationEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const onFinish = async (values) => {
    const response = await saveCreditInformation({
        ...values,
        applicantUniqueId: id,
        leadCode: props?.data?.leadCode,
        id: props?.data?.id,
        firstJob: values?.firstJob == "Yes" ? true : false,
    });
  };

  const yesNoOptions = YES_NO?.map((item) => {
    return { label: item, value: item };
  });

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        creditScore: props?.data?.creditScore,
        creditHistory: props?.data?.creditHistory,
        ThirtyDPD: props?.data?.ThirtyDPD,
        sixtyDPD: props?.data?.sixtyDPD,
        nintyDPD: props?.data?.nintyDPD,
        writtenOrSuit: props?.data?.writtenOrSuit,
        restructuredAccounts: props?.data?.restructuredAccounts,
      });
  }, []);

  return (
    <Form
      initialValues={{
        remember: true,
      }}
      name="dynamic_form_nest_item"
    //   onValuesChange={handleFormChange}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Row gutter={30}>
        <Col lg={8}>
          <Form.Item
            name={"creditScore"}
            rules={[
              {
                required: true,
                message: `Credit Score is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Credit Score*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"creditHistory"}
            rules={[
              {
                required: true,
                message: `Credit History is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Credit History*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"ThirtyDPD"}
            rules={[
              {
                required: true,
                message: `No 30 DPD reporting in last 3 months is mandatory`,
              },
            ]}
          >
            <InputText
              label={"No 30 DPD reporting in last 3 months*"}
              type={"dropdown"}
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"sixtyDPD"}
            rules={[
              {
                required: true,
                message: `No 60 DPD reporting in last 12 months is mandatory`,
              },
            ]}
          >
            <InputText
              label={"No 60 DPD reporting in last 12 months*"}
              type={"dropdown"}
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"nintyDPD"}
            rules={[
              {
                required: true,
                message: `Never in 90 DPD is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Never in 90 DPD*"}
              type={"dropdown"}
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"writtenOrSuit"}
            rules={[
              {
                required: true,
                message: `No Written Off / Suit Filed / SMA reporting ever is mandatory`,
              },
            ]}
          >
            <InputText
              label={"No Written Off / Suit Filed / SMA reporting ever is mandatory*"}
              type={"dropdown"}
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"restructuredAccounts"}
            rules={[
              {
                required: true,
                message: `In case of restructured accounts, there should be no 30 DPD reporting in any tradeline post the restructuring date is mandatory`,
              },
            ]}
          >
            <InputText
              label={"In case of restructured accounts, there should be no 30 DPD reporting in any tradeline post the restructuring date*"}
              type={"dropdown"}
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Button htmlType="submit" className="reset-button">
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default CreditInformationEdit;
