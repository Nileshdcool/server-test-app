import React from "react";
import { Form, Col, Row, Button, Upload, message } from "antd";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  FileImageOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import verified from "../../Assets/verified.png";
import { uploadSelfie } from "../../Redux/Services/Cases";
import {
  uploadDocumentPD,
  getBankAccountType,
  getPennyDetails,
  getQualificationDetails,
  saveUpdatePersonalDetails,
  getIfscDetails,
  deleteSelfie,
} from "../../Redux/Services/Cases";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";

const PersonalDetailsEdit = (props) => {
  const [form] = Form.useForm();
  const [showUploaded, setShowUploaded] = React?.useState(false);
  const [selfie, setSelfie] = React?.useState("");

  const [flagVerify, setFlagVerify] = React.useState(false);
  const [aadharDisable, setAadharDisable] = React.useState(false);
  const [accountType, setAccountType] = React?.useState(null);
  const [qualificationDetails, setQualificationDetails] = React?.useState(null);
  const [fileList, setFileList] = React?.useState({});

  const uploadProps = {
    customRequest: uploadSelfie,
    personalInfo: JSON.stringify({
      applicantUniqueId: props?.appId,
    }),
  };

  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isPNG =
        file?.type === "image/png" ||
        file?.type === "image/jpeg" ||
        file?.type === "image/jpg";
      if (!isPNG) {
        message?.error(`${file?.name} is not a Image file`);
      } else {
        setFileList(file);
        uploadDocumentPD({
          data: {
            personalInfo: JSON.stringify({
              applicantUniqueId: props?.appId,
            }),
          },
          file,
        }).then((re) => {
          if (re?.data?.error) {
            form.resetFields(["document"]);
          } else {
            setSelfie(re?.data?.data?.filePath);
            setShowUploaded(true);
          }
        });
      }
      return false;
    },
    onRemove: (file) => {
      setFileList("");
      deleteDocument();
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

  const handlePennyDrop = async () => {
    const response = await getPennyDetails({
      applicantUniqueId: props?.appId,
      accountNumber: form && form.getFieldValue("accountNumber"),
      ifscNumber: form && form.getFieldValue("ifscCode"),
      type: "personal",
    });
    if (response?.data?.data) {
      setFlagVerify(response?.data?.data?.verified);
    }
  };

  let maritalStatus = ["Married", "Unmarried"]?.map((re) => {
    return { label: re, value: re };
  });

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields.ifscNumber && changedFields.ifscNumber.length === 11) {
      (async () => {
        if (changedFields.ifscNumber.length === 11) {
          const response = await getIfscDetails({
            ifsc: changedFields.ifscNumber,
          });
          if (response?.data?.error) {
            form && form.setFieldsValue({ bankName: "" });
          }
          if (response?.data?.data?.bank) {
            form &&
              form.setFieldsValue({ bankName: response?.data?.data?.bank });
          }
        }
      })();
    }
  };

  const deleteDocument = async () => {
    const response = await deleteSelfie({ applicantUniqueId: props?.appId });
    if (response?.data) {
      setShowUploaded(false);
    }
  };

  const onFinish = async (values) => {
    const response = await saveUpdatePersonalDetails({
      ...values,
      applicantUniqueId: props?.appId,
      id: props?.data?.id,
      filePath: selfie ? selfie : props?.data?.filePath,
    });
    if (!response?.data?.error) {
      props?.setFlagEdit(true);
      props?.getData();
    }
  };

  React.useEffect(() => {
    form.setFieldsValue({
      aadhaarNumber: props?.data?.aadhaarNumber,
      accountNumber: props?.data?.accountNumber,
      accountType: props?.data?.accountType,
      annualGrossIncome: props?.data?.annualGrossIncome,
      bankName: props?.data?.bankName,
      fatherName: props?.data?.fatherName,
      filePath: props?.data?.filePath,
      ifscNumber: props?.data?.ifscNumber,
      maritalStatus: props?.data?.maritalStatus,
      motherName: props?.data?.motherName,
      netMonthlyIncome: props?.data?.netMonthlyIncome,
      netMonthlyObligations: props?.data?.netMonthlyObligations,
      qualification: props?.data?.qualification,
      spouseName: props?.data?.spouseName,
    });

    (async () => {
      const response = await getBankAccountType();
      let finalResult = response?.data?.data.map((re) => {
        return { label: re?.bankAccountType, value: re?.bankAccountType };
      });
      setAccountType(finalResult);
    })();
    (async () => {
      const response = await getQualificationDetails();
      let finalResult = response?.data?.data.map((re) => {
        return { label: re?.qualification, value: re?.qualification };
      });
      setQualificationDetails(finalResult);
    })();
  }, []);

  React.useEffect(() => {
    if (props?.qdeData?.kycaddresDetails?.aadharId) {
      form.setFieldsValue({
        aadhaarNumber: props?.qdeData?.kycaddresDetails?.aadharId,
      });
      setAadharDisable(true);
    } else {
      setAadharDisable(false);
    }
  }, [props?.qdeData]);

  return (
    <>
      <Form
        initialValues={{
          remember: true,
        }}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        onValuesChange={handleFormChange}
      >
        <>
          <Row>
            {showUploaded ? (
              <Row align="middle">
                <Col>
                  <FileImageOutlined style={{ fontSize: 55 }} />
                </Col>
                <Col lg={8}>
                  <>
                    <div>
                      {`${selfie?.split("/")?.pop()} `}
                      <DeleteOutlined
                        onClick={deleteDocument}
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
          </Row>
          <br />
          <br />
          <Row gutter={[30, 10]}>
            <Col lg={8}>
              <Form.Item
                name={"fatherName"}
                rules={[
                  {
                    required: true,
                    message: `Father Name is mandatory`,
                  },
                  {
                    pattern: new RegExp(/^[A-Za-z ]+$/),
                    message: "Invalid Father Name",
                  },
                ]}
              >
                <InputText
                  label={"Father Name"}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name={"motherName"}
                rules={[
                  {
                    required: true,
                    message: `Mother's Name is mandatory`,
                  },
                  {
                    pattern: new RegExp(/^[A-Za-z ]+$/),
                    message: "Invalid Mother's Name",
                  },
                ]}
              >
                <InputText
                  label="Mother's Name"
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name={"maritalStatus"}
                rules={[
                  {
                    required: false,
                    message: `Marital Status is mandatory`,
                  },
                ]}
              >
                <InputText
                  key={form && form.getFieldValue("maritalStatus")}
                  label="Marital Status"
                  type={"dropdown"}
                  options={maritalStatus}
                />
              </Form.Item>
            </Col>{" "}
            <Col lg={8}>
              <Form.Item
                name={"spouseName"}
                rules={[
                  {
                    required: true,
                    message: `Spouse Name is mandatory`,
                  },
                  {
                    pattern: new RegExp(/^[A-Za-z ]+$/),
                    message: "Invalid Spouse Name",
                  },
                ]}
              >
                <InputText
                  label="Spouse Name"
                />
              </Form.Item>
            </Col>{" "}
            <Col lg={8}>
              <Form.Item
                name={"qualification"}
                rules={[
                  {
                    required: true,
                    message: `Qualification is mandatory`,
                  },
                ]}
              >
                <InputText
                  key={form && form.getFieldValue("qualification")}
                  label={"Qualification"}
                  type={"dropdown"}
                  options={qualificationDetails}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name={"aadhaarNumber"}
                rules={[
                  {
                    required: true,
                    message: `Aadhar Number is mandatory`,
                  },
                  {
                    pattern: new RegExp(/^\d+$/),
                    message: "Invalid Aadhar Number",
                  },
                ]}
              >
                <InputText
                  label={"Aadhar Number"}
                  disabled={aadharDisable}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 12);
                  }}
                />
              </Form.Item>
            </Col>{" "}
            <Col lg={8}>
              <Form.Item
                name={"annualGrossIncome"}
                rules={[
                  {
                    required: true,
                    message: `Annual Gross Income is mandatory`,
                  },
                  {
                    pattern: new RegExp(/^\d+$/),
                    message: "Invalid Annual Gross Income",
                  },
                ]}
              >
                <InputText
                  label={"Annual Gross Income"}
                />
              </Form.Item>
            </Col>{" "}
            <Col lg={8}>
              <Form.Item
                name={"netMonthlyIncome"}
                rules={[
                  {
                    required: true,
                    message: `Net Monthly Income is mandatory`,
                  },
                  {
                    pattern: new RegExp(/^\d+$/),
                    message: "Invalid Net Monthly Income",
                  },
                ]}
              >
                <InputText
                  label={"Net Monthly Income"}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name={"netMonthlyObligations"}
                rules={[
                  {
                    required: true,
                    message: `Net Monthly Obligation is mandatory`,
                  },
                  {
                    pattern: new RegExp(/^\d+$/),
                    message: "Invalid Net Monthly Obligation",
                  },
                ]}
              >
                <InputText
                  label="Net Monthly Obligation"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <br />
            <b>Bank Details</b>
            <br />
            <br />
          </Row>
          <Row gutter={[30, 10]}>
            <Col lg={8}>
              <Form.Item
                name={"accountType"}
                rules={[
                  {
                    required: false,
                    message: `Account Type is mandatory`,
                  },
                ]}
              >
                <InputText
                  key={form && form.getFieldValue("accountType")}
                  label={"Account Type"}
                  type={"dropdown"}
                  options={accountType}
                />
              </Form.Item>
            </Col>{" "}
            <Col lg={8}>
              <Form.Item
                name="accountNumber"
                rules={[
                  {
                    required: true,
                    message: "AccountNumber is mandatory",
                  },
                  {
                    pattern: new RegExp(/^\d+$/),
                    message: "Invalid AccountNumber",
                  },
                ]}
              >
                <InputText
                  label={"Account Number"}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name={"ifscNumber"}
                rules={[
                  {
                    required: true,
                    message: `IfscNumber is mandatory`,
                  },
                ]}
              >
                <InputText
                  label={"Ifsc Number"}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 11).toUpperCase();
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name={"bankName"}
                rules={[
                  {
                    required: true,
                    message: `Bank Name is mandatory`,
                  },
                ]}
              >
                <InputText
                  label={"Bank Name"}
                />
              </Form.Item>
            </Col>
          </Row>
        </>

        <Row justify="center" align="middle">
          {flagVerify ? (
            <>
              <img
                src={verified}
                height="15px"
                width="15px"
                style={{ marginRight: 12 }}
              />{" "}
              {"Verified"}
            </>
          ) : (
            <Button
              style={{ marginLeft: 12 }}
              onClick={handlePennyDrop}
              className="reset-button"
            >
              Verify
            </Button>
          )}
          <Button
            style={{ marginLeft: 12 }}
            htmlType="submit"
            className="reset-button"
          >
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default PersonalDetailsEdit;
