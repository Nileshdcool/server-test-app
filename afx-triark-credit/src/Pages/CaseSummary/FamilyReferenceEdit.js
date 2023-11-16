import React from "react";
import { Form, Col, Row, Button } from "antd";
import InputText from "../../Components/Input";
import { referenceDetailsFamilySave } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";

const FamilyReferenceEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const onFinish = async (values) => {
    const response = await referenceDetailsFamilySave({
      ...values,
      applicantUniqueId: id,
      id: props?.data?.id,
      ismainapplicant: props?.data?.ismainapplicant,
      leadCode: props?.data?.leadCode,
    });

    if (!response?.data?.error) {
      props?.setFlag(true);
      props?.getFamilyReference();
    }
  };

  const relationDropdown = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Spouse",
    "Cousin",
  ]?.map((re) => {
    return { label: re, value: re };
  });

  const handleFormChange = (changedFields, allFields) => {};

  React.useEffect(() => {
    form.setFieldsValue({
      addres: props?.data?.addres,

      mobNo: props?.data?.mobNo,
      name: props?.data?.name,
      relationship: props?.data?.relationship,
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
            name={"relationship"}
            rules={[
              {
                required: true,
                message: `Relationship is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Relationship*"}
              type={"dropdown"}
              options={relationDropdown}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"name"}
            rules={[
              {
                required: true,
                message: `Name is mandatory`,
              },
              {
                pattern: new RegExp(/^[A-Za-z ]+$/),
                message: "Invalid Input",
              },
            ]}
          >
            <InputText
              label={"Name*"}
            />
          </Form.Item>
        </Col>{" "}
        <Col lg={8}>
          <Form.Item
            name="mobNo"
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
        <Col lg={8}>
          <Form.Item
            name="addres"
            rules={[
              {
                required: true,
                message: "Address is mandatory",
              },
            ]}
          >
            <InputText
              label={"Address*"}
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

export default FamilyReferenceEdit;
