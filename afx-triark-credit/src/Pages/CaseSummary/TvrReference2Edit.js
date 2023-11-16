import React, { useState, useEffect } from 'react';
import { Form, Row, Col, DatePicker, Radio, Button } from 'antd';
import {
  getTvrBorrowerReference2,
  saveTvrBorrowerReference2,
} from '../../Redux/Services/Cases';
import InputText from '../../Components/Input';

function TvrReference2Edit(props) {
  const [form] = Form.useForm();
  const [data, setData] = useState('');

  const onFinish = async (e) => {
    const formData = {
      relation: e?.relation,
      knownSince: e?.knownSince,
      applicantAddressVerifictaion: e?.applicantAddressVerifictaion,
      applicantUniqueId: props?.props?.match?.params?.id,
      status: e?.status,
      remark: e?.remark,
      type: 'Reference2',
      fileName: e?.fileName,
    };

    console.log('Form values:', formData);

    const response = await saveTvrBorrowerReference2(formData);

    props?.setShowInput(false);
    props.onDataUpdate(response?.data?.data);

    console.log('Data saved successfully', response);
  };

  useEffect(() => {
    (async () => {
      const response = await getTvrBorrowerReference2({
        applicantUniqueId: props?.props?.match?.params?.id,
        type: 'Reference2',
      });
      setData(response);
      console.log(
        'getTvrBorrowerReference2 API response from Edit mode',
        response
      );

      form.setFieldsValue({
        relation: response?.relation,
        knownSince: response?.knownSince,
        applicantAddressVerifictaion: response?.applicantAddressVerifictaion
          ? 'Yes'
          : 'No',
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
              name={'relation'}
              rules={[
                {
                  required: true,
                  message: `Relation is mandatory`,
                },
              ]}
            >
              <InputText label='Relation' type={'text'} />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={'knownSince'}
              rules={[
                {
                  required: true,
                  message: 'Known since is mandatory',
                },
              ]}
            >
              <InputText
                label='Known Since'
                type={'text'}
                // disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[30, 10]}>
          <Col lg={10}>
            <Form.Item
              name='applicantAddressVerifictaion'
              label='Applicant Address Verification'
              rules={[
                {
                  required: true,
                  message: `Applicant Address Verification is mandatory`,
                },
              ]}
            >
              <Radio.Group>
                <Radio value='Yes'>Yes</Radio>
                <Radio value='No'>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
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

export default TvrReference2Edit;
