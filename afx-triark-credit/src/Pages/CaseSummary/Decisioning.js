import React, { useState, useContext } from 'react';
import { Radio, Tag } from 'antd';
import Label from '../../Components/label';
import InputText from '../../Components/Input';
import { Row, Col, Button, Form, Table } from 'antd';
import {
  getCaseDecisioningReason,
  createCustomer,
  downloadCreditMemo,
} from '../../Redux/Services/Cases';
import isEmpty from 'lodash/isEmpty';
import {
  saveDecisioning,
  getCaseDecisioning,
  queryReason,
} from '../../Redux/Services/Cases';
import Spin from '../../Components/Spin';
import App from '../../App';
import { saveAs } from 'file-saver';
import { BASE } from '../../Redux/Utils/httpInterceptor';

function Decisioning(props) {
  const [value, setValue] = React.useState('');
  const [data, setData] = React.useState({});
  const [decisioningData, setDecisioningData] = React.useState({});
  const [loader, setLoader] = useState(false);
  const [scoreDetails, setScoreDetails] = React.useState({});
  const [disabled, setDisabled] = React.useState(true);
  const [subQueryReason, setSubQueryReason] = React.useState([]);
  const [applicantUniqueId, setApplicantUniqueId] = useState(null);
  const { convertDurationtoSeconds, pause } = useContext(App.CaseContext);

  const userFreeze = props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = props.caseSummaryData?.mainapplicant[0]?.creditFreeze;
  const caseStatus = props.caseSummaryData?.mainapplicant[0]?.caseStatus;

  React.useEffect(() => {
    (async () => {
      setLoader(true);
      const data = await getCaseDecisioningReason();
      setData(data);
      const decisioningData = await getCaseDecisioning({
        applicantUniqueId: props.match.params.id,
        leadCode: props?.caseSummaryData?.mainapplicant[0]?.leadCode,
      });

      setScoreDetails(decisioningData?.scoreDetails);
      setDecisioningData(decisioningData);
      setValue(decisioningData?.reasonCategory);
      setLoader(false);

      const res = await createCustomer({
        applicant_uniqueid: props.match.params.id,
        isguarantor: false,
        ismainapplicant: true,
      });
    })();
  }, []);

  React?.useEffect(() => {
    props?.getCS();
    console.log('Response of GetCS', props?.getCS());
  }, []);

  React.useEffect(() => {
    form.setFieldsValue({
      reason: decisioningData?.reason,
      remark: decisioningData?.remark,
      reasonCategory: decisioningData?.reasonCategory,
      subQueryReason: decisioningData?.subQueryReason,
    });
    if (decisioningData?.scoreDetails) {
    }
    if (decisioningData?.reason) {
      setDisabled(false);
      (async () => {
        const reason = await queryReason({
          reasonCategory: decisioningData?.reasonCategory,
          reasonStage: decisioningData?.reason,
        });
        const re = await reason?.map((re) => {
          return { label: re?.subQueryReason, value: re?.subQueryReason };
        });
        setSubQueryReason(re);
      })();
    }
  }, [decisioningData]);

  React?.useEffect(() => {
    'Approve - STP';
    if (scoreDetails?.finalStatus) {
      props?.getCS();
    }
  }, [scoreDetails?.finalStatus]);

  let form;

  const { rejectList, relookList, holdList } = data;
  if (!isEmpty(data)) {
    var rejectlistOptions = rejectList.map((re) => {
      return { label: re.reason, value: re.reason };
    });
    var relookListOptions = holdList.map((re) => {
      return { label: re.reason, value: re.reason };
    });
    var holdListOptions = relookList.map((re) => {
      return { label: re.reason, value: re.reason };
    });
  }

  const onFinish = async (e) => {
    pause();
    let time = convertDurationtoSeconds();
    setLoader(true);
    const response = await saveDecisioning({
      applicantUniqueId: props.match.params.id,
      ...e,
      employeeId: localStorage.getItem('empId'),
      timeForDecision: time,
    });
    if (!response.data.data.error || response.data.data.error) {
      props.setRecallService(true);
      setLoader(false);
      setTimeout(() => {
        props?.getCS();
      }, 400);
    }
  };

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields.reasonCategory) {
      setValue(allFields.reasonCategory);
      form?.resetFields(['reason', 'remark', 'subQueryReason']);
    }
    if (changedFields.reasonCategory) {
      setDisabled(true);
      form?.resetFields(['reason', 'remark', 'subQueryReason']);
    }

    if (changedFields.reason) {
      form?.resetFields(['subQueryReason']);
      setDisabled(false);
      (async () => {
        const reason = await queryReason({
          reasonCategory: allFields.reasonCategory,
          reasonStage: changedFields.reason,
        });
        const re = await reason?.map((re) => {
          return { label: re?.subQueryReason, value: re?.subQueryReason };
        });
        setSubQueryReason(re);
      })();
    }
  };

  const generateCreditMemo = async () => {
    let response = await downloadCreditMemo(props.match.params.id);
    saveAs(response?.replace('/var/www/html', BASE));

    //Cors url added for testing download functionality
    // saveAs(
    //   `https://cors-anywhere.herokuapp.com/${response?.replace(
    //     '/var/www/html',
    //     BASE
    //   )}`
    // );
  };

  const dataSource = [
    {
      key: '1',
      bureauScore: scoreDetails?.bureauScore,
      bureauNotation: scoreDetails?.bureauNotation,
      totalLoanScore: scoreDetails?.totalLoanScore,
      applicationNotation: scoreDetails?.applicationNotation,
      finalStatus: scoreDetails?.finalStatus,
      colorCode: scoreDetails?.colorCode,
    },
  ];

  const columns = [
    {
      title: 'Bureau Score',
      dataIndex: 'bureauScore',
      key: 'bureauScore',
    },

    {
      title: 'Notation',
      dataIndex: 'bureauNotation',
      key: 'bureauNotation',
    },
    {
      title: 'Calculated Score',
      dataIndex: 'totalLoanScore',
      key: 'totalLoanScore',
    },
    {
      title: 'Notation',
      dataIndex: 'applicationNotation',
      key: 'applicationNotation',
    },
    {
      title: 'Final Value',
      dataIndex: 'finalStatus',
      key: 'finalStatus',
    },
    {
      title: 'Notation',
      dataIndex: 'colorCode',
      key: 'colorCode',
      render: (text) => (
        <div className='decTag'>
          {' '}
          <Tag color={text} style={{ backgroundColor: `${text}` }}></Tag>
        </div>
      ),
    },
  ];
  return (
    <Spin spinning={loader}>
      <div>
        <Form
          initialValues={{
            remember: true,
          }}
          name='dynamic_form_nest_item'
          onFinish={onFinish}
          autoComplete='off'
          ref={(e) => (form = e)}
          onValuesChange={handleFormChange}
        >
          <Col lg={24}>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Col>

          <Form.Item
            initialValue={value}
            name='reasonCategory'
            rules={[
              {
                required: true,
                message: 'Please Select an option',
              },
            ]}
          >
            <Radio.Group
              value={value}
              className={'radioGroup'}
              defaultValue={value}
              key={value}
              disabled={userFreeze || caseFreeze}
            >
              <Radio value={'Approved'}>Approve</Radio>
              <Radio value={'Reject'}>Reject</Radio>
              <Radio value={'Relook'}>Relook</Radio>
              <Radio value={'Hold'}>Hold</Radio>
            </Radio.Group>
          </Form.Item>
          <br />

          {(value === 'Reject' || value === 'Relook' || value === 'Hold') && (
            <>
              <Row type='flex'>
                <Col lg={4}>
                  <Label value={'Reason Stage*'} />
                </Col>
                <Col lg={6}>
                  <Form.Item
                    name='reason'
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
                      options={
                        value === 'Reject'
                          ? [...rejectlistOptions]
                          : value === 'Relook'
                          ? [...holdListOptions]
                          : [...relookListOptions]
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <br />

          {(value === 'Reject' || value === 'Relook' || value === 'Hold') && (
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
                      disabled={userFreeze || caseFreeze || disabled}
                      label={'Sub Query Reason'}
                      type={'dropdown'}
                      options={subQueryReason}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <br />
          <Row type='flex'>
            <Col lg={4}>
              <Label value={'Remarks*'} />
            </Col>
            <Col lg={6}>
              <Form.Item
                name='remark'
                rules={[
                  {
                    required: true,
                    message: 'Remark is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Remarks'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row type={'flex'} justify={'center'}>
            <Col lg={4}>
              <Button
                className='save-button'
                htmlType={'submit'}
                disabled={userFreeze || caseFreeze}
              >
                Save
              </Button>
            </Col>
            <Col lg={4}>
              {['Credit Approved', 'Credit Rejected'].includes(caseStatus) && (
                <Button
                  className='save-button'
                  htmlType={'submit'}
                  // disabled={userFreeze || caseFreeze}
                  onClick={() => {
                    generateCreditMemo();
                  }}
                >
                  Generate Credit Memo
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    </Spin>
  );
}

export default Decisioning;
