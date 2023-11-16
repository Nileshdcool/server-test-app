import { Button, Col, Form, Row } from 'antd';
import React, { useState } from 'react';
import InputText from '../../Components/Input';
import Label from '../../Components/label';
import Spin from '../../Components/Spin';
import Table from '../../Components/Table';
import { getRCU, saveRCU } from '../../Redux/Services/Cases';
import moment from 'moment';

function RCU(props) {
  const [rcuData, setRcuData] = React.useState([]);
  const [loader, setLoader] = useState(false);
  const { id } = props.match.params;
  let form = [];

  const userFreeze = props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = props.caseSummaryData?.mainapplicant[0]?.creditFreeze;

  const getData = async () => {
    setLoader(true);
    const response = await getRCU({
      applicantUniqueId: props.match.params.id,
    });
    setLoader(false);
    const data = [
      ...response?.data?.data.applicant.map((e, index) => {
        return e;
      }),
      ...response?.data?.data.coapplicant.map((e) => {
        return e;
      }),
      ...response?.data?.data.guarantor.map((e) => {
        return e;
      }),
    ];
    setRcuData(data);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const saveRcuDeatils = async (e, id) => {
    setLoader(true);
    const response = await saveRCU({
      applicantUniqueId: id,
      ...e,
    });
    if (!response.data.error) {
      getData();
    }
    setLoader(false);
  };

  const columns = [
    {
      title: 'Name',
      width: 120,
      render: (record) => {
        return (
          <Label
            label={record?.userName}
            value={
              record?.ismainapplicant
                ? 'Main Applicant'
                : record.iscoapplicant
                ? 'Co Applicant'
                : 'Guarantor'
            }
          />
        );
      },
    },
    {
      title: 'Documents',
      width: 100,
      render: (record, index) => {
        return (
          <div className='cursorPointer'>
            <Label
              label={'PAN & GST Verification'}
              extras={
                <span
                  onClick={(e) => {
                    window.scrollTo(200, 200);
                    props.setActiveItems({
                      mainPanels: [
                        ...props.activeItems.mainPanels,
                        'mainPanels_1',
                      ],
                      caseDetailsTab: `caseDetailsTab_${record.applicantUniqueId}`, //TAB
                      caseDetailsQdePanels: [`qde_${record.applicantUniqueId}`], //PAN, ADITIONAL DETAILS
                      caseDetailsQdeInternalPanels: `pan`, //KYC,UTILITY
                    });
                  }}
                >
                  {' '}
                  {record?.documents?.pan?.documentType}{' '}
                </span>
              }
            />
            <br />
            <Label
              label={'KYC Document'}
              extras={
                <span
                  onClick={(e) => {
                    window.scrollTo(200, 200);
                    props.setActiveItems({
                      mainPanels: [
                        ...props.activeItems.mainPanels,
                        'mainPanels_1',
                      ],
                      caseDetailsTab: `caseDetailsTab_${record.applicantUniqueId}`, //TAB
                      caseDetailsQdePanels: [`qde_${record.applicantUniqueId}`], //PAN, ADITIONAL DETAILS
                      caseDetailsQdeInternalPanels: `kyc`, //KYC,UTILITY
                    });
                  }}
                >
                  {' '}
                  {record?.documents?.kyc?.documentType}{' '}
                </span>
              }
            />
            <br />
            <Label
              label={'Utility Bill'}
              extras={
                <span
                  onClick={(e) => {
                    window.scrollTo(200, 200);
                    props.setActiveItems({
                      mainPanels: [
                        ...props.activeItems.mainPanels,
                        'mainPanels_1',
                      ],
                      caseDetailsTab: `caseDetailsTab_${record.applicantUniqueId}`, //TAB
                      caseDetailsQdePanels: [`qde_${record.applicantUniqueId}`], //PAN, ADITIONAL DETAILS
                      caseDetailsQdeInternalPanels: `utility`, //KYC,UTILITY
                    });
                  }}
                >
                  {' '}
                  {record?.documents?.utility?.documentType}{' '}
                </span>
              }
            />
          </div>
        );
      },
    },
    {
      title: 'Date & Time',
      width: 80,
      render: (record) => {
        const formatDateTime = (dateTime) => {
          if (dateTime) {
            const formattedDateTime = moment(dateTime).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            return formattedDateTime;
          }
          return ''; // Handle cases where dateTime is null or undefined
        };

        return (
          <>
            <Label value={formatDateTime(record?.documents?.pan?.dateTime)} />
            <br />
            <Label value={formatDateTime(record?.documents?.kyc?.dateTime)} />
            <br />
            <Label
              value={formatDateTime(record?.documents?.utility?.dateTime)}
            />
          </>
        );
      },
    },
    {
      title: 'Status',
      width: 100,
      render: (record) => {
        return (
          <>
            <Label
              value={record?.documents?.pan?.verifiedBy}
              label={record?.documents?.pan?.status}
            />
            <br />
            <Label
              value={record?.documents?.kyc?.verifiedBy}
              label={record?.documents?.kyc?.status}
            />
            <br />
            <Label
              value={record?.documents?.utility?.verifiedBy}
              label={record?.documents?.utility?.status}
            />
          </>
        );
      },
    },
    {
      title: 'Remark',
      width: 120,
      render: (record, index) => {
        const initial = {};
        if (record?.comment) {
          initial[`remark`] = record?.comment;
        }
        return (
          <>
            <Row type='flex' justify='end' gutter={[0, 50]}>
              <Form
                initialValues={{ ...initial }}
                name='dynamic_form_nest_item'
                onFinish={(e) => saveRcuDeatils(e, record?.applicantUniqueId)}
                ref={(e) => (form[index] = e)}
              >
                <Col lg='24'>
                  <Form.Item
                    name={`remark`}
                    rules={[{ required: true, message: 'Remark is mandatory' }]}
                  >
                    <InputText
                      readOnly={caseFreeze || userFreeze}
                      label={'Remark'}
                      value={record?.comment}
                      defaultValue={record?.comment}
                    />
                  </Form.Item>
                </Col>
                {!(caseFreeze || userFreeze) && (
                  <Col lg='24'>
                    <Button className='reset-button' htmlType={'submit'}>
                      Save
                    </Button>
                  </Col>
                )}
              </Form>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <Spin spinning={loader}>
      <div>
        <Row>
          <Col span={24}>
            <Table
              tableLayout
              bordered
              scroll={{ y: 200 }}
              size='small'
              columns={columns}
              dataSource={rcuData}
              rowKey={`${+new Date()}`}
            />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export default RCU;
