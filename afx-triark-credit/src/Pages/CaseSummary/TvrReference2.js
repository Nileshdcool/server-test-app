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
  uploadTvrReferenceReport,
  getTvrReferenceReport,
  deleteTvrReferenceReport,
} from '../../Redux/Services/Tvr';
import { BASE } from '../../Redux/Utils/httpInterceptor';
import { STATUS } from '../../Utils/constants';
import _ from 'lodash';
import TvrReference2Edit from './TvrReference2Edit';
import { getTvrBorrowerReference2 } from '../../Redux/Services/Cases';

const TvrReference2 = (props) => {
  const [fileList, setFileList] = React?.useState({});
  const [file, setFile] = React?.useState('');
  const [filename, setFileName] = React?.useState(null);
  const [fileData, setFileData] = React?.useState(null);
  const [status, setStatus] = React?.useState(null);
  const [fileToDisplay, setFileToDisplay] = React?.useState(null);
  const [showInput, setShowInput] = useState(false);
  const [data, setData] = useState('');
  let params = useParams();
  const [form] = Form.useForm();

  const userFreeze = props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = props.caseSummaryData?.mainapplicant[0]?.creditFreeze;

  const statusOptions = STATUS?.map((item) => {
    return { label: item, value: item };
  });

  const onFinish = async (values) => {
    const data = {
      applicantUniqueId: params?.id,
      fileName: values?.file?.file?.name,
      status: values?.status,
      remark: values?.remark,
      type: 'Reference2',
    };
    const response = await uploadTvrReferenceReport({
      file: values?.file?.file,
      tvrReferenceInfo: JSON.stringify({
        ...data,
      }),
    });
    if (response?.data?.error) {
      form.resetFields();
      setFileToDisplay(null);
      setFile(null);
    } else {
      const res = await getTvrReferenceReport({
        applicantUniqueId: params?.id,
        type: 'Reference2',
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
    const res = await deleteTvrReferenceReport({
      applicantUniqueId: params?.id,
      type: 'Reference2',
    });
    if (res?.applicantUniqueId) {
      setFileToDisplay(null);
      setFile('');
      setFileData({});
      setFileName('');
      form.resetFields();
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getTvrBorrowerReference2({
        applicantUniqueId: params?.id,
        type: 'Reference2',
      });
      setData(response);
      console.log('getTvrBorrowerReference2 API response', response);
    })();
  }, []);

  const handleFormChange = async (e) => {
    if (e?.file) {
      setFileToDisplay(URL.createObjectURL(e?.file?.file));
    }
  };

  React.useEffect(() => {
    (async () => {
      const res = await getTvrReferenceReport({
        applicantUniqueId: params?.id,
        type: 'Reference2',
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
            <b>TVR Borrower Reference 2</b>
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
        <br />
        <br />
        {showInput === false ? (
          <div>
            <Row>
              <Col lg={8}>
                <Label label='Relation' value={data?.relation} />
              </Col>
              <Col lg={8}>
                <Label label='Known Since' value={data?.knownSince} />
              </Col>
              <Col lg={8}>
                <Label
                  label='Applicant Address Verification'
                  value={data?.applicantAddressVerifictaion ? 'Yes' : 'No'}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <TvrReference2Edit
            props={props}
            setShowInput={setShowInput}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </Row>
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
        <Row gutter={[18, 24]}>
          <Col span={12}>
            {_.isEmpty(file) ? (
              <Form.Item
                name='file'
                rules={[
                  {
                    required: true,
                    message: 'TVR Reference Report is mandatory',
                  },
                ]}
              >
                <Upload {...prop}>
                  <Button
                    icon={<UploadOutlined />}
                    disabled={userFreeze || caseFreeze}
                  >
                    TVR Reference Report Upload
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
          <Col span={12}>
            {fileToDisplay != null && (
              <a href={fileToDisplay} target='_blank'>
                <Button className={'reset-button'}>View</Button>
              </a>
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
        </Row>
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

export default TvrReference2;
