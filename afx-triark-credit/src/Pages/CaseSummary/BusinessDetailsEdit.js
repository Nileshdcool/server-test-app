import React from "react";
import { Form, Col, Row, Button, Upload } from "antd";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import verified from "../../Assets/verified.png";
import {
  getSegmentList,
  getBankAccountType,
  getIndustryList,
  getSectorMaster,
  getSubIndustryList,
  getIfscDetails,
  getPennyDetails,
  saveBusinessDetails,
  uploadDocumentBD,
} from "../../Redux/Services/Cases";
import { uploadSelfieBS, deleteSelfieBS } from "../../Redux/Services/Cases";
import {
  FileImageOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const BusinessDetailsEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [segment, setSegment] = React?.useState(null);
  const [sector, setSector] = React?.useState(null);
  const [industry, setIndustry] = React?.useState(null);
  const [subIndustry, setSubIndustry] = React?.useState(null);
  const [accountType, setAccountType] = React?.useState(null);
  const [flagVerify, setFlagVerify] = React.useState(false);
  const [fileList, setFileList] = React?.useState({});
  const [showUploaded, setShowUploaded] = React?.useState(false);
  const [selfie, setSelfie] = React?.useState("");

  const uploadProps = {
    customRequest: uploadSelfieBS,
    businessInfo: JSON.stringify({
      applicant_uniqueid: props?.appId,
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
        uploadDocumentBD({
          data: {
            businessInfo: JSON.stringify({
              applicant_uniqueid: props?.appId,
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

  const deleteDocument = async () => {
    const response = await deleteSelfieBS({
      applicant_uniqueid: props?.appId,
    });

    if (!response?.data?.error) {
      setShowUploaded(false);
    }
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      id: props?.data?.id,
      applicant_uniqueid: id,
      lead_code: props?.data?.lead_code,
      isguarantor: props?.data?.isguarantor,
      ismainapplicant: props?.data?.ismainapplicant,
    };
    const response = await saveBusinessDetails(payload);
    if (!response?.data?.error) {
      props?.getData();
      props.setFlagEdit(true);
    }
  };

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields.ifscCode && changedFields.ifscCode.length === 11) {
      (async () => {
        if (changedFields.ifscCode.length === 11) {
          const response = await getIfscDetails({
            ifsc: changedFields.ifscCode,
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
    if (changedFields?.sector) {
      (async () => {
        form?.resetFields(["subindustry"]);
        const response = await getSubIndustryList({
          sector: changedFields?.sector,
        });
        let finalResult = response?.data?.data.map((re) => {
          return { label: re?.subindustryDesc, value: re?.subindustryDesc };
        });
        setSubIndustry(finalResult);
      })();
    }
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        accountNumber: props?.data?.accountNumber,
        accountType: props?.data?.accountType,
        bankName: props?.data?.bankName,
        ifscCode: props?.data?.ifscCode,
        industry: props?.data?.industry,
        isItCompanyBankAccount: props?.data?.isItCompanyBankAccount,
        monthlyIncome: props?.data?.monthlyIncome,
        sector: props?.data?.sector,
        segment: props?.data?.segment,
        subindustry: props?.data?.subindustry,
      });
      if(props?.data?.filePath){
        setShowUploaded(true)
        setSelfie(props?.data?.filePath);
      }
  }, []);

  React.useEffect(() => {
    (async () => {
      const response = await getBankAccountType();
      let finalResult = response?.data?.data.map((re) => {
        return { label: re?.accountType, value: re?.accountType };
      });
      setAccountType(finalResult);
    })();

    (async () => {
      const response = await getSegmentList();
      let finalResult = response?.data?.data.map((re) => {
        return { label: re?.segmentcode, value: re?.segmentcode };
      });
      setSegment(finalResult);
    })();

    (async () => {
      const response = await getIndustryList();
      let finalResult = response?.data?.data.map((re) => {
        return { label: re?.industryDesc, value: re?.industryDesc };
      });
      setIndustry(finalResult);
    })();

    (async () => {
      const response = await getSectorMaster();
      let finalResult = response?.data?.data.map((re) => {
        return { label: re?.sectorName, value: re?.sector_code };
      });
      setSector(finalResult);
    })();

    (async () => {
      const response = await getSubIndustryList({
        sector: form && form.getFieldValue("sector"),
      });
      let finalResult = response?.data?.data.map((re) => {
        return { label: re?.subindustryDesc, value: re?.subindustryDesc };
      });
      setSubIndustry(finalResult);
    })();
  }, []);

  const handlePennyDrop = async () => {
    const response = await getPennyDetails({
      applicantUniqueId: props?.appId,
      accountNumber: form && form.getFieldValue("accountNumber"),
      ifscNumber: form && form.getFieldValue("ifscCode"),
      type: "business",
    });
    if (response?.data?.data) {
      setFlagVerify(response?.data?.data?.verified);
    }
  };

  return (
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

        <br />
        <br />
        <Row gutter={[30, 10]}>
          <Col lg={8}>
            <Form.Item
              name={"sector"}
              rules={[
                {
                  required: true,
                  message: `Sector is mandatory`,
                },
              ]}
            >
              <InputText label={"Sector"} type={"dropdown"} options={sector} />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"industry"}
              rules={[
                {
                  required: false,
                  message: `Industry is mandatory`,
                },
              ]}
            >
              <InputText
                key={form && form.getFieldValue("industry")}
                label={"Industry"}
                type={"dropdown"}
                options={industry}
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={8}>
            <Form.Item
              name={"subindustry"}
              rules={[
                {
                  required: true,
                  message: `Subindustry is mandatory`,
                },
              ]}
            >
              <InputText
                key={form && form.getFieldValue("subindustry")}
                label={"Sub-industry"}
                type={"dropdown"}
                options={subIndustry}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"segment"}
              rules={[
                {
                  required: true,
                  message: `Segment is mandatory`,
                },
              ]}
            >
              <InputText
                key={form && form.getFieldValue("segment")}
                label={"Segment"}
                type={"dropdown"}
                options={segment}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"monthlyIncome"}
              rules={[
                {
                  required: true,
                  message: `Monthly Income is mandatory`,
                },
              ]}
            >
              <InputText
                key={form && form.getFieldValue("monthlyIncome")}
                label={"Monthly Income"}
                type={"number"}
               
              />
            </Form.Item>
          </Col>
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
              <InputText label={"Account Number"} />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"ifscCode"}
              rules={[
                {
                  required: true,
                  message: `ifscCode is mandatory`,
                },
              ]}
            >
              <InputText label={"Ifsc Code"} />
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
              <InputText label={"Bank Name"} />
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
            // htmlType="submit"
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
  );
};

export default BusinessDetailsEdit;
