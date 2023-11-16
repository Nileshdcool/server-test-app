import React from "react";
import { Form, Col, Row, Button } from "antd";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  saveOfficeDetails,
} from "../../Redux/Services/Cases";

const OfficeAddressEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const onFinish = async (values) => {
    const response = await saveOfficeDetails({
      applicantUniqueId: id,
      leadCode: props?.data?.leadCode,
      type: "Office",
      id: props?.data?.id,
      ...values,
    });

    if (!response?.data.error) {
      props?.setFlagEdit(true);
      props?.getData();
    }
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        address1: props?.data?.address1,
        address2: props?.data?.address2,
        landmark1: props?.data?.landmark1,
        landmark2: props?.data?.landmark2,
        pinCode: props?.data?.pinCode,
        city: props?.data?.city,
        state: props?.data?.state,
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
            name={"address1"}
            rules={[
              {
                required: true,
                message: `Address1 is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Address Line 1*"}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"address2"}
            rules={[
              {
                required: false,
                message: `Address2 is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Address Line 2"}
            />
          </Form.Item>
        </Col>{" "}
        <Col lg={8}>
          <Form.Item
            name={"landmark1"}
            rules={[
              {
                required: true,
                message: `Landmark1 is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Landmark 1*"}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"landmark2"}
            rules={[
              {
                required: false,
                message: `Landmark2 is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Landmark 2"}
            />
          </Form.Item>
        </Col>{" "}
        <Col lg={8}>
          <Form.Item
            name="pinCode"
            rules={[
              {
                required: true,
                message: "Pincode is mandatory",
              },
              {
                pattern: new RegExp(/^\d+$/),
                message: "Invalid Pincode",
              },
            ]}
          >
            <InputText
              label={"Pincode*"}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 6);
              }}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"city"}
            rules={[
              {
                required: true,
                message: `City is mandatory`,
              },
            ]}
          >
            <InputText
              label={"City*"}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"state"}
            rules={[
              {
                required: true,
                message: `State is mandatory`,
              },
            ]}
          >
            <InputText
              label={"State*"}
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

export default OfficeAddressEdit;
