import React, { useState, useEffect } from 'react';
import { Form, Row, Col, DatePicker, Radio, Button } from 'antd';
import { getLoanDet, saveLoanDet } from '../../Redux/Services/Cases';
import InputText from './../../Components/Input';

function LoanDetEdit(props) {
  const [form] = Form.useForm();
  const [data, setData] = useState('');

  const onFinish = async (e) => {
    console.log('e', e);
    const response = await saveLoanDet({
      applicantUniqueid: props?.props?.match?.params?.id,
      iotDeviceCharges: e?.iotDeviceCharges,
      processingFees: e?.processingFee,
      // upfrontAmount: e?.upfrontPayment,
      tenure_requested: e?.tenure,
      rateOfInterest: e?.irrFlat,
      cliAmount: e?.cliAmount,
      downPayment: e?.downPayment,
    });
    props?.setShowInput(false);
    props.onDataUpdate(response.data.data);
  };
  // console.log('props--->', props);
  useEffect(() => {
    (async () => {
      const response = await getLoanDet({
        applicantUniqueid: props?.props?.match?.params?.id,
      });
      setData(response?.data?.data);
      form.setFieldsValue({
        iotDeviceCharges: response?.data?.data?.iotDeviceCharges,
      });
      form.setFieldsValue({
        processingFee: response?.data?.data?.processingFees,
      });
      form.setFieldsValue({
        cliAmount: response?.data?.data?.cliAmount,
      });
      form.setFieldsValue({
        downPayment: response?.data?.data?.downPayment,
      });
      form.setFieldsValue({ tenure: response?.data?.data?.tenure_requested });
      form.setFieldsValue({ irrFlat: response?.data?.data?.rateOfInterest });
    })();
  }, []);

  // console.log('data', data);

  return (
    <div>
      {' '}
      <Form
        initialValues={{
          remember: true,
        }}
        name='dynamic_form_nest_item'
        onFinish={onFinish}
        autoComplete='off'
        form={form}
        // onValuesChange={handleFormChange}
      >
        <Row gutter={[30, 10]}>
          <Col lg={8}>
            <Form.Item
              name={'iotDeviceCharges'}
              rules={[
                {
                  required: true,
                  message: `IOT Devide Charges is mandatory`,
                },
              ]}
            >
              <InputText label={'IOT Device charges'} type={'text'} />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={'processingFee'}
              rules={[
                {
                  required: true,
                  message: 'Processing Fee is mandatory',
                },
              ]}
            >
              <InputText
                label={'Processing Fee'}
                type={'text'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          {/* <Col lg={8}>
            <Form.Item
              name={'upfrontPayment'}
              rules={[
                {
                  required: true,
                  message: `Upfront Payment is mandatory`,
                },
              ]}
            >
              <InputText
                type={'number'}
                label={'Upfront Payment'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>{' '} */}
          <Col lg={8}>
            <Form.Item
              name={'cliAmount'}
              rules={[
                {
                  required: true,
                  message: `CLI is mandatory`,
                },
              ]}
            >
              <InputText
                type={'number'}
                label={'CLI'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={'downPayment'}
              rules={[
                {
                  required: true,
                  message: `Down Payment is mandatory`,
                },
              ]}
            >
              <InputText
                type={'number'}
                label={'Down Payment'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={'tenure'}
              rules={[
                {
                  required: true,
                  message: `Tenure is mandatory`,
                },
              ]}
            >
              <InputText
                label={'Tenure'}
                type={'number'}
                // disabled={true}
              />
            </Form.Item>
          </Col>{' '}
          <Col lg={8}>
            <Form.Item
              name={'irrFlat'}
              rules={[
                {
                  required: true,
                  message: `IRR Flat is mandatory`,
                },
              ]}
            >
              <InputText
                label={'IRR Flat*'}
                type={'number'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>{' '}
        </Row>

        <Row justify='center' align='middle'>
          <Button
            htmlType='submit'
            className='reset-button'
            // disabled={caseFreeze || userFreeze}
          >
            Save
          </Button>
        </Row>
      </Form>
    </div>
  );
}

export default LoanDetEdit;
