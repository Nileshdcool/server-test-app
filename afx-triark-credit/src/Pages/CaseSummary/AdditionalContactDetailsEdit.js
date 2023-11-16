import React from "react";
import { Form, Col, Row, Button } from "antd";
import InputText from "../../Components/Input";
import { saveAddtnDetails } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";

const AdditionalContatDetailsEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const onFinish = async (values) => {
    const response = await saveAddtnDetails({
      ...values,
      applicantUniqueId: id,
      leadCode: props?.data?.leadCode,
      id: props?.data?.id,
    });
    if (!response?.data?.error) {
      props?.getData();
      props?.setFlag(true);
    }
  };

  React.useEffect(() => {
    form.setFieldsValue({
      alternateContact: props?.data?.mobileNo,
    });
  }, []);

  return (
    <Form
      initialValues={{
        remember: true,
      }}
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Row gutter={[30, 10]}>
        <Col lg={8}>
          <Form.Item
            name="alternateContact"
            rules={[
              {
                required: true,
                message: "Mobile number is mandatory",
              },
              {
                pattern: new RegExp(/^[6-9]{1}[0-9]{9}$/),
                message: "Invalid Mobile Number",
              },
            ]}
          >
            <InputText
              label={"Mobile Number*"}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10);
              }}
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

export default AdditionalContatDetailsEdit;
