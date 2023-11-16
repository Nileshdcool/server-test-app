import React, { useEffect } from "react";
import { Form, Input, Button, Row, Radio, Col, useContext } from "antd";
import InputText from "../../Components/Input";
import Label from "../../Components/label";
import Spin from "../../Components/Spin";
import VehicleChasis from "./VehicleChasis";
import {
  getDecisioningDetails,
  saveDecisioningDetailsLMS,
  updateDecisioningDetails,
} from "../../Redux/Services/repaymentTwin2";

// const onFinish = (values) => {
//
// };

const onFinishFailed = (errorInfo) => {};

function Repayment(props) {
  let form;
  const [decisioning, setDecisioning] = React.useState(null);
  const [disable, setDisable] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [engineNumber, setEngineNumber] = React.useState("");
  const [chasisNumber, setChasisNumber] = React.useState("");

  useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getDecisioningDetails({
        gupshupId: props.match.params.id,
      });
      setDecisioning(response);
      if (response?.vehicleChassisNumber) {
        setChasisNumber(response?.vehicleChassisNumber);
      }
      if (response?.vehicleEngineNumber) {
        setEngineNumber(response?.vehicleEngineNumber);
      }
      setLoader(false);
    })();
  }, []);

  React.useEffect(() => {
    form.setFieldsValue({
      remark: decisioning?.remark,
      disbursePaymentStatus: decisioning?.disbursePaymentStatus,
    });
  }, [decisioning]);

  const employeeId = localStorage.getItem("empId");

  const onFinish = async (e) => {
    try {
      setLoader(true);
      const response = await saveDecisioningDetailsLMS({
        gupdhupId: props.match.params.id,
        caseMoveToModule: "LMS Module",
        employeeId: employeeId,
        remark: e.remark,
        disbursePaymentStatus: e.disbursePaymentStatus,
      });

      setLoader(false);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const handleFormChangeEC = (changedFields, allFields) => {
    // setMode(allFields.caseMoveToModule);
    if (changedFields?.engineNumber) {
      setEngineNumber(changedFields?.engineNumber);
    }
    if (changedFields?.chasisNumber) {
      setChasisNumber(changedFields?.chasisNumber);
    }
  };

  const onFinishEC = async (e) => {
    const response = await updateDecisioningDetails({
      gupshupId: props.match.params.id,
      ...e,
    });
  };

  const payStatus = ["Ok to Disburse", "Payment on Hold"]?.map((re) => {
    return { label: re, value: re };
  });

  return (
    <Spin spinning={loader}>
      <div className="AddLeadContainer p-3">
        <VehicleChasis
          id={props.match.params.id}
          handleFormChangeEC={handleFormChangeEC}
          onFinishEC={onFinishEC}
          engineNumber={engineNumber}
          chasisNumber={chasisNumber}
        />
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={(e) => (form = e)}
        >
          <Row>
            <Form.Item name="caseMoveToModule">
              <Radio.Group
                defaultValue={"LMS Module"}
                style={{ display: "flex", width: "100%" }}
                className="QDe-scheme-radio"
              >
                <span className="pr-1">
                  {" "}
                  <Label label="Move to"></Label>
                </span>
                &nbsp;&nbsp;
                <Radio value={"LMS Module"} disabled={disable}>
                  LMS Module{" "}
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Row>

          <>
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
          </>

          <Label label="Remarks"></Label>
          <Form.Item
            name={"remark"}
            rules={[
              {
                required: true,
                message: "Remark is mandatory",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Row type={"flex"} justify={"center"}>
            <Button className={"reset-button"} htmlType="submit">
              Save
            </Button>
          </Row>
        </Form>
      </div>
    </Spin>
  );
}

export default Repayment;
