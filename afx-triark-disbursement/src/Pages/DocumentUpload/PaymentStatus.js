import React, { useEffect } from "react";
import { Form, Input, Button, Row, Radio, Col } from "antd";
import InputText from "../../Components/Input";
import Label from "../../Components/label";
import { useParams } from "react-router-dom";
import {
  getPaymentStatus,
  saveOrUpdatePaymentStatus,
} from "../../Redux/Services/Cases";

const PaymentStatus = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const handleFormChange = (changedFields, allFields) => {};
  const onFinish = async (data) => {
    const response = await saveOrUpdatePaymentStatus({
      applicantUniqueId: id,
      ...data,
    });
  };

  useEffect(() => {
    (async () => {
      const response = await getPaymentStatus({
        applicantUniqueId: id,
      });

      if (response?.data?.data) {
        form?.setFieldsValue({
          disbursePaymentStatus:
            response?.data?.data?.disbursePaymentStatus?.toString(),
        });
      }
    })();
  }, []);

  const payStatus = ["Ok to Disburse", "Payment on Hold"]?.map((re) => {
    return { label: re, value: re };
  });
  return (
    <>
      <br />
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        form={form}
        onValuesChange={handleFormChange}
      >
        <Row type="flex">
          <Col lg={4}>
            <Label value={"Payment Status*"} />
          </Col>
          <Col lg={6}>
            <Form.Item
              name="disbursePaymentStatus"
              rules={[
                {
                  required: true,
                  message: "Payment Status is mandatory",
                },
              ]}
            >
              <InputText
                // onChange={handleQueryReason}

                label={"Payment Status"}
                type={"dropdown"}
                options={payStatus}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" align="middle">
          <Button
            //   style={{ marginLeft: 12 }}
            htmlType="submit"
            className="reset-button"
          >
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default PaymentStatus;
