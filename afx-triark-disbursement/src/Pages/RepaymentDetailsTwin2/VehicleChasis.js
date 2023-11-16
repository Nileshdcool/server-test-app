import React, { useEffect } from "react";
import { Form, Input, Button, Row, Radio, Col } from "antd";
import InputText from "../../Components/Input";


const VehicleChasis = (props) => {
  const { engineNumber, chasisNumber, handleFormChangeEC, onFinishEC, id } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (chasisNumber) {
      form?.setFieldsValue({
        chasisNumber: chasisNumber,
      });
    }
    if (engineNumber) {
      form?.setFieldsValue({
        engineNumber: engineNumber,
      });
    }
  }, [chasisNumber, engineNumber]);
  return (
    <div>
      <Form
        name="basic222"
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinishEC}
        onValuesChange={handleFormChangeEC}
      >
        <Row gutter={24}>
          <Col lg={6} className="inputTextTop">
            <Form.Item
              name="engineNumber"
              rules={[
                {
                  required: false,
                  message: "Engine Number is mandatory",
                },
              ]}
            >
              <InputText
                className="inputTextTop"
                id="engineNumber"
                label={"Engine Number"}
                type={"text"}
              />
            </Form.Item>
          </Col>
          <Col lg={6} className="inputTextTop">
            <Form.Item
              name="chasisNumber"
              rules={[
                {
                  required: false,
                  message: "Chasis Number is mandatory",
                },
              ]}
            >
              <InputText
                id="chasisNumber"
                className="inputTextTop"
                label={"Chasis Number"}
                type={"text"}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            {" "}
            <Button
              style={{ marginTop: 16 }}
              className={"reset-button"}
              htmlType="submit"
            >
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default VehicleChasis;
