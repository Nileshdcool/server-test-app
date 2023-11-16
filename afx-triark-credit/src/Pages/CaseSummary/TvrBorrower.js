import React, { useEffect, useState } from 'react';
import { Form, Upload, message, Button, Row, Col } from 'antd';
import Label from '../../Components/label';
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import InputText from '../../Components/Input';
import { useParams } from 'react-router-dom';
import {
  uploadTvrBorrowerReport,
  getTvrBorrowerReport,
  deleteTvrBorrowerReport,
} from '../../Redux/Services/Tvr';
import { BASE } from '../../Redux/Utils/httpInterceptor';
import { STATUS } from '../../Utils/constants';
import _ from 'lodash';
import TvrBorrowerEdit from './TvrBorrowerEdit';
import { getTvrBorrowerDetails } from '../../Redux/Services/Cases';
import { Hidden } from '@material-ui/core';

const TvrBorrower = (props) => {
  const [fileList, setFileList] = React?.useState({});
  const [file, setFile] = React?.useState('');
  const [filename, setFileName] = React?.useState(null);
  const [fileData, setFileData] = React?.useState(null);
  const [status, setStatus] = React?.useState(null);
  const [fileToDisplay, setFileToDisplay] = React?.useState(null);
  const [data, setData] = useState('');
  const [showInput, setShowInput] = useState(false);

  //calculations

  let expense = 0;
  let totalDisposableIncome = 0;
  let emiToDi = 0;

  if (data.length !== 0) {
    expense = data?.rent + data?.householdExpenses;
    totalDisposableIncome =
      data?.monthlyIncome -
      (data?.rent + data?.householdExpenses + data?.obligations);
    emiToDi = (
      data?.emi /
      (data?.monthlyIncome -
        (data?.rent + data?.householdExpenses + data?.obligations))
    ).toFixed(2);
  }

  let params = useParams();
  const [form] = Form.useForm();

  const userFreeze = props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = props.caseSummaryData?.mainapplicant[0]?.creditFreeze;

  const statusOptions = STATUS?.map((item) => {
    return { label: item, value: item };
  });

  useEffect(() => {
    (async () => {
      const response = await getTvrBorrowerDetails({
        applicantUniqueId: params?.id,
      });
      setData(response);
      console.log('API response', response);
    })();
  }, [showInput]);

  const onFinish = async (values) => {
    const data = {
      applicantUniqueId: params?.id,
      fileName: values?.file?.file?.name,
      status: values?.status,
      remark: values?.remark,
    };
    const response = await uploadTvrBorrowerReport({
      file: values?.file?.file,
      tvrBorrowerInfo: JSON.stringify({
        ...data,
      }),
    });
    if (response?.data?.error) {
      form.resetFields();
      setFileToDisplay(null);
      setFile(null);
    } else {
      const res = await getTvrBorrowerReport({
        applicantUniqueId: params?.id,
      });
      setFileData(res);
      setFile(res?.filePath.replace('/var/www/html', BASE));
      setFileToDisplay(res?.filePath.replace('/var/www/html', BASE));
      setFileName(res?.fileName);
    }
  };

  const prop = {
    name: 'file',
    maxCount: 1,
    multiple: false,
    beforeUpload(file) {
      setFileList(file);
      return false;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove() {
      setFile(null);
      setFileToDisplay(null);
    },
  };

  const deleteFile = async () => {
    const res = await deleteTvrBorrowerReport({
      applicantUniqueId: params?.id,
    });
    if (res?.applicantUniqueId) {
      setFileToDisplay(null);
      setFile('');
      setFileData({});
      setFileName('');
      form.resetFields();
    }
  };

  const handleFormChange = async (e) => {
    if (e?.file) {
      setFileToDisplay(URL.createObjectURL(e?.file?.file));
    }
  };

  React.useEffect(() => {
    (async () => {
      const res = await getTvrBorrowerReport({
        applicantUniqueId: params?.id,
      });
      if (res) {
        setFile(res?.filePath.replace('/var/www/html', BASE));
        setFileToDisplay(res?.filePath.replace('/var/www/html', BASE));
        setFileName(res?.fileName);
      }
      setFileData(res);
      form && form.setFieldsValue({ status: res?.status, remark: res?.remark });
    })();
  }, []);

  const handleDataUpdate = (updatedData) => {
    setData(updatedData);
    setShowInput(false); // Disable edit mode
  };

  return (
    <div>
      <Row gutter={[18, 24]}>
        {/* Newly added inputs */}
        <Row>
          <Col lg={20}>
            <b>TVR Borrower Details</b>
          </Col>
          {!(caseFreeze || userFreeze) && (
            <Col span={4}>
              <EditOutlined
                style={{ fontSize: 20 }}
                onClick={() => setShowInput(!showInput)}
              />
            </Col>
          )}
          <br />
          <br />
        </Row>
        {showInput === false ? (
          <Row>
            <Col lg={8}>
              <Label label='Total Monthly Income' value={data?.monthlyIncome} />
            </Col>
            <Col lg={8}>
              <Label label='Rent' value={data?.rent} />
            </Col>
            <Col lg={8}>
              <hidden id='emiValue' value={data?.emi}></hidden>
            </Col>
            <Col lg={8}>
              <Label
                label='Other Household Expenses'
                value={data?.householdExpenses}
              />
            </Col>
            <Col lg={8}>
              <Label label='Expenses ' value={expense} />
            </Col>
            <Col lg={8}>
              <Label label='Obligations' value={data?.obligations} />
            </Col>
            <Col lg={8}>
              <Label
                label='Total Disposable Income'
                value={totalDisposableIncome}
              />
            </Col>
            <Col lg={8}>
              <Label
                label='EMI to DI(Total EMI/Disposable Income)'
                value={emiToDi}
              />
            </Col>
            <Col lg={8}>
              <Label
                label='Number of Earning Members'
                value={data?.noEarningMembers}
              />
            </Col>
            <Col lg={8}>
              <Label
                label='Number of Dependents'
                value={data?.noEarningDependents}
              />
            </Col>
            <Col lg={8}>
              <Label
                label='Any Existing Vehicle Loan'
                value={data?.isVehicleLoanExists ? 'Yes' : 'No'}
              />
            </Col>
            <Col lg={8}>
              <Label
                label='If Yes, Vehicle Number'
                value={
                  data?.isVehicleLoanExists === true ? data?.vehicleNumber : ''
                }
              />
            </Col>
          </Row>
        ) : (
          <TvrBorrowerEdit
            props={props}
            setShowInput={setShowInput}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </Row>
      <br />
      <br />
      <Form
        name='normal_login'
        className='login-form'
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onValuesChange={handleFormChange}
      >
        <Col span={12}>
          {fileToDisplay != null && (
            <a href={fileToDisplay} target='_blank'>
              <Button className={'reset-button'}>View</Button>
            </a>
          )}
        </Col>
        <Col span={12}>
          {_.isEmpty(file) ? (
            <Form.Item
              name='file'
              rules={[
                {
                  required: true,
                  message: 'TVR Borrower Report is mandatory',
                },
              ]}
            >
              <Upload {...prop}>
                <Button
                  icon={<UploadOutlined />}
                  disabled={userFreeze || caseFreeze}
                >
                  TVR Borrower Report Upload
                </Button>
              </Upload>
            </Form.Item>
          ) : (
            <>
              {' '}
              <div style={{ display: 'flex' }}>
                <a target='_blank' href={file.replace('/var/www/html', BASE)}>
                  {filename}
                </a>
                <div style={{ display: 'flex' }}>
                  <DeleteOutlined
                    disabled={userFreeze || caseFreeze}
                    style={{ marginLeft: 8, color: 'red' }}
                    onClick={deleteFile}
                  />
                </div>
              </div>
            </>
          )}
        </Col>
        <Col span={8}>
          {' '}
          <Form.Item
            name={'status'}
            rules={[
              {
                required: true,
                message: 'Status is mandatory',
              },
            ]}
          >
            <InputText
              disabled={userFreeze || caseFreeze}
              key={fileData?.status}
              defaultValue={fileData?.status?.toString()}
              label={'Status'}
              type={'dropdown'}
              options={statusOptions}
              onChange={(e) => {
                setStatus(e);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
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
              disabled={userFreeze || caseFreeze}
              label={'Remark'}
              defaultValue={fileData?.remark?.toString()}
              key={fileData?.remark}
            />
          </Form.Item>
        </Col>
        <Col span={8}></Col>

        <Form.Item>
          <Button
            disabled={fileData?.filePath}
            type='primary'
            htmlType='submit'
            className={'reset-button'}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TvrBorrower;
