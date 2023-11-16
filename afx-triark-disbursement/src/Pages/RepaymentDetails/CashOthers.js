import React from "react";
import { Form, Button, Row, Input } from "antd";
// import { public_url } from "../../Utility/Constant";
import _ from "lodash";

function CashOthers(props) {
  const flag = props.cash ? "cash" : "other";

  const [form] = Form.useForm();

  const onFinish = (values) => {
    props.saveUpdateRepayment({
      comments: values.cashComments || values.otherComments,
      repaymentMode: flag,
      applicantUniqId: props.applicantUniqueId,
    });
  };

  const onFinishFailed = (errorInfo) => {};

  React.useEffect(() => {
    if (props?.repaymentDetails?.comments && props?.repayMode === "cash") {
      form.setFieldsValue({
        cashComments: props.repaymentDetails.comments,
      });
      if (props.repaymentDetails.comments && !props.reset) {
        props.setEnableDisbursement(true);
        //  props.setReset(false);
      }
    } else if (
      props?.repaymentDetails?.comments &&
      props?.repayMode === "other"
    ) {
      form.setFieldsValue({
        otherComments: props.repaymentDetails.comments,
      });
      if (props.repaymentDetails.comments && !props.reset) {
        props.setEnableDisbursement(true);
        // props.setReset(false)
      }
    }
  }, [form, props]);

  React.useEffect(() => {
    if (props.reset) {
      form && form.resetFields();
    }
  }, [form, props.reset]);

  const inputProps = {
    readOnly: props.freezeCase || props.freezeUser,
    disabled: props.freezeCase || props.freezeUser,
  };

  return (
    <div>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        form={form}
        onFinishFailed={onFinishFailed}
      >
        {props.mode === "cash" ? (
          <Form.Item
            label="Comments"
            name={"cashComments"}
            rules={[
              {
                required: true,
                message: "comment is mandatory",
              },
            ]}
          >
            <Input.TextArea
              inputProps={inputProps}
              disabled={props.freezeCase || props.freezeUser}
              fullWidth
              multiline
              rowsMax={4}
              key={Math.random()}
              onChange={(e) => {
                _.isEmpty(e.target.value) && props.setEnableDisbursement(false);
              }}
            />
          </Form.Item>
        ) : (
          <Form.Item
            label="Comments"
            name={"otherComments"}
            rules={[
              {
                required: true,
                message: "comment is mandatory",
              },
            ]}
          >
            <Input.TextArea
              inputProps={inputProps}
              disabled={props.freezeCase || props.freezeUser}
              // disabled={inputProps.readOnly}
              fullWidth
              multiline
              rowsMax={4}
              key={Math.random()}
              onChange={(e) => {
                _.isEmpty(e.target.value) && props.setEnableDisbursement(false);
              }}
            />
          </Form.Item>
        )}
        <br />

        <Row type={"flex"} justify={"center"}>
          <Button
            className={"reset-button"}
            htmlType={"submit"}
            disabled={props.freezeCase || props.freezeUser}
          >
            Save
          </Button>
        </Row>
        <br />
      </Form>
    </div>
  );
}

export default CashOthers;
