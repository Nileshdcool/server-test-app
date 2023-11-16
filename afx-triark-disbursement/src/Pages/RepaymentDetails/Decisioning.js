import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Radio,
  Col,
  notification,
  DatePicker,
} from 'antd';
import InputText from '../../Components/Input';
import Label from '../../Components/label';
import moment from 'moment';
import {
  getDecisioningDetails,
  saveDecisioningDetails,
  saveDecisioningDetailsLMS,
  getEngineChasis,
  updateEngineChasis,
  getSubQueryReasonType,
  getQueryReasonType,
} from '../../Redux/Services/repayment';
import { getCaseSummaryDetails } from '../../Redux/Services/documentUpload';
import Spin from '../../Components/Spin';
import VehicleChasis from './VehicleChasis';
import isEmpty from 'lodash/isEmpty';

// const onFinish = (values) => {
//   console.log("Success:", values);
// };

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function Repayment(props) {
  let form;
  // const [form] = Form.useForm();
  // let form;
  const [mode, setMode] = React.useState(null);
  const [data, setData] = React.useState({});
  const [decisioning, setDecisioning] = React.useState(null);
  const [disable, setDisable] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [caseSummaryData, setCaseSummaryData] = React.useState();
  const [engineNumber, setEngineNumber] = React.useState('');
  const [chasisNumber, setChasisNumber] = React.useState('');
  const [queryList, setQueryList] = React.useState([]);
  const [subqueryList, setSubQueryList] = React.useState([]);
  const userFreeze =
    (props.caseSummaryData?.modelAccess &&
      props.caseSummaryData?.modelAccess[0]?.read) ||
    (caseSummaryData && caseSummaryData?.modelAccess[0]?.read);
  const caseFreeze =
    (props.caseSummaryData?.modelAccess &&
      props.caseSummaryData?.mainapplicant[0]?.disbursementFreeze) ||
    (caseSummaryData && caseSummaryData?.mainapplicant[0]?.disbursementFreeze);

  useEffect(() => {
    getDecision();
  }, []);

  const getDecision = async () => {
    // setLoader(true);
    const response = await getDecisioningDetails({
      applicantUniqueId: props.match.params.id,
    });
    setDecisioning(response);
    setMode(response?.caseMoveToModule);
    setDisable(response?.journeyDisabled);
    console.log('response?', response);

    if (response?.queryReason) {
      (async () => {
        const response1 = await getQueryReasonType();
        console.log('su2', response);
        let reason = response1?.[0].map((re) => {
          return { label: re, value: re };
        });
        setQueryList(reason);
        const response2 = await getSubQueryReasonType({
          queryReason: response?.queryReason,
        });
        console.log('su2', response2);
        let subreason = response2?.[0].map((re) => {
          return { label: re, value: re };
        });
        setSubQueryList(subreason);
      })();
    }

    const response2 = await getQueryReasonType();
    console.log('su2', response2);
    let reason = response2?.[0].map((re) => {
      return { label: re, value: re };
    });
    setQueryList(reason);
  };

  React.useEffect(() => {
    form.setFieldsValue({
      remark: decisioning?.remark,
      caseMoveToModule: decisioning?.caseMoveToModule,
      queryReason: decisioning?.queryReason,
      subQueryReason: decisioning?.subQueryReason,
    });

    if (decisioning?.disbursePaymentStatus) {
      form.setFieldsValue({
        disbursePaymentStatus: decisioning?.disbursePaymentStatus,
      });
    }

    if (decisioning?.emiStartDate) {
      form.setFieldsValue({
        // emiStartDate: moment(decisioning?.emiStartDate, 'YYYY-MM-DD'),
        emiStartDate: moment(decisioning?.emiStartDate).utc(),
      });
    }
  }, [decisioning]);

  const employeeId = localStorage.getItem('empId');

  const onFinish = async (e) => {
    try {
      if (e.caseMoveToModule === 'LMS Module') {
        // if(decisioning?.isLmsPush && engineNumber && chasisNumber){
        setLoader(true);
        const response = await saveDecisioningDetailsLMS({
          applicantUniqueId: props.match.params.id,
          ...e,
          employeeId: employeeId,
        });
        setLoader(false);
        if (response.remark) {
          (async () => {
            const response = await getCaseSummaryDetails({
              applicantUniqueId: props.match.params.id,
              roleId: parseInt(localStorage.getItem('roleId')),
            });
            setCaseSummaryData(response);
            setLoader(false);
            getDecision();
          })();
        }
        // }else{
        //   notification.warning({ message: "Engine & Chasis Number should not be Empty" });
        // }
      } else {
        setLoader(true);
        const response = await saveDecisioningDetails({
          applicantUniqueId: props.match.params.id,
          ...e,
          employeeId: employeeId,
        });
        setLoader(false);
        if (response.remark) {
          (async () => {
            const response = await getCaseSummaryDetails({
              applicantUniqueId: props.match.params.id,
              roleId: parseInt(localStorage.getItem('roleId')),
            });
            setCaseSummaryData(response);
            setLoader(false);
          })();
        }
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  React.useEffect(() => {
    console.log('loader.........', loader);
  }, [loader]);

  const handleFormChangeR = (changedFields, allFields) => {
    console.log(changedFields);
    setMode(allFields.caseMoveToModule);
    if (changedFields?.queryReason) {
      (async () => {
        const response2 = await getSubQueryReasonType({
          queryReason: changedFields?.queryReason,
        });
        console.log('su2', response2);
        let subreason = response2?.[0].map((re) => {
          return { label: re, value: re };
        });
        setSubQueryList(subreason);
      })();
    }
  };

  const payStatus = ['Ok to Disburse', 'Payment on Hold']?.map((re) => {
    return { label: re, value: re };
  });

  const handleFormChangeEC = (changedFields, allFields) => {
    console.log('changedFields', changedFields);
    // setMode(allFields.caseMoveToModule);
    if (changedFields?.engineNumber) {
      setEngineNumber(changedFields?.engineNumber);
    }
    if (changedFields?.chasisNumber) {
      setChasisNumber(changedFields?.chasisNumber);
    }
  };

  const onFinishEC = async (e) => {
    console.log('onFinish.EC.......', e);
    const response = await updateEngineChasis({
      id: props?.match?.params?.id,
      ...e,
    });
  };

  const inputProps = {
    readOnly: props.freezeCase || props.freezeUser,
    disabled: props.freezeCase || props.freezeUser,
  };

  return (
    <Spin spinning={loader}>
      <div className='AddLeadContainer p-3'>
        <VehicleChasis
          id={props.match.params.id}
          userFreeze={userFreeze}
          caseFreeze={caseFreeze}
          handleFormChangeEC={handleFormChangeEC}
          onFinishEC={onFinishEC}
          isDelhiBranch={decisioning?.isDelhiBranch}
          mode={mode}
          setChasisNumber={setChasisNumber}
          setEngineNumber={setEngineNumber}
        />

        <Form
          name='basic'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onValuesChange={handleFormChangeR}
          onFinishFailed={onFinishFailed}
          ref={(e) => (form = e)}
          // form={foem}
        >
          <Row>
            <Form.Item name='caseMoveToModule'>
              <Radio.Group
                inputProps={inputProps}
                disabled={userFreeze || caseFreeze}
                style={{ display: 'flex', width: '100%' }}
                className='QDe-scheme-radio'
              >
                <span className='pr-1'>
                  {' '}
                  <Label label='Move to'></Label>
                </span>
                &nbsp;&nbsp;
                <Radio value={'Sales Module'}>Sales Module</Radio>
                <Radio value={'LMS Module'} disabled={disable}>
                  LMS Module{' '}
                </Radio>
                <Radio value={'Journey Complete'} disabled={!disable}>
                  Journey Complete
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Row>
          {mode === 'Sales Module' && (
            <>
              <Row type='flex'>
                <Col lg={4}>
                  <Label value={'Reason Stage*'} />
                </Col>
                <Col lg={6}>
                  <Form.Item
                    name='queryReason'
                    rules={[
                      {
                        required: true,
                        message: 'Reason Stage is mandatory',
                      },
                    ]}
                  >
                    <InputText
                      disabled={userFreeze || caseFreeze}
                      label={'Reason Stage'}
                      type={'dropdown'}
                      options={queryList}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <br />

          {mode === 'Sales Module' && (
            <>
              <Row type='flex'>
                <Col lg={4}>
                  <Label value={'Sub Query Reason*'} />
                </Col>
                <Col lg={6}>
                  <Form.Item
                    name='subQueryReason'
                    rules={[
                      {
                        required: true,
                        message: 'Sub Query Reason is mandatory',
                      },
                    ]}
                  >
                    <InputText
                      // onChange={handleQueryReason}
                      disabled={userFreeze || caseFreeze}
                      label={'Sub Query Reason'}
                      type={'dropdown'}
                      options={subqueryList}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {mode === 'LMS Module' && (
            <>
              <Row type='flex'>
                <Col lg={4}>
                  <Label value={'Payment Status*'} />
                </Col>
                <Col lg={6}>
                  <Form.Item
                    name='disbursePaymentStatus'
                    rules={[
                      {
                        required: true,
                        message: 'Payment Status is mandatory',
                      },
                    ]}
                  >
                    <InputText
                      // onChange={handleQueryReason}
                      disabled={userFreeze || caseFreeze}
                      label={'Payment Status'}
                      type={'dropdown'}
                      options={payStatus}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row type='flex'>
                <Col lg={4}>
                  <Label value={'EMI Start Date*'} />
                </Col>
                <Col lg={6}>
                  <Form.Item
                    name='emiStartDate'
                    rules={[
                      {
                        required: true,
                        message: 'EMI Start Date is mandatory',
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (value && value >= moment().startOf('day')) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Please select a future date');
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      disabled={userFreeze || caseFreeze}
                      style={{ width: '100%' }}
                      placeholder='Select EMI Start Date'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {(mode === 'Sales Module' ||
            mode === 'Credit Module' ||
            mode === 'LMS Module' ||
            mode === 'Journey Complete') && (
            <>
              <Label label='Remarks'></Label>
              <Form.Item
                name={'remark'}
                rules={[
                  {
                    required: true,
                    message: 'Remark is mandatory',
                  },
                ]}
              >
                <Input.TextArea
                  readOnly={userFreeze || caseFreeze}
                  inputProps={inputProps}
                />
              </Form.Item>
            </>
          )}
          <Row type={'flex'} justify={'center'}>
            <Button
              className={'reset-button'}
              htmlType='submit'
              disabled={
                userFreeze ||
                caseFreeze ||
                (mode === 'LMS Module' && !decisioning?.isLmsPush)
              }
              inputProps={inputProps}
            >
              Save
            </Button>
          </Row>
        </Form>
      </div>
    </Spin>
  );
}

export default Repayment;
