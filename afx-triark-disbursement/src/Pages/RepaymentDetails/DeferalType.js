import { Radio, Form, Col, Row, Button, Select, notification } from "antd";
import React, { useState } from "react";
import Label from "./Label";
import {
  saveDeferralDetails,
  getDeferralDetails,
  getDeferralEmployee,
  submitToDeferral,
} from "../../Redux/Services/deferal";
import InputText from "../../Components/Input";

// submitToDeferralHide;

const DeferalType = (props) => {
  const [value, setValue] = useState("");
  const [deferalData, setDeferalData] = useState(false);
  const [showDD, setShowDD] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [form] = Form.useForm();
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
  };

  const onFinish = async (e) => {
    const response = await saveDeferralDetails({
      applicantUniqueid: props.match.params.id,
      ...e,
    });
    console.log("rsss", response);
    if (response) {
      const response = await getDeferralDetails({
        applicantUniqueid: props.match.params.id,
      });
      console.log("rsss 2", response);
      setDeferalData(response);
    }
  };

  const handleFormChange = (changedFields, allFields) => {};

  const submitDeferral = async () => {
    if(value){
      const response = await submitToDeferral({
        applicantUniqueid: props.match.params.id,
        deferralEmployeeName: value?.split("-")?.[0]?.trim(),
        deferralEmployeeId: value?.split("-")?.[1]?.trim(),
      });

    }else{
      notification.error({message:"Please select Employee List"})
    }
    console.log("submit", response);
    if(response){
         const response = await getDeferralDetails({
           applicantUniqueid: props.match.params.id,
         });
         console.log("rsss", response);
         setDeferalData(response);
    }
  };

  React.useEffect(() => {
    (async () => {
      const response = await getDeferralDetails({
        applicantUniqueid: props.match.params.id,
      });
      console.log("rsss", response);
      setDeferalData(response);

      setShowDD(!response?.submitToDeferralHide);
      const response2 = await getDeferralEmployee({
        applicantUniqueid: props.match.params.id,
      });
      console.log("su2", response2);
      let reason = response2?.map((re) => {
        return {
          label: `${re?.employeeName} - ${re?.employeeId}`,
          value: `${re?.employeeName} - ${re?.employeeId}`,
        };
      });
      setEmpList(reason);

      console.log(response);
              
        response?.deferralEmployeeName
          ? setValue(
              `${response?.deferralEmployeeName} - ${response?.deferralEmployeeId}`
            )
          :setValue("");
      form.setFieldsValue({
        invoiceDeferral: response?.invoiceDeferral,
        insuranceDeferral: response?.insuranceDeferral,
        enachDeferral: response?.enachDeferral,
        pdcDefrral: response?.pdcDefrral,
      });
    })();
  }, []);
  return (
    <>
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
        <Row>
          <Col lg={8}>
            <Label value={"Invoice Deferral"} />
          </Col>
          <Form.Item
            name={"invoiceDeferral"}
            rules={[
              {
                required: true,
                message: "invoice Deferral is mandatory",
              },
            ]}
          >
            <Radio.Group
              onChange={onChange}
              value={deferalData?.invoiceDeferral}
            >
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Row>{" "}
        <Row>
          <Col lg={8}>
            <Label value={"Insurance Deferral"} />
          </Col>
          <Form.Item
            name={"insuranceDeferral"}
            rules={[
              {
                required: true,
                message: "Insurance Deferral is mandatory",
              },
            ]}
          >
            <Radio.Group
              onChange={onChange}
              value={deferalData?.insuranceDeferral}
            >
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Row>{" "}
        <Row>
          <Col lg={8}>
            <Label value={"ENACH Deferral"} />
          </Col>
          <Form.Item
            name={"enachDeferral"}
            rules={[
              {
                required: true,
                message: "ENACH Deferral is mandatory",
              },
            ]}
          >
            <Radio.Group onChange={onChange} value={deferalData?.enachDeferral}>
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Row>{" "}
        <Row>
          <Col lg={8}>
            <Label value={"PDC Deferral"} />
          </Col>
          <Form.Item
            name={"pdcDefrral"}
            rules={[
              {
                required: true,
                message: "PDC Deferral is mandatory",
              },
            ]}
          >
            <Radio.Group onChange={onChange} value={deferalData?.pdcDefrral}>
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Row>
        <Row type={"flex"} justify={"center"}>
          <Button
            className={"reset-button"}
            htmlType="submit"
            disabled={deferalData?.deferralSaveHide}
            //   inputProps={inputProps}
          >
            Save
          </Button>
        </Row>
      </Form>
      {!deferalData?.submitToDeferralHide && (
        <>
          {" "}
          <Row>
            <Col lg={8}>
              <Label value={"Employee List"} />
            </Col>
          </Row>
          <Row>
            
              <Select
                defaultValue={value}
                value={value}
                //   disabled={userFreeze || caseFreeze}
                style={{ border: "1px solid #0D6BC8", minWidth: 200 }}
                key={value}
                // value={value}
                onChange={(e) => setValue(e)}
                placeholder={"Employee List"}
                type={"dropdown"}
                options={empList}
              />
           
          </Row>
          <Row type={"flex"} justify={"center"}>
            <Button
              className={"reset-button"}
              onClick={submitDeferral}
              disabled={deferalData?.deferralSaveHide}
              //   inputProps={inputProps}
            >
              Submit to Deferral Approval
            </Button>
          </Row>
        </>
      )}
    </>
  );
};
export default DeferalType;
