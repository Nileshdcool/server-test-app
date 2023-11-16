import React from "react";
import { Form, Col, Row, Button, Radio } from "antd";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  saveFinancialInformation,
} from "../../Redux/Services/Cases";

const FinancialInformationEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const onFinish = async (values) => {
    const response = await saveFinancialInformation({
        ...values,
        applicantUniqueId: id,
        leadCode: props?.data?.leadCode,
        id: props?.data?.id,
        firstJob: values?.firstJob == "Yes" ? true : false,
    });
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        accountType: props?.data?.accountType,
        accountNumber: props?.data?.accountNumber,
        ifscCode: props?.data?.ifscCode,
        bankName: props?.data?.bankName,
        bankType: props?.data?.bankType,
        savings: props?.data?.savings,
        liabilities: props?.data?.liabilities,
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
            name={"accountType"}
            rules={[
              {
                required: true,
                message: `Account Type is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Account Type*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"accountNumber"}
            rules={[
              {
                required: true,
                message: `Account Number is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Account Number*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"ifscCode"}
            rules={[
              {
                required: true,
                message: `IFSC Code is mandatory`,
              },
            ]}
          >
            <InputText
              label={"IFSC Code*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"bankName"}
            rules={[
              {
                required: true,
                message: `Bank Name is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Bank Name*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"bankType"}
            rules={[
              {
                required: true,
                message: `Bank Type is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Bank Type*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"savings"}
            rules={[
              {
                required: true,
                message: `Savings is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Savings*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"investment"}
            rules={[
              {
                required: true,
                message: `Investment is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Investment*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"liabilities"}
            rules={[
              {
                required: true,
                message: `Liabilities is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Liabilities*"}
              type="text"
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

export default FinancialInformationEdit;
