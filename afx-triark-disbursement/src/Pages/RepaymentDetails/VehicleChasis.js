import React from "react";
import { Form, Input, Button, Row, Radio, Col } from "antd";
import InputText from "../../Components/Input";
import Label from "../../Components/label";
import {
  getDecisioningDetails,
  saveDecisioningDetails,
  saveDecisioningDetailsLMS,
  getEngineChasis,
  updateEngineChasis,
} from "../../Redux/Services/repayment";

const VehicleChasis = (props) => {
  const { userFreeze, caseFreeze, handleFormChangeEC, onFinishEC, id } = props;
  const [form] = Form.useForm();
  // let form;
  const [mode, setMode] = React.useState(null);
  const [decisioning, setDecisioning] = React.useState(null);
  const [disable, setDisable] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [caseSummaryData, setCaseSummaryData] = React.useState();
  const [engineNumber, setEngineNumber] = React.useState("");
  const [chasisNumber, setChasisNumber] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const response = await getEngineChasis({
        id: id,
      });

      // {chassisNumber: '4354TTY', engineNumber: '7788DDA'}
      if (response?.chassisNumber) {
        setChasisNumber(response?.chassisNumber);
        form?.setFieldsValue({
          chassisNumber: response?.chassisNumber || "",
        });
      }
      if (response?.engineNumber) {
        setEngineNumber(response?.engineNumber);
        form?.setFieldsValue({
          engineNumber: response?.engineNumber || "",
        });
      }
    })();
  }, []);
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
        // onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col lg={6} className="inputTextTop">
            <Form.Item
              name="engineNumber"
              rules={[
                {
                  required:
                    props?.mode === "LMS Module" && props?.isDelhiBranch,
                  message: "Engine Number is mandatory",
                },
              ]}
            >
              <InputText
                className="inputTextTop"
                readOnly={userFreeze || caseFreeze}
                id="engineNumber"
                label={
                  props?.mode === "LMS Module" && props?.isDelhiBranch
                    ? "Engine Number*"
                    : "Engine Number"
                }
                type={"text"}
                // value={engineNumber}
                // defaultValue={engineNumber}
              />
            </Form.Item>
          </Col>
          <Col lg={6} className="inputTextTop">
            <Form.Item
              name="chassisNumber"
              rules={[
                {
                  required:
                    props?.mode === "LMS Module" && props?.isDelhiBranch,
                  message: "Chasis Number is mandatory",
                },
              ]}
            >
              <InputText
                id="chasisNumber"
                className="inputTextTop"
                readOnly={userFreeze || caseFreeze}
                label={
                  props?.mode === "LMS Module" && props?.isDelhiBranch
                    ? "Chasis Number*"
                    : "Chasis Number"
                }
                value={chasisNumber}
                type={"text"}
                // value={chasisNumber}
                // defaultValue={chasisNumber}

                // defaultValue={data?.ifscNumber}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            {" "}
            <Button
              style={{ marginTop: 16 }}
              className={"reset-button"}
              htmlType="submit"
              disabled={userFreeze || caseFreeze}
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
