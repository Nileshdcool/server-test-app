import React, { useState, useEffect } from 'react';
import { Form, Row, Col, DatePicker, Radio, Button } from 'antd';
import {
  getTvrBorrowerDetails,
  saveTvrBorrowerDetails,
} from '../../Redux/Services/Cases';
import InputText from '../../Components/Input';

function TvrBorrowerEdit(props) {
  const [form] = Form.useForm();
  const [data, setData] = useState('');

  const onFinish = async (e) => {

    const formData = {
      monthlyIncome: parseFloat(e?.monthlyIncome),
      rent: parseFloat(e?.rent),
      householdExpenses: parseFloat(e?.householdExpenses),
      obligations: parseFloat(e?.obligations),
      totalDisbosableIncome: e?.totalDisbosableIncome,
      emiToDi: parseFloat(e?.emiToDi),
      noEarningMembers: e?.noEarningMembers,
      noEarningDependents: e?.noEarningDependents,
      isVehicleLoanExists: e?.isVehicleLoanExists,
      vehicleNumber: e?.vehicleNumber,
      applicantUniqueId: props?.props?.match?.params?.id,
      emi: parseFloat(e?.emi),
    };
    if (formData.emiToDi === undefined) {
      formData.emiToDi = 0;
    }
    if (e.isVehicleLoanExists === 'Yes') {
      formData.isVehicleLoanExists = true;
      formData.vehicleNumber = e?.vehicleNumber;
    } else {
      formData.isVehicleLoanExists = false;
    }

    console.log('Form values:', formData);

    const response = await saveTvrBorrowerDetails(formData);

    props?.setShowInput(false);
    props.onDataUpdate(response?.data?.data);

    console.log('Data saved successfully', response);
  };

  useEffect(() => {
    (async () => {
      // console.log('entered into getdata useeffect');
      const response = await getTvrBorrowerDetails({
        applicantUniqueId: props?.props?.match?.params?.id,
      });
      setData(response);
      console.log('API response from Edit mode', response);

      form.setFieldsValue({
        monthlyIncome: response?.monthlyIncome,
        rent: response?.rent,
        householdExpenses: response?.householdExpenses,
        obligations: response?.obligations,
        totalDisbosableIncome: response?.totalDisbosableIncome,
        emiToDi: response?.emiToDi,
        noEarningMembers: response?.noEarningMembers,
        noEarningDependents: response?.noEarningDependents,
        isVehicleLoanExists: response?.isVehicleLoanExists ? 'Yes' : 'No',
        vehicleNumber: response?.vehicleNumber,
        emi: response?.emi,
      });
    })();
  }, []);

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
              name={'monthlyIncome'}
              rules={[
                {
                  required: true,
                  message: `Total Monthly Income is mandatory`,
                },
              ]}
            >
              <InputText label='Total Monthly Income' type={'number'} />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={'rent'}
              rules={[
                {
                  required: true,
                  message: 'Rent is mandatory',
                },
              ]}
            >
              <InputText
                label='Rent'
                type={'number'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name='householdExpenses'
              rules={[
                {
                  required: true,
                  message: 'Other Household Expenses is mandatory',
                },
              ]}
            >
              <InputText
                label='Other Household Expenses'
                type={'number'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[30, 10]}>
          <Col lg={8}>
            <Form.Item
              name='obligations'
              rules={[
                {
                  required: true,
                  message: `Obligations is mandatory`,
                },
              ]}
            >
              <InputText
                label='Obligations'
                type={'number'}
                // disabled={true}
              />
            </Form.Item>
          </Col>{' '}
          <Col lg={8}>
            <Form.Item
              name='emi'
              rules={[
                {
                  required: false,
                  message: `Obligations is mandatory`,
                },
              ]}
            >
              <hidden
                label='Emi'
                type={'number'}
                // disabled={true}
              />
            </Form.Item>
            <Form.Item
              name='emiToDi'
              rules={[
                {
                  required: false,
                  message: `Obligations is mandatory`,
                },
              ]}
            >
              <hidden
                label='EmiToDI'
                type={'number'}
                // disabled={true}
              />
            </Form.Item>
          </Col>{' '}
          <Col lg={8}>
            <Form.Item
              name='noEarningMembers'
              rules={[
                {
                  required: true,
                  message: `Number of Earning Members is mandatory`,
                },
              ]}
            >
              <InputText
                label='Number of Earning Members*'
                type={'number'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name='noEarningDependents'
              rules={[
                {
                  required: true,
                  message: `Number of Dependents is mandatory`,
                },
              ]}
            >
              <InputText
                label='Number of Dependents*'
                type={'number'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          <Col lg={10}>
            <Form.Item
              name='isVehicleLoanExists'
              label='Any Existing Vehicle Loan'
              rules={[
                {
                  required: true,
                  message: `Any Existing Vehicle Loan is mandatory`,
                },
              ]}
            >
              <Radio.Group>
                <Radio value='Yes'>Yes</Radio>
                <Radio value='No'>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {/* <Row gutter={[30, 10]}>
            <Col lg={8}> */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isVehicleLoanExists !==
              currentValues.isVehicleLoanExists
            }
          >
            {({ getFieldValue }) => {
              if (getFieldValue('isVehicleLoanExists') === 'Yes') {
                return (
                  <Row gutter={[30, 10]}>
                    <Col lg={24}>
                      <Form.Item
                        name={'vehicleNumber'}
                        rules={[
                          {
                            required: true,
                            message: `Vehicle Number is mandatory`,
                          },
                        ]}
                      >
                        <InputText label={'Vehicle Number'} type={'text'} />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              return null;
            }}
          </Form.Item>
          {/* </Col>
          </Row> */}
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

export default TvrBorrowerEdit;
