import React from "react";
import Label from "../../Components/label";
import InputText from "../../Components/Input";
import { Form, Col, Row, Button, Upload } from "antd";
import { useParams } from "react-router-dom";
import {
  saveOrUpdatePermanentAdd,
} from "../../Redux/Services/Cases";
import {
  uploadPermanent,
  deletePermanent,
} from "../../Redux/Services/Cases";
import {
  UploadOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

const PermanentDetailsEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [fileName, setFileName] = React?.useState(null);
  const [fileNameBack, setFileNameBack] = React?.useState(null);
  const [docUploaded, setDocUploaded] = React?.useState(false);
  const [docUploadedBack, setDocUploadedBack] = React?.useState(false);
  const [resType, setResType] = React.useState([]);

  const onFinish = async (values) => {
    const payload = {
      ...values,
      applicantUniqueId: id,
      leadCode: props?.data?.leadCode,
      type: "Permanent",
      id: props?.data?.id,
      sameKycFlag: props?.data?.sameKycFlag,
    };
    const response = await saveOrUpdatePermanentAdd(payload);
    if (!response?.data?.error) {
      props?.getData();
      props.setFlagEdit(true);
      props?.getPincode();
    }
  };

     const beforeUploadfn = (file, type) => {
       uploadPermanent({
         data: {
           permanentAddInfo: JSON.stringify({
             docType: type,
             applicantUniqueId: props?.appId,
           }),
         },
         file,
       }).then((re) => {
         if (re?.data?.error) {
           type == "front"
             ? form.resetFields(["document"])
             : form.resetFields(["documentBack"]);
         } else {
           type == "front" ? setDocUploaded(true) : setDocUploadedBack(true);
           type == "front"
             ? setFileName(re?.data?.data?.filePath)
             : setFileNameBack(re?.data?.data?.filePathBack);
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
     };

     const propsUpload = {
       maxCount: 1,
       multiple: false,
       onRemove: (file) => {
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

     const deleteDocument = async (isDeleteAll = false, type) => {
       deletePermanent({
         applicantUniqueId: props?.appId,
         docName: fileName,
         deleteflag: isDeleteAll,
         docType: type,
       }).then((re) => {
         if (!re?.data?.error) {
           type == "front" ? setDocUploaded(false) : setDocUploadedBack(false);
         }
       });
     };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        permanentAddress1: props?.data?.permanentAddress1,
        permanentAddress2: props?.data?.permanentAddress2,
        permanentAddressLandmark1: props?.data?.permanentAddressLandmark1,
        permanentAddressLandmark2: props?.data?.permanentAddressLandmark2,
        permanentPinCode: props?.data?.permanentPinCode,
        permanentCity: props?.data?.permanentCity,
        permanentResidenceType: props?.data?.permanentResidenceType,
        permanentState: props?.data?.permanentState,
        permanentYear: props?.data?.permanentYear,
        permanentMonth: props?.data?.permanentMonth,
      });
        if (props?.data?.filePath) {
          setFileName(props?.data?.filePath);
          setDocUploaded(true);
        }
        if (props?.data?.filePathBack) {
          setFileNameBack(props?.data?.filePathBack);
          setDocUploadedBack(true);
        }

    (async () => {
      const resDropdown = ["Owned" ,"Rented","Staying with Relatives","PG","Corporate Provided"]
      let finalResult = resDropdown?.map((re) => {
        return { label: re, value: re };
      });
      setResType(finalResult);
    })();
  }, []);

  return (
    <Form
      initialValues={{
        remember: true,
      }}
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <br />
      <Row gutter={[16, 16]}>
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
      <br />
      <Row gutter={[30, 10]}>
        <Col lg={8}>
          <Form.Item
            name={"permanentAddress1"}
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
            name={"permanentAddress2"}
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
            name={"permanentAddressLandmark1"}
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
            name={"permanentAddressLandmark2"}
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
            name="permanentPinCode"
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
            name={"permanentCity"}
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
            name={"permanentState"}
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
        <Col lg={8}>
          <Form.Item
            name={"permanentResidenceType"}
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
      </Row>
      <Row gutter={30}>
        <Col span={6}>
          <Label label="Residing at current address since" value={``} />
        </Col>
        <Col lg={4}>
          <Form.Item
            name={"permanentYear"}
            rules={[
              {
                required: true,
                message: `Current Year is mandatory`,
              },
              {
                pattern: new RegExp(/^[0-9]+$/),
                // pattern: new RegExp(/^([0-9]|[0-1][0-2])$/),
                message: "Invalid Input",
              },
            ]}
          >
            <InputText label={"Year*"} />
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item
            name={"permanentMonth"}
            rules={[
              {
                required: true,
                message: `Current Month is mandatory`,
              },
              {
                // pattern: new RegExp(/^[0-9]+$/),
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

export default PermanentDetailsEdit;
