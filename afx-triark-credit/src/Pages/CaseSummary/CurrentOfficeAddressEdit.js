import React from "react";
import { Form, Col, Row, Button } from "antd";
import InputText from "../../Components/Input";
import { savePermanentDetails } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import Label from "./../../Components/label";

const CurrentOfficeAddressEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const onFinish = async (values) => {
    const payload = {
      ...values,
      applicantUniqueId: id,
      leadCode: props?.data?.leadCode,
      type: "Current office",
      id: props?.data?.id,
      sameRegisteredAddressFlag: props?.data?.sameRegisteredAddressFlag,
      saveCurrentOfficeFlag: true,
      gstAddressFlag: true,
    };
    const response = await savePermanentDetails(payload);
    if (!response?.data?.error) {
      props?.getData();
      props?.NegativePincode();
      props?.setFlagEdit(true);
    }
  };

  const ofcDropdown = ["Owned", "Rented"]?.map((re) => {
    return { label: re, value: re };
  });

  React.useEffect(() => {
    form.setFieldsValue({
      address2: props?.data?.address2,
      address1: props?.data?.address1,
      city: props?.data?.city,
      gstAddressFlag: props?.data?.gstAddressFlag,
      id: props?.data?.id,
      landmark1: props?.data?.landmark1,
      landmark2: props?.data?.landmark2,
      officeType: props?.data?.officeType,
      officeYear: props?.data?.officeYear?.toString(),
      officeMonth: props?.data?.officeMonth?.toString(),
      pinCode: props?.data?.pinCode,
      sameRegisteredAddressFlag: props?.data?.sameRegisteredAddressFlag,
      saveCurrentOfficeFlag: props?.data?.saveCurrentOfficeFlag,
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
        <Col lg={8}>
          <Form.Item
            name={"officeType"}
            rules={[
              {
                required: true,
                message: `Residence Type is mandatory`,
              },
            ]}
          >
            <InputText
              key={form && form.getFieldValue("officeType")}
              label={"Residence Type*"}
              type={"dropdown"}
              options={ofcDropdown}
            />
          </Form.Item>
        </Col>
        <Row>
          <Col span={6}>
            <Label label="Business at Current Address since" value={``} />
          </Col>
          <Col lg={4}>
            <Form.Item
              name={"officeYear"}
              rules={[
                {
                  required: true,
                  message: `Year is mandatory`,
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Year*"}
              />
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item
              name={"officeMonth"}
              rules={[
                {
                  required: true,
                  message: `Month is mandatory`,
                },
                {
                  pattern: new RegExp(/^([0-9]|[0-1][0-2])$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Month*"}
              />
            </Form.Item>
          </Col>
        </Row>
      </Row>
      <Row justify="center" align="middle">
        <Button htmlType="submit" className="reset-button">
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default CurrentOfficeAddressEdit;
