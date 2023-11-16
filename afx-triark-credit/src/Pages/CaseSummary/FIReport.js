import React from "react";
import { Form, Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import InputText from "./../../Components/Input";
import { useParams } from "react-router-dom";
import {
  uploadFIReport,
  getFIReportDetails,
  deleteFIReportDetails,
} from "../../Redux/Services/FIReport";
import { BASE } from "../../Redux/Utils/httpInterceptor";
import {STATUS} from "../../Utils/constants";
import _ from "lodash";

const FIReport = (props) => {
  const [fileList, setFileList] = React?.useState({});
  const [file, setFile] = React?.useState("");
  const [filename, setFileName] = React?.useState(null);
  const [fileData, setFileData] = React?.useState(null);
  const [status, setStatus] = React?.useState(null);
  const [fileToDisplay, setFileToDisplay] = React?.useState(null);
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
    };
    const response = await uploadFIReport({
      file: values?.file?.file,
      fiReportInfo: JSON.stringify({
        ...data,
      }),
    });
    if (response?.data?.error) {
      form.resetFields();
      setFileToDisplay(null);
      setFile(null);
    } else {
      const res = await getFIReportDetails({
        applicantUniqueId: params?.id,
      });
      setFileToDisplay(res?.filePath.replace("/var/www/html", BASE))
      setFileData(res);
      setFile(res?.filePath.replace("/var/www/html", BASE));
      setFileName(res?.fileName);
    }
  };
  const prop = {
    name: "file",
    maxCount: 1,
    multiple: false,
    beforeUpload(file) {
      setFileList(file);
      return false;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove(){
      setFile(null)
      setFileToDisplay(null)
    }
  };

  const deleteFile = async () => {
    const res = await deleteFIReportDetails({
      applicantUniqueId: params?.id,
    });
    if (res?.applicantUniqueId) {
      setFileToDisplay(null)
      setFile("");
      setFileData({});
      setFileName("");
      form.resetFields();
    }
  };

  const handleFormChange = async (e) => {
    if(e?.file){
      setFileToDisplay(URL.createObjectURL(e?.file?.file))
    }
  }

  React.useEffect(() => {
    (async () => {
      const res = await getFIReportDetails({
        applicantUniqueId: params?.id,
      });
      if (res) {
        setFile(res?.filePath.replace("/var/www/html", BASE));
        setFileToDisplay(res?.filePath.replace("/var/www/html", BASE))
        setFileName(res?.fileName);
      }
      setFileData(res);
      form && form.setFieldsValue({ status: res?.status, remark: res?.remark });
    })();
  }, []);

  return (
    <div>
      <Form
        name="normal_login"
        className="login-form"
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
                name="file"
                rules={[
                  {
                    required: true,
                    message: "FI Report is mandatory",
                  },
                ]}
              >
                <Upload {...prop}>
                  <Button icon={<UploadOutlined /> } disabled={userFreeze || caseFreeze}>FI Report Upload</Button>
                </Upload>
              </Form.Item>
            ) : (
              <>
                {" "}
                <div style={{ display: "flex" }}>
                  <a target="_blank" href={file.replace("/var/www/html", BASE)}>
                    {filename}
                  </a>
                  <div style={{ display: "flex" }}>
                    <DeleteOutlined
                      disabled={userFreeze || caseFreeze}
                      style={{ marginLeft: 8, color: "red" }}
                      onClick={deleteFile}
                    />
                  </div>
                </div>
              </>
            )}
          </Col>
          <Col span={12}>
            {(fileToDisplay != null) && (
              <a href={fileToDisplay} target="_blank">
              <Button 
                className={"reset-button"}
              >
                View
              </Button>
              </a>
            )}
          </Col>
          <Col span={8}>
            {" "}
            <Form.Item
              name={"status"}
              rules={[
                  {
                      required: true,
                      message: "Status is mandatory",
                  },
              ]}>
             <InputText
                disabled={userFreeze || caseFreeze}
                key={fileData?.status}
                defaultValue={fileData?.status?.toString()}
                label={"Status"}
                type={"dropdown"}
                options={statusOptions}
                onChange={(e) => {
                  setStatus(e);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="remark"
              rules={[
                {
                  required: true,
                  message: "Remark is mandatory",
                },
              ]}
            >
              <InputText
                disabled={userFreeze || caseFreeze}
                label={"Remark"}
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
            type="primary"
            htmlType="submit"
            className={"reset-button"}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FIReport;
