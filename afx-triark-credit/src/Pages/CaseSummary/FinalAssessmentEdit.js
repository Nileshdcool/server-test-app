import React from "react";
import { Form, Col, Row, Button, Radio } from "antd";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  saveFinalAssessment,
} from "../../Redux/Services/Cases";

const FinalAssessmentEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const onFinish = async (values) => {
    const response = await saveFinalAssessment({
        ...values,
        applicantUniqueId: id,
        leadCode: props?.data?.leadCode,
        id: props?.data?.id,
        firstJob: values?.firstJob == "Yes" ? true : false,
    });
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        ltv: props?.data?.ltv,
        riskSegmentColor: props?.data?.riskSegmentColor,
        creditBureau: props?.data?.creditBureau,
        panValidation: props?.data?.panValidation,
        bankAccountValidation: props?.data?.bankAccountValidation,
        hunterCheck: props?.data?.hunterCheck,
        tvrOfApplicant: props?.data?.tvrOfApplicant,
        tvrOfReference1: props?.data?.tvrOfReference1,
        tvrOfReference2: props?.data?.tvrOfReference2,
        cpvOutcome: props?.data?.cpvOutcome,
        deviations: props?.data?.deviations,
        finalScore: props?.data?.finalScore,
      });
  }, []);

  return (
    <Form
      initialValues={{
        remember: true,
      }}
      name="dynamic_form_nest_item"
    //   onValuesChange={handleFormChange}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Row gutter={30}>
        <Col lg={8}>
          <Form.Item
            name={"ltv"}
            rules={[
              {
                required: true,
                message: `LTV is mandatory`,
              },
            ]}
          >
            <InputText
              label={"LTV*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"riskSegmentColor"}
            rules={[
              {
                required: true,
                message: `Risk Cat is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Risk Cat*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"creditBureau"}
            rules={[
              {
                required: true,
                message: `Credit Bureau is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Credit Bureau*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"panValidation"}
            rules={[
              {
                required: true,
                message: `Pan Validation is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Pan Validation*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"bankAccountValidation"}
            rules={[
              {
                required: true,
                message: `Bank Account Validation - Penny Drop + Perfios is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Bank Account Validation - Penny Drop + Perfios*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"hunterCheck"}
            rules={[
              {
                required: true,
                message: `Hunter Check is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Hunter Check*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"tvrOfApplicant"}
            rules={[
              {
                required: true,
                message: `TVR of applicant is mandatory`,
              },
            ]}
          >
            <InputText
              label={"TVR of applicant*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"tvrOfReference1"}
            rules={[
              {
                required: true,
                message: `TVR of reference 1 is mandatory`,
              },
            ]}
          >
            <InputText
              label={"TVR of reference 1*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"tvrOfReference2"}
            rules={[
              {
                required: true,
                message: `TVR of reference 2 is mandatory`,
              },
            ]}
          >
            <InputText
              label={"TVR of reference 2*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"cpvOutcome"}
            rules={[
              {
                required: true,
                message: `CPV Outcome is mandatory`,
              },
            ]}
          >
            <InputText
              label={"CPV Outcome*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"deviations"}
            rules={[
              {
                required: true,
                message: `Deviations is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Deviations*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"finalScore"}
            rules={[
              {
                required: true,
                message: `Final score is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Final score*"}
              type="text"
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

export default FinalAssessmentEdit;
