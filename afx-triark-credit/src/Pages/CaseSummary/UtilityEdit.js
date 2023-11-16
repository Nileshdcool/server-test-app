import React from "react";
import {
  Form,
  Col,
  Row,
  Button,
  Radio,
  message,
  Upload,
} from "antd";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  uploadUtility,
  getcitylist,
  getelectricompanycodelist,
  getutilitybilltype,
  getresidensetype,
  saveOrUpdateUtilityBill,
  deleteUtilityBill,
  getUtilityBillDetails,
} from "../../Redux/Services/Cases";
import {
  UploadOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import moment from "moment";

const UtilityEdit = (props) => {
  const [form] = Form.useForm();
  const [verifiedPan, setVerified] = React?.useState("");
  const [addressType, setAddressType] = React?.useState(null);
  const [fileName, setFileName] = React?.useState(null);
  const [fileNameBack, setFileNameBack] = React?.useState(null);
  const [documentType, setDocumentType] = React?.useState(null);
  const [docUploaded, setDocUploaded] = React?.useState(false);
  const [docUploadedBack, setDocUploadedBack] = React?.useState(false);
  const [city, setCity] = React?.useState([]);
  const [code, setCode] = React?.useState([]);
  const [billType, setBillType] = React?.useState([]);
  const [resType, setResType] = React.useState([]);
  const [serviceData, setServiceData] = React.useState([]);
  const [serviceCode, setServiceCode] = React.useState([]);
  const dateFormat = "DD/MM/YYYY";
  
  const beforeUploadfn = (file,type)=>{
     uploadUtility({
       data: {
         addInfo: JSON.stringify([
           {
             docName: file?.name,
             docType: type,
             billType: documentType,
             mobileNumber: "",
             applicantUniqueId: props?.appId,
             leadCode: localStorage.getItem("leadCode"),
             ismainapplicant: props?.data?.isMainPpplicant ? true : false,
             isguarantor: props?.data?.isGuarantor ? true : false,
           },
         ]),
       },
       file,
     }).then((re) => {
       ;
       if (re?.data?.error) {
          type == "front"
            ? form.resetFields(["document"])
            : form.resetFields(["documentBack"]);
       } else {
         type == "front" ? setDocUploaded(true) : setDocUploadedBack(true);
          type == "front"
            ? setFileName(re?.data?.data?.filePath)
            : setFileNameBack(re?.data?.data?.filePath);
         form.setFieldsValue({
           // fatherName: "RAJENDRA MODI",
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
   }


  const propsUpload = {
    maxCount: 1,
    multiple: false,
    onRemove: (file) => {
      ;
      deleteDocument();
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        ;
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const deleteDocument = async (isDeleteAll = false,type) => {
    deleteUtilityBill({
      applicantUniqueId: props?.appId,
      docName: fileName,
      deleteflag: isDeleteAll,
      docType: type
    }).then((re) => {
      if(!re?.data?.error){
        type == "front" ? setDocUploaded(false) : setDocUploadedBack(false)
      }
    });
  };

  const verifyPan = async () => {

  if(documentType == "electricity"){
     response = await getUtilityBillDetails({
       consumerId: form.getFieldValue("consumerNumber"),
       serviceprovider: serviceCode,
       type: "elBill",
     }).then((response) => {
       ;
       const { address = "" } = response?.data;
       if (address) {
         let splitAddress = address?.split(" ");
         let halfSplit = Math.floor(splitAddress?.length / 2);

         let arrayFirstHalf = splitAddress?.slice(0, halfSplit);
         let arraySecondHalf = splitAddress?.slice(
           halfSplit,
           splitAddress.length
         );

         let first = arrayFirstHalf?.toString();
         let second = arraySecondHalf?.toString();

         let firstLine = first?.replace(/,/g, " ");
         let secondLine = second?.replace(/,/g, " ");

         if (firstLine && secondLine) {
           form.setFieldsValue({
             address1: firstLine,
             address2: secondLine,
           });
         }
       }
     });

    }  
    
    if (documentType == "gas") {
      ;
       response = await getUtilityBillDetails({
         lpgId: form && form.getFieldValue("lpgId"),
         type: "gBill",
       }).then(response=>{
        
         const { ConsumerAddress = "", ConsumerNo = "" } = response?.data;
         if (ConsumerAddress) {
           let splitAddress = ConsumerAddress?.split(" ");
           let halfSplit = Math.floor(splitAddress.length / 2);

           let arrayFirstHalf = splitAddress?.slice(0, halfSplit);
           let arraySecondHalf = splitAddress?.slice(
             halfSplit,
             splitAddress?.length
           );

           let first = arrayFirstHalf?.toString();
           let second = arraySecondHalf?.toString();

           let firstLine = first?.replace(/,/g, " ");
           let secondLine = second?.replace(/,/g, " ");

           form.setFieldsValue({
             address1: firstLine,
             address2: secondLine,

             lpgId: ConsumerNo,
           });
         }
       });
       ;
        
    }
    
    if (documentType == "landLine") {
       response = await getUtilityBillDetails({
         telphoneNo:
           form.getFieldValue("stdNo") + "-" + form.getFieldValue("teleNo"),
         city: form.getFieldValue("landLineCity"),
         type: "lBill",
       }).then(response =>{

         ;
          const { address = "" } = response?.data;
          if(address){
             let splitAddress = address.split(" ");
             let halfSplit = Math.floor(splitAddress.length / 2);
  
             let arrayFirstHalf = splitAddress?.slice(0, halfSplit);
             let arraySecondHalf = splitAddress?.slice(
               halfSplit,
               splitAddress?.length
             );
  
             let first = arrayFirstHalf?.toString();
             let second = arraySecondHalf?.toString();
  
             let firstLine = first?.replace(/,/g, " ");
             let secondLine = second?.replace(/,/g, " ");
  
             form.setFieldsValue({
               address1: firstLine,
               address2: secondLine,
             });
          }
       });
    }

    if (!response?.data?.error) {
      setVerified(true);
    }
  };

  const onFinish = async (values) => {
    const response = await saveOrUpdateUtilityBill({
      ...values,
      id: props?.data?.id,
      applicantUniqueId: props?.appId,
      leadCode: localStorage.getItem("leadCode"),
      utilityBillType: values?.addressType,
      ismainapplicant: props?.data?.isMainPpplicant ? true : false,
      isguarantor: props?.data?.isGuarantor ? true : false,
      filePath: fileName,
      billNumber:
        values?.consumerNumber ||
        (values?.std && `${values?.std}-${values?.landLineNumber}`) ||
        values?.lpgId,
    });

    if (response?.data?.data) {
      props?.getUtilityDoc();
      props?.setFlagEdit(true);
    }
  };
  const handleFormChange = (changedFields, allFields) => {
    if (changedFields?.addressType) {
      setAddressType(changedFields?.addressType);
    }
    if (changedFields?.billType) {
      setDocumentType(changedFields?.billType);
      deleteDocument(true)
    }
    if(changedFields?.serviceProvider){
     const data = serviceData.filter(se=>{
         if(se?.serviceProvider == changedFields?.serviceProvider){
          setServiceCode(se?.code)
         }
      })
    }
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        isGuarantor: props?.data?.isGuarantor,
        isMainPpplicant: props?.data?.isMainPpplicant,
        address1: props?.data?.address1,
        address2: props?.data?.address2,
        addressType: props?.data?.addressType,
        billNumer: props?.data?.billNumer,
        city: props?.data?.city,
        landmark1: props?.data?.landmark1,
        landmark2: props?.data?.landmark2,
        leadCode: props?.data?.leadCode,
        markAsViewed: props?.data?.markAsViewed,
        otherResidanceType: props?.data?.otherResidanceType,
        pincode: props?.data?.pincode,
        residenceType: props?.data?.residenceType,
        state: props?.data?.state,
        billType: props?.data?.billType,
        serviceProvider: props?.data?.serviceProvider,
        consumerNumber: props?.data?.consumerNumber,
        lpgId: props?.data?.lpgId,
        std: props?.data?.std,
        landLineNumber: props?.data?.landLineNumber,
        landLineCity: props?.data?.landLineCity,
      });
      
    if (props?.data) {
      setAddressType(props?.data?.addressType);
      setDocumentType(props?.data?.billType);
    }
    if(props?.data?.filePath){
      setFileName(props?.data?.filePath);
      setDocUploaded(true)
    } 
    
    if (props?.data?.filePathBack) {
      setFileNameBack(props?.data?.filePathBack);
      setDocUploadedBack(true);
    }

    if(props?.data?.serviceProvider){
       const data = serviceData.filter((se) => {
         if (se?.serviceProvider == props?.data?.serviceProvider) {
           ;
           setServiceCode(se?.code);
         }
       });
    }

    if (props?.data?.dateOfBirth) {
      form?.setFieldsValue({
        dateOfBirth: moment(props?.data?.dateOfBirth, "DD/MM/YYYY"),
      });
    }

    (async () => {
      const resCity = await getcitylist();
      const resCode = await getelectricompanycodelist();
      const resBillType = await getutilitybilltype();
     
      let valueresBillType = resBillType?.data?.data.map((re) => {
        return { label: re?.billType, value: re?.billType };
      });
      setBillType(valueresBillType);

      let valueCity = resCity?.data?.data.map((re) => {
        return { label: re?.cityname, value: re?.cityname };
      });
      setCity(valueCity);

      setServiceData(resCode?.data?.data);

      let valueCode = resCode?.data?.data.map((re) => {
        return { label: re?.serviceProvider, value: re?.serviceProvider };
      });
      setCode(valueCode);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const response = await getresidensetype();
      ;

      let finalResult = response?.data?.indirestype.map((re) => {
        return { label: re?.residenceType, value: re?.residenceType };
      });
      setResType(finalResult);
    })();
  }, []);
  const disabledDate = (current) => {
    return current > moment().clone().subtract(18, "years");
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
        <Form.Item
          name={"billType"}
          rules={[
            {
              required: true,
              message: "Please Select Type",
            },
          ]}
        >
          <Radio.Group>
            <Radio value={"electricity"}>Electricity Bill</Radio>
            <Radio value={"gas"}>Gas Bill</Radio>
            <Radio value={"landLine"}>Landline Bill</Radio>
            <Radio value={"other"}>Other</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      {documentType === "electricity" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"serviceProvider"}
              rules={[
                {
                  required: true,
                  message: "Service Provider is mandatory",
                },
              ]}
            >
              <InputText
                label={"Service Provider*"}
                type="dropdown"
                options={code}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"consumerNumber"}
              rules={[
                {
                  required: true,
                  message: "Customer id is mandatory",
                },
                {
                  pattern: new RegExp(/^\d+$/),
                  message: "Invalid Consumer Number",
                },
              ]}
            >
              <InputText
                label={"Consumer Number*"}
              />
            </Form.Item>
          </Col>{" "}
          <Col span={8}>
            <Button onClick={verifyPan} className="reset-button">
              Get Details
            </Button>
          </Col>
        </Row>
      )}
      {documentType === "gas" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"lpgId"}
              rules={[
                {
                  required: true,
                  message: "LPG id is mandatory",
                },
                {
                  pattern: new RegExp(/^\d+$/),
                  message: "Invalid LPG Number",
                },
              ]}
            >
              <InputText
                label="LPG Id*"
              />
            </Form.Item>
          </Col>{" "}
          <Col span={8}>
            <Button onClick={verifyPan} className="reset-button">
              Get Details
            </Button>
          </Col>
        </Row>
      )}
      {documentType === "landLine" && (
        <Row gutter={[30, 30]}>
          <Col lg={4}>
            <Form.Item
              name={"std"}
              rules={[
                {
                  required: true,
                  message: "STD is mandatory",
                },
              ]}
            >
              <InputText
                label="STD*"
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"landLineNumber"}
              rules={[
                {
                  required: true,
                  message: "Telephone number is mandatory",
                },
                {
                  pattern: new RegExp(/^\d+$/),
                  message: "Invalid LPG Number",
                },
              ]}
            >
              <InputText
                label="Telephone Number*"
              />
            </Form.Item>
          </Col>
          <Col lg={4}></Col>
          <Col lg={8}>
            <Form.Item
              name={"landLineCity"}
              rules={[
                {
                  required: true,
                  message: "City name is mandatory",
                },
              ]}
            >
              <InputText
                label="City*"
                type="dropdown"
                options={city}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button onClick={verifyPan} className="reset-button">
              Get Details
            </Button>
          </Col>
        </Row>
      )}
      {documentType === "other" && (
        <Row gutter={[30, 30]}>
          <Col lg={8}>
            <Form.Item
              name={"otherResidanceType"}
              rules={[
                {
                  required: true,
                  message: "Other Type is mandatory",
                },
              ]}
            >
              <InputText
                label="Other*"
                type="dropdown"
                options={billType}
              />
            </Form.Item>
          </Col>{" "}
        </Row>
      )}

      <Row>
        <Col span={12}>
          {" "}
          {docUploaded ? (
            <Row align="middle">
              <Col>
                <FileImageOutlined style={{ fontSize: 55 }} />
              </Col>
              <Col lg={8}>
                <>
                  <div>
                    {`${fileName?.split("/")?.pop()} `}
                    <DeleteOutlined
                      onClick={() => deleteDocument(false, "front")}
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
              <Upload
                {...propsUpload}
                beforeUpload={(file) => {
                  beforeUploadfn(file, "front");
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          )}
        </Col>
        <Col span={12}>
          {" "}
          {docUploadedBack ? (
            <Row align="middle">
              <Col>
                <FileImageOutlined style={{ fontSize: 55 }} />
              </Col>
              <Col lg={8}>
                <>
                  <div>
                    {`${fileNameBack?.split("/")?.pop()} `}
                    <DeleteOutlined
                      onClick={() => deleteDocument(false, "back")}
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
              name={"documentBack"}
              rules={[
                {
                  required: true,
                  message: "Please Select Document",
                },
              ]}
            >
              <Upload
                {...propsUpload}
                beforeUpload={(file) => {
                  beforeUploadfn(file, "back");
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Row gutter={[30, 10]}>
        <Col span={24}>
          <Form.Item
            name={"addressType"}
            rules={[
              {
                required: true,
                message: "Please Select OccupationType",
              },
            ]}
          >
            <Radio.Group
              name="addressType"
            >
              <Radio value={"currentAddress"}>Current Address</Radio>
              <Radio value={"permanentAddress"}>Permanent Address</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
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
            <InputText
              label={"Address Line 1*"}
            />
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
            <InputText
              label={"Address Line 2"}
            />
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
            <InputText
              label={"Landmark 1*"}
            />
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
            <InputText
              label={"Landmark 2"}
            />
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
              label={"Residence Type*"}
              type="dropdown"
              options={resType}
            />
          </Form.Item>
        </Col>
        <Col lg={8}></Col>
        <Col lg={8}>
          <Form.Item
            name="pincode"
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
            <InputText
              label={"City*"}
            />
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
            <InputText
              label={"State*"}
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

export default UtilityEdit;
