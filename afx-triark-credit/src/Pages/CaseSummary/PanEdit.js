import React from "react";
import {
  Form,
  Col,
  Row,
  Button,
  Radio,
  DatePicker,
  message,
  Upload,
} from "antd";
import verified from "../../Assets/verified.png";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  uploadDocument,
  deletePanGst,
  savePanGst,
  wrapperAPI,
} from "../../Redux/Services/Cases";
import {
  UploadOutlined,
  FileImageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";

const PanEdit = (props) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React?.useState({});
  const [fileName, setFileName] = React?.useState("");
  const [verifiedPan, setVerified] = React?.useState(false);
  const [panUploaded, setPanUploaded] = React?.useState(false);
  const [occupationType, setOccupationType] = React?.useState(null);
  const [documentType, setDocumentType] = React?.useState(null);
  const [fileData, setFileData] = React?.useState(null);
  const dateFormat = "DD/MM/YYYY";
  const customFormat = (value) => `Date of Birth: ${value.format(dateFormat)}`;
  const customFormat2 = (value) =>
    `Date of Incorporation: ${value.format(dateFormat)}`;

  React.useEffect(() => {
    setPanUploaded(props?.data?.filePath);
    setFileName(props?.data?.filePath);
  }, []);

  const propsUpload = {
    maxCount: 1,
    multiple: false,

    beforeUpload: (file) => {
      setFileList(file);
      uploadDocument({
        data: {
          panInfo: JSON.stringify({
            docType: documentType,
            leadCode: localStorage.getItem("leadCode"),
            mobileNumber: "",
            applicantUniqueId: props?.appId,
          }),
        },
        file,
      }).then((re) => {
        if (re?.data?.error) {
          form.resetFields(["document"]);
        } else {
          setPanUploaded(true);
          setFileData(re?.data?.data);
          setFileName(file?.name);
          form.setFieldsValue({
            panName: re?.data?.data?.panName,
            panNumber: re?.data?.data?.panNo,
          });
          if (re?.data?.data?.dateOfbirth) {
            form.setFieldsValue({
              dateOfBirth: moment(re?.data?.data?.dateOfbirth, dateFormat),
            });
          }
        }
      });
      return false;
    },
    onRemove: (file) => {
      setFileList("");
      deletePan();
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

  const deletePan = async () => {
    const response = await deletePanGst({
      leadCode: localStorage.getItem("leadCode"),
      applicantUniqueId: props?.appId,
    });
    if (!response?.data?.error) {
      setFileList("");
      setPanUploaded(false);
      setVerified(false);
    }
  };

  const verifyPan = async () => {
    const employeeId = localStorage.getItem("empId");
    const employeeName = localStorage.getItem("employeeName");
    const response = await wrapperAPI({
      panNumber: form.getFieldValue("panNumber"),
      employeeId: employeeId,
      employeeName: employeeName,
      dateOfBirth: form.getFieldValue("dateOfBirth")?.format("DD/MM/YYYY"),
      panName: form.getFieldValue("panName"),
      leadCode: localStorage.getItem("leadCode"),
      customerType: "individual",
      applicantUniqueId: props?.appId,
    });

    if (!response?.data?.error) {
      setVerified(true);
    }
  };

  const onFinish = async (values) => {
    const response = await savePanGst({
      ...values,
      id: props?.data?.id,
      applicantUniqueId: props?.appId,
      customerType: "individual",
      dateOfBirth: values?.dateOfBirth?.format("DD/MM/YYYY"),
      leadCode: localStorage.getItem("leadCode"),
      ismainapplicant: props?.isMainApplicant,
      isguarantor: props?.isGuarantor,
    });
    if (response?.data?.data?.filePath) {
      props?.getData();
      props?.getCS();
      props?.getSoleFlag();
      props?.getPanDetails();
      props?.setFlagEdit(true);
    }
  };
  const handleFormChange = (changedFields, allFields) => {
    if (changedFields) {
      setVerified(false);
    }
    if (changedFields?.occupationType) {
      setOccupationType(changedFields?.occupationType);
    }
    if (changedFields?.documentType) {
      setDocumentType(changedFields?.documentType);
      form?.resetFields([
        "gender",
        "occupationType",
        "panNumber",
        "panName",
        "dateOfBirth",
        "document",
      ]);
      deletePan();
      setPanUploaded(false);
    }
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        documentType: props?.data?.documentType,
        gender: props?.data?.gender,
        occupationType: props?.data?.occupationType,
        panName: props?.data?.panName,
        panNumber: props?.data?.panNumber,
        gender: props?.data?.gender,
        entity: props?.data?.entity,
      });

    if (props?.data?.verifyStatus == "Approved") {
      setVerified(true);
    }
    if (props?.data) {
      setOccupationType(props?.data?.occupationType);
      setDocumentType(props?.data?.documentType);
    }

    if (props?.data?.dateOfBirth) {
      form?.setFieldsValue({
        dateOfBirth: moment(props?.data?.dateOfBirth, "DD/MM/YYYY"),
      });
    }
  }, []);
  const disabledDate = (current) => {
    return current > moment().clone().subtract(18, "years");
  };

  const genderGroup = ["Male", "Female", "Transgender"]?.map((re) => {
    return { label: re, value: re };
  });

  const entityGroup = ["Sole Proprietory Firm", "Partnership Firm"]?.map(
    (re) => {
      return { label: re, value: re };
    }
  );

  return (
    <Form
      initialValues={{
        remember: true,
      }}
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      onValuesChange={handleFormChange}
      autoComplete="off"
      form={form}
    >
      <Row>
        <Form.Item
          name={"documentType"}
          rules={[
            {
              required: true,
              message: "Please Select Type",
            },
          ]}
        >
          <Radio.Group>
            <Radio value={"pan"}>Pan</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name={"occupationType"}
            rules={[
              {
                required: true,
                message: "Please Select OccupationType",
              },
            ]}
          >
            <Radio.Group
              name="radiogroup"
            >
              <Radio value={"salaried"}>Salaried</Radio>
              <Radio value={"selfemployed"}>Self-Employed</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <br />

      <Row>
        <Col span={16}>
          {" "}
          {panUploaded ? (
            <Row align="middle">
              <Col>
                <FileImageOutlined style={{ fontSize: 55 }} />
              </Col>
              <Col lg={8}>
                <>
                  <div>
                    {`${fileName?.split("/")?.pop()} `}
                    <DeleteOutlined
                      onClick={deletePan}
                      style={{
                        fontSize: 18,
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </>
              </Col>
            </Row>
          ) : (
            <Form.Item
              name={"document"}
              rules={[
                {
                  required: true,
                  message: "Please Select Document",
                },
              ]}
            >
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          )}
        </Col>
        {documentType == "pan" && (
          <Col span={8}>
            {verifiedPan ? (
              <div style={{ display: "flex" }}>
                <img src={verified} height="15px" width="15px" />{" "}
                <p> Verified</p>
              </div>
            ) : (
              <Button onClick={verifyPan} className="reset-button">
                Verify
              </Button>
            )}
          </Col>
        )}
      </Row>
      <br />
      <br />
      <Row gutter={[30, 10]}>
        {documentType == "pan" && (
          <Col lg={8}>
            <Form.Item
              name={"panNumber"}
              rules={[
                {
                  required: true,
                  message: `PAN Number is mandatory`,
                },
                {
                  pattern: new RegExp(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/),
                  message: "Invalid PAN number",
                },
              ]}
            >
              <InputText
                label={"PAN Number"}
                onInput={(e) => {
                  e.target.value = e.target.value.slice(0, 10).toUpperCase();
                }}
              />
            </Form.Item>
          </Col>
        )}
        <Col lg={8}>
          <Form.Item
            name="dateOfBirth"
            rules={[
              {
                required: true,
                message: "Date is mandatory",
              },
            ]}
          >
            <DatePicker
              placeholder={
                occupationType == "salaried"
                  ? "Date of Birth"
                  : "Date of Incorporation"
              }
              key={documentType || occupationType}
              disabledDate={disabledDate}
              format={
                occupationType == "salaried" ? customFormat : customFormat2
              }
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"panName"}
            rules={[
              {
                required: false,
                message: `Pan Name is mandatory`,
              },
            ]}
          >
            <InputText
              label={documentType == "pan" ? "Pan Name" : "Name"}
            />
          </Form.Item>
        </Col>{" "}
        {true && (
          <Col lg={8}>
            {occupationType == "salaried" ? (
              <Form.Item
                name={"gender"}
                rules={[
                  {
                    required: true,
                    message: `Gender is mandatory`,
                  },
                ]}
              >
                <InputText
                  key={form && form.getFieldValue("gender")}
                  label={"Gender"}
                  type="dropdown"
                  options={genderGroup}
                />
              </Form.Item>
            ) : (
              <Form.Item
                name={"entity"}
                rules={[
                  {
                    required: true,
                    message: `Customer Type is mandatory`,
                  },
                ]}
              >
                <InputText
                  key={form && form.getFieldValue("entity")}
                  options={entityGroup}
                  label={"Customer Type"}
                  type="dropdown"
                />
              </Form.Item>
            )}
          </Col>
        )}
      </Row>

      <Row justify="center" align="middle">
        <Button
          htmlType="submit"
          className="reset-button"
          disabled={documentType == "pan" && !verifiedPan}
        >
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default PanEdit;
