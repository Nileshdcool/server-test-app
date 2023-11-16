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
import {
  verifyDl,
  verifyVoter,
  deleteDocument,
  uploadPOIDocs,
  getkycdocumentlist,
  savePOI,
} from "../../Redux/Services/Cases";
import {
  UploadOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Label from "../../Components/label";

const KYCDocumentEdit = (props) => {
  const [form] = Form.useForm();
  const [fileName, setFileName] = React?.useState(null);
  const [fileName2, setFileName2] = React?.useState(null);
  const [addressType, setAddressType] = React?.useState(null);
  const [documentType, setDocumentType] = React?.useState(null);
  const [docUploaded, setDocUploaded] = React?.useState(false);
  const [docUploaded2, setDocUploaded2] = React?.useState(false);
  const [list, setList] = React?.useState([]);
  const [code, setCode] = React?.useState([]);
  const [resType, setResType] = React.useState([]);
  const [dataUpload, setDataUpload] = React.useState({});
  const [epicNo, setEpicNo] = React.useState("");
  const [dob, setDOB] = React.useState("");
  const [dlNo, setDlNo] = React.useState("");
  const [isVerified, setIsVerified] = React.useState(false);

  const dateFormat = "DD/MM/YYYY";
  const customFormat = (value) => `Date of Birth: ${value.format(dateFormat)}`;
  const customFormat2 = (value) =>
    `Date of Incorporation: ${value.format(dateFormat)}`;

  const uploadValues = {
    applicantUniqueId: props?.appId,
    leadCode: localStorage.getItem("leadCode"),
    mobileNumber: "",
    ismainapplicant: props?.otherProps?.isMainApplicant,
    isguarantor: props?.otherProps?.isGuarantor,
  };

  const addInfo = {};

  const propsUpload = {
    maxCount: 1,
    multiple: false,

    beforeUpload: (file) => {
      return false;
    },
    onRemove: (file) => {},

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

  const getUploadDocument = (doc1 = null, doc2 = null) => {
    return (
      <>
        {docUploaded ? (
          <>
            <Row align="middle">
              <Col>
                <FileImageOutlined style={{ fontSize: 55 }} />
              </Col>
              <Col>
                <>
                  <div>
                    {`${fileName ? fileName?.split("/")?.pop() : ""}`}
                    <DeleteOutlined
                      onClick={() => deleteDocumentPOI(false)}
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
          </>
        ) : (
          <>
            {doc1 && (
              <Col>
                <div style={{ marginRight: 20 }}>
                  <Form.Item
                    name={`${doc1}`}
                    rules={[
                      {
                        required: false,
                        message: "Please Select Document",
                      },
                    ]}
                  >
                    <Upload {...propsUpload}>
                      <Button icon={<UploadOutlined />}>Front Upload *</Button>
                    </Upload>
                  </Form.Item>
                </div>
              </Col>
            )}
          </>
        )}

        {documentType !== "drivingLicense" && documentType !== "other" && (
          <>
            {docUploaded ? (
              <>
                <Row align="middle">
                  <Col>
                    <FileImageOutlined style={{ fontSize: 55 }} />
                  </Col>
                  <Col>
                    <>
                      <div>
                        {`${fileName2 ? fileName2?.split("/")?.pop() : ""}`}
                        <DeleteOutlined
                          onClick={() => deleteDocumentPOI(false)}
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
              </>
            ) : (
              <>
                {doc2 && (
                  <Col>
                    <div style={{ marginRight: 20 }}>
                      <Form.Item
                        name={`${doc2}`}
                        rules={[
                          {
                            required: false,
                            message: "Please Select Document",
                          },
                        ]}
                      >
                        <Upload {...propsUpload}>
                          <Button icon={<UploadOutlined />}>
                            Back Upload *
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </Col>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  };

  // ---------------function to return upload----------------/

  const deleteDocumentPOI = async (isDeleteAll = false) => {
    deleteDocument({
      applicantUniqueId: props?.appId,
      docName: fileName,
      deleteflag: isDeleteAll,
    }).then((re) => {
      if (!re?.data?.error) {
        setDocUploaded(false);
        setDocUploaded2(false);
        onChangeDocType();
        setIsVerified(false);
      }
    });
  };

  const onUpload = async (payload) => {
    const response = await uploadPOIDocs(payload);

    if (!response?.data?.error) {
      form &&
        form?.setFieldsValue({
          aadharId: response?.data?.data?.addharNo,
          addharName: response?.data?.data?.addharName,

          fileNumber: response?.data?.data?.passportNum,

          dlno: response?.data?.data?.dlno,
          name: response?.data?.data?.name,

          epicno: response?.data?.data?.voterNo,
          otherName: response?.data?.data?.otherName,

          address1: response?.data?.data?.addresdetails?.line1,
          address2: response?.data?.data?.addresdetails?.line2,
          city: response?.data?.data?.addresdetails?.city,
          landmark1: response?.data?.data?.landmark1,
          landmark2: response?.data?.data?.landmark2,
          pincode: response?.data?.data?.addresdetails?.pin,
          state: response?.data?.data?.addresdetails?.state,
        });

      setDataUpload(response?.data?.data);

      setFileName(payload?.front?.file?.name);
      setTimeout(() => {
        setDocUploaded(true);
      }, 250);
      if (payload?.back?.file?.name) {
        setFileName2(payload?.back?.file?.name);
        setTimeout(() => {
          setDocUploaded2(true);
        }, 250);
      }
    }
    if (response?.data?.data?.dateOfBirth) {
      form &&
        form?.setFieldsValue({
          dateOfBirth: moment(response?.data?.data?.dateOfBirth, "DD/MM/YYYY"),
        });
    }
    if (response?.data?.data?.dateofbirth) {
      form &&
        form?.setFieldsValue({
          dateOfBirth: moment(response?.data?.data?.dateofbirth, "DD/MM/YYYY"),
        });
    }
    if (response?.data?.data?.dateOfbirth) {
      form &&
        form?.setFieldsValue({
          dateOfBirth: moment(response?.data?.data?.dateOfbirth, "DD/MM/YYYY"),
        });
    }
  };

  const onFinish = async (values) => {
    const response = await savePOI(
      {
        ...values,
        id: props?.data?.id,
        applicantUniqueId: props?.appId,
        leadCode: localStorage.getItem("leadCode"),
        utilityBillType: values?.addressType,
        ismainapplicant: props?.otherProps?.isMainApplicant,
        isguarantor: props?.otherProps?.isGuarantor,
        isguarantor: props?.data?.isGuarantor ? true : false,
        individual: true,
        dateOfBirth: values?.dateOfBirth?.format("DD/MM/YYYY"),
        docId:
          values?.aadharId ||
          values?.fileNumber ||
          values?.dlno ||
          values?.epicno ||
          values?.otherName,
        kycMonth: values?.kycMonth,
        kycYear: values?.kycYear,
      },
      props.editSection
    );

    if (!response?.data?.error) {
      props.setFlagEdit(true);
      props.HandleFetchData();
    } else {
      props.setFlagEdit(false);
      props.HandleFetchData();
    }
  };
  const handleFormChange = (changedFields, allFields) => {
    if (changedFields?.epicno) {
      setEpicNo(changedFields?.epicno);
    }

    if (changedFields?.dlno) {
      setDlNo(changedFields?.dlno);
    }

    if (changedFields?.dateOfBirth) {
      let dob = changedFields?.dateOfBirth?.format("DD-MM-YYYY");
      setDOB(dob);
    }

    if (changedFields?.docType) {
      setDocumentType(changedFields?.docType);
      setIsVerified(false);
    }
    if (changedFields.aadharfront || changedFields.aadharback) {
      if (allFields?.aadharfront && allFields?.aadharback) {
        const payload = { data: { addInfo: [] } };
        if (allFields.aadharback.file) {
          payload.back = allFields.aadharback;
          payload.data.addInfo.push({
            docName: allFields.aadharback.file.name,
            docType: "addhar back",
            ...uploadValues,
          });
        }
        if (allFields.aadharfront.file) {
          payload.front = allFields.aadharfront;
          payload.data.addInfo.push({
            docName: allFields.aadharfront.file.name,
            docType: "addhar Front",
            ...uploadValues,
          });
        }
        payload.data.addInfo = JSON.stringify(payload.data.addInfo);

        onUpload(payload);
      }
    }
    if (changedFields.passportfront || changedFields.passportback) {
      if (allFields?.passportfront && allFields?.passportback) {
        const payload = { data: { addInfo: [] } };
        if (allFields.passportfront.file) {
          payload.back = allFields.passportfront;
          payload.data.addInfo.push({
            docName: allFields.passportfront.file.name,
            docType: "passport front",
            ...uploadValues,
          });
        }
        if (allFields.passportback.file) {
          payload.front = allFields.passportback;
          payload.data.addInfo.push({
            docName: allFields.passportback.file.name,
            docType: "passport back",
            ...uploadValues,
          });
        }
        payload.data.addInfo = JSON.stringify(payload.data.addInfo);

        onUpload(payload);
      }
    }
    if (changedFields.dlfront) {
      const payload = { data: { addInfo: [] } };
      if (allFields.dlfront.file) {
        payload.front = allFields.dlfront;
        payload.data.addInfo.push({
          docName: allFields.dlfront.file.name,
          docType: "driving front",
          ...uploadValues,
        });
      }

      payload.data.addInfo = JSON.stringify(payload.data.addInfo);

      onUpload(payload);
    }
    if (changedFields.voterfront || changedFields.voterback) {
      if (allFields?.voterfront && allFields?.voterback) {
        const payload = { data: { addInfo: [] } };
        if (allFields.voterfront.file) {
          payload.back = allFields.voterfront;
          payload.data.addInfo.push({
            docName: allFields.voterfront.file.name,
            docType: "voter front",
            ...uploadValues,
          });
        }
        if (allFields.voterback.file) {
          payload.front = allFields.voterback;
          payload.data.addInfo.push({
            docName: allFields.voterback.file.name,
            docType: "voter back",
            ...uploadValues,
          });
        }
        payload.data.addInfo = JSON.stringify(payload.data.addInfo);

        onUpload(payload);
      }
    }

    if (changedFields.otherfront) {
      const payload = { data: { addInfo: [] } };
      if (allFields.otherfront.file) {
        payload.front = allFields.otherfront;
        payload.data.addInfo.push({
          docName: allFields.otherfront.file.name,
          docType: "other",
          ...uploadValues,
        });
      }

      payload.data.addInfo = JSON.stringify(payload.data.addInfo);

      onUpload(payload);
    }
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        markAsViewed: props?.data?.markAsViewed,
        address1: props?.data?.address1,
        address2: props?.data?.address2,
        addressType: props?.data?.addressType,
        billNumer: props?.data?.billNumer,
        city: props?.data?.city,
        landmark1: props?.data?.landmark1,
        landmark2: props?.data?.landmark2,
        otherResidanceType: props?.data?.otherResidanceType,
        pinCode: props?.data?.pinCode,
        residenceType: props?.data?.residenceType,
        state: props?.data?.state,
        billType: props?.data?.billType,
        serviceProvider: props?.data?.serviceProvider,
        consumerNumber: props?.data?.consumerNumber,
        lpgId: props?.data?.lpgId,
        std: props?.data?.std,
        landLineNumber: props?.data?.landLineNumber,
        landLineCity: props?.data?.landLineCity,
        docType: props?.data?.identityProofType,
        epicno: props?.data?.epicNumber,
        aadharId: props?.data?.aadharId,
        addharName: props?.data?.addharName,
        kycMonth: props?.data?.kycMonth,
        kycYear: props?.data?.kycYear,
        fileNumber: props?.data?.fileNumber,
        dlno: props?.data?.identityProofNo,
        otherName: props?.data?.otherName,
      });

    if (props?.data?.identityProofType) {
      setDocumentType(props?.data?.identityProofType);
    }

    if (props?.data?.verifyStatus == "Approved") {
      setIsVerified(true);
    }

    (async () => {
      getkycdocumentlist().then((re) => {
        if (re?.data?.data) {
          let value = re?.data?.data.map((re) => {
            return { label: re?.kycdoclist, value: re?.kycdoclist };
          });
          setList(value);
        }
      });
    })();

    if (props?.data) {
      setAddressType(props?.data?.addressType);
    }
    if (props?.data?.filePath) {
      setFileName(props?.data?.filePath?.[0]?.filePath);
      setDocUploaded(true);
      if (props?.data?.filePath?.[1]) {
        setFileName2(props?.data?.filePath?.[1]?.filePath);
        setDocUploaded2(true);
      }
    }

    if (props?.data?.dateOfBirth) {
      form?.setFieldsValue({
        dateOfBirth: moment(props?.data?.dateOfBirth, "DD/MM/YYYY"),
      });
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      const resDropdown = [
        "Owned",
        "Rented",
        "Staying with Relatives",
        "PG",
        "Corporate Provided",
      ];

      let finalResult = resDropdown?.map((re) => {
        return { label: re, value: re };
      });
      setResType(finalResult);
    })();
  }, []);

  const onChangeDocType = () => {
    form.resetFields([
      "address1",
      "address2",
      "addressType",
      "billNumer",
      "city",
      "landmark1",
      "landmark2",
      "otherResidanceType",
      "pinCode",
      "residenceType",
      "state",
      "billType",
      "serviceProvider",
      "consumerNumber",
      "lpgId",
      "std",
      "landLineNumber",
      "landLineCity",
      "std",
      "aadharId",
      "addharName",
      "addharName",
      "kycMonth",
      "kycYear",
      "dateOfBirth",
    ]);
    setDocUploaded(false);
    setDocUploaded2(false);
  };
  const disabledDate = (current) => {
    return current > moment().clone().subtract(18, "years");
  };

  const verifyPOI = async () => {
    let data;
    if (documentType == "drivingLicense") {
      data = {
        applicantUniqueId: props?.appId,
        dateOfBirth:
          form.getFieldValue("dateOfBirth")?.format("DD-MM-YYYY") || dob,
        dlNo: form.getFieldValue("dlno") || dlNo,
        employeeId: localStorage.getItem("empId"),
        employeeName: localStorage.getItem("employeeName"),
      };
      const response = await verifyDl(data);

      if (response?.data?.karzaStatusCode == "101") {
        setIsVerified(true);
      }
    }

    if (documentType == "voter") {
      data = {
        applicantUniqueId: props?.appId,
        epicNo: (form && form.getFieldValue("epicno")) || epicNo,
        employeeId: localStorage.getItem("empId"),
        employeeName: localStorage.getItem("employeeName"),
      };
      const response = await verifyVoter(data);

      if (response?.data?.karzaStatusCode == "101") {
        setIsVerified(true);
      }
    }
  };

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
        {props?.docType == "pan" ? (
          <>
            <Form.Item
              name={"docType"}
              rules={[
                {
                  required: true,
                  message: "Please Select Type",
                },
              ]}
            >
              <Radio.Group onChange={onChangeDocType}>
                <Radio value={"aadhar"}>Aadhar Card</Radio>
                <Radio value={"passport"}>Passport</Radio>
                <Radio value={"drivingLicense"}>Driving license</Radio>
                <Radio value={"voter"}>Voter's ID</Radio>
                <Radio value={"other"}>Other</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name={"docType"}
            rules={[
              {
                required: true,
                message: "Please Select Type",
              },
            ]}
          >
            <Radio.Group onChange={onChangeDocType}>
              <Radio value={"aadhar"}>Aadhar Card</Radio>
            </Radio.Group>
          </Form.Item>
        )}
      </Row>
      {documentType === "aadhar" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"aadharId"}
              rules={[
                {
                  required: true,
                  message: "Aadhar ID is mandatory",
                },
                {
                  pattern: new RegExp(/^\d+$/),
                  message: "Invalid Aadhar ID",
                },
              ]}
            >
              <InputText
                label="Aadhar ID*"
                onInput={(e) => {
                  e.target.value = e.target.value.slice(0, 12);
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"addharName"}
              rules={[
                {
                  required: true,
                  message: "Aadhar Name is mandatory",
                },
              ]}
            >
              <InputText label="Aadhar Name*" />
            </Form.Item>
          </Col>{" "}
        </Row>
      )}
      {documentType === "passport" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"fileNumber"}
              rules={[
                {
                  required: true,
                  message: "File  number is mandatory",
                },
                {
                  pattern: new RegExp(/[A-Z]{1}[0-9]{7}/),
                  message: "Invalid File Number",
                },
              ]}
            >
              <InputText label="File Number*" />
            </Form.Item>
          </Col>
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
                placeholder={"Date of Birth"}
                key={documentType}
                disabledDate={disabledDate}
                format={customFormat}
              />
            </Form.Item>
          </Col>{" "}
        </Row>
      )}
      {documentType === "drivingLicense" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"dlno"}
              rules={[
                {
                  required: true,
                  message: "Driving license number is mandatory",
                },
                {
                  pattern: new RegExp(/^[^*|\":<>[\]{}`\\()';@&$]+$/),
                  message: "Invalid DL Number",
                },
              ]}
            >
              <InputText label="DL No*" />
            </Form.Item>
          </Col>
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
                placeholder={"Date of Birth"}
                key={documentType}
                disabledDate={disabledDate}
                format={customFormat}
              />
            </Form.Item>
          </Col>{" "}
        </Row>
      )}
      {documentType === "voter" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"epicno"}
              rules={[
                {
                  required: true,
                  message: "Epic No is mandatory",
                },
              ]}
            >
              <InputText label="Epic No*" />
            </Form.Item>
          </Col>
        </Row>
      )}
      {documentType === "other" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"otherName"}
              rules={[
                {
                  required: true,
                  message: "Other  is mandatory",
                },
              ]}
            >
              <InputText label="Other*" type="dropdown" options={list} />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row>
        {documentType === "aadhar" &&
          getUploadDocument("aadharfront", "aadharback")}
        {documentType === "passport" &&
          getUploadDocument("passportfront", "passportback")}
        {documentType === "drivingLicense" && getUploadDocument("dlfront")}
        {documentType === "voter" &&
          getUploadDocument("voterfront", "voterback")}
        {documentType === "other" && getUploadDocument("otherfront")}
        <Col span={8}></Col>
        {(documentType == "voter" || documentType == "drivingLicense") && (
          <Col span={8}>
            {isVerified ? (
              <div style={{ display: "flex" }}>
                <img src={verified} height="15px" width="15px" />{" "}
                <p> Verified</p>
              </div>
            ) : (
              <Button onClick={verifyPOI} className="reset-button">
                Verify
              </Button>
            )}
          </Col>
        )}
      </Row>{" "}
      <br />
      <br />
      <Row gutter={[30, 10]}>
        <Col lg={8}>
          <Form.Item
            name={"address1"}
            rules={[
              {
                required: true,
                message: `Address1 is mandatory`,
              },
            ]}
          >
            <InputText label={"Address Line 1*"} />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"address2"}
            rules={[
              {
                required: false,
                message: `Address2 is mandatory`,
              },
            ]}
          >
            <InputText label={"Address Line 2"} />
          </Form.Item>
        </Col>{" "}
        <Col lg={8}>
          <Form.Item
            name={"landmark1"}
            rules={[
              {
                required: true,
                message: `Landmark1 is mandatory`,
              },
            ]}
          >
            <InputText label={"Landmark 1*"} />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"landmark2"}
            rules={[
              {
                required: false,
                message: `Landmark2 is mandatory`,
              },
            ]}
          >
            <InputText label={"Landmark 2"} />
          </Form.Item>
        </Col>{" "}
        <Col lg={8}>
          <Form.Item
            name={"residenceType"}
            rules={[
              {
                required: true,
                message: `Current Residence Type is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Current Residence Type*"}
              type="dropdown"
              options={resType}
            />
          </Form.Item>
        </Col>
        <Col lg={8}></Col>
        <Col lg={8}>
          <Form.Item
            name="pinCode"
            rules={[
              {
                required: true,
                message: "Pincode is mandatory",
              },
              {
                pattern: new RegExp(/^\d+$/),
                message: "Invalid Pincode",
              },
            ]}
          >
            <InputText
              label={"Pincode*"}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 6);
              }}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"city"}
            rules={[
              {
                required: true,
                message: `City is mandatory`,
              },
            ]}
          >
            <InputText label={"City*"} />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"state"}
            rules={[
              {
                required: true,
                message: `State is mandatory`,
              },
            ]}
          >
            <InputText label={"State*"} />
          </Form.Item>
        </Col>
      </Row>
      <br />
      <Row gutter={30}>
        <Col span={6}>
          <Label label="Residing at current address since" value={``} />
        </Col>
        <Col lg={4}>
          <Form.Item
            name={"kycYear"}
            rules={[
              {
                required: true,
                message: `Current Year is mandatory`,
              },
              {
                pattern: new RegExp(/^[0-9]+$/),
                message: "Invalid Input",
              },
            ]}
          >
            <InputText label={"Year*"} />
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item
            name={"kycMonth"}
            rules={[
              {
                required: true,
                message: `Current Month is mandatory`,
              },
              {
                pattern: new RegExp(/^([0-9]|[0-1][0-2])$/),
                message: "Invalid Input",
              },
            ]}
          >
            <InputText
              label={"Month*"}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Button htmlType="submit" className="reset-button">
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default KYCDocumentEdit;
