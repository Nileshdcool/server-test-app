import React from "react";
import { Form, Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  uploadApprovalMailFile,
  getApprovalMailFile,
  deleteApprovalMailFile,
} from "../../Redux/Services/FIReport";
import { BASE } from "../../Redux/Utils/httpInterceptor";
import _ from "lodash";

const DeviationUpload = (props) => {
  const [fileList, setFileList] = React?.useState({});
  const [file, setFile] = React?.useState("");
  const [filename, setFileName] = React?.useState(null);
  const [fileData, setFileData] = React?.useState(null);
  let params = useParams();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const data = {
      applicantId: params?.id,
    };

    const response = await uploadApprovalMailFile({
      file: values.file.file,
      applicantId: data?.applicantId,
    });

    if (response?.data?.error) {
      form.resetFields();
    } else {
      const res = await getApprovalMailFile({
        applicantId: params?.id,
      });
      setFile(res?.filePath.replace("/var/www/html", BASE));
      setFileName(res?.fileType);
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
  };

  const deleteFile = async () => {
    const res = await deleteApprovalMailFile({
      applicantId: params?.id,
    });

    if (res?.applicantUniqueId) {
      setFile("");
      setFileData({});
      setFileName("");
      form.resetFields();
    }
  };

  React.useEffect(() => {
    (async () => {
      const res = await getApprovalMailFile({
        applicantId: params?.id,
      });

      if (res?.filePath) {
        setFile(res?.filePath.replace("/var/www/html", BASE));
        setFileName(res?.fileType);
        setFileData(res);
        form && form.setFieldsValue("status", res?.status);
        form && form.setFieldsValue("remark", res?.remark);
      }
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
      >
        <Row gutter={[18, 24]}>
          <Col span={12}>
            {_.isEmpty(file) ? (
              <Form.Item
                name="file"
                rules={[
                  {
                    required: true,
                    message: "Deviation Mail is mandatory",
                  },
                ]}
              >
                <Upload {...prop}>
                  <Button icon={<UploadOutlined />}>
                    Deviation Mail Upload
                  </Button>
                </Upload>
              </Form.Item>
            ) : (
              <>
                {" "}
                <div style={{ display: "flex" }}>
                  <a target="_blank" href={file}>
                    {filename}
                  </a>
                  <div style={{ display: "flex" }}>
                    <DeleteOutlined
                      style={{ marginLeft: 8, color: "red" }}
                      onClick={deleteFile}
                    />
                  </div>
                </div>
                <br />
              </>
            )}
          </Col>

          <Col span={8}></Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={"reset-button"}>
            Upload
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DeviationUpload;
