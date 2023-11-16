import { CameraOutlined, PictureOutlined } from "@ant-design/icons";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { Button, Card, Col, DatePicker, Form, Radio, Row, Upload } from "antd";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import PdfIcon from "../../assets/Images/pdfIcon.png";
import SelectIcon from "../../assets/Images/select.svg";
import Verified from "../../assets/Images/verified.svg";
import {
  getQdeEntityList,
  resetUploadedPan,
  savePanGst,
  uploadDocument,
  verifyPanDetails,
  savePanGetGst,
  deleteDocuments,
  getQdeDetail,
} from "../../Redux/Services/Qde";
import { BASE_URL } from "../../Utility/Config";
import { public_url } from "../../Utility/Constant";
import { te, ts, tw } from "../../Utility/ReduxToaster";
import { CameraFeed } from "./CameraFeed";
import "./style.scss";



class pangstverify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableEntity: true,
      disableOccupationType: false,
      disablePanVerify: false,
      showWebCam: false,
      document_upload_list: null,
      showUploadImage: false,
      isSelected: false,
      isguarantor: false,
      occupationType: null,
      documenttype: null,
      docEdit: false,
      gender: null,
      showEntityType: false,
      entityType: false,
      gstNumber: "",
      noGST: false,
      gstDet: "",
      selfEmployVerify: false,
    };
  }

  handleChangeDate = (e) => {
    this.setState({ isSelected: e !== null });
  };

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  changeType = (e, type) => {
    const a = {};
    a[type] = e.target.value;
    this.setState({
      ...this.state,
      ...a,
    });
  };

  async componentDidMount() {
    await this.props.getQdeDetails({
      applicant_uniqueid: this.props.match.params.id,
      ismainapplicant: this.props.journey === "applicant",
      isguarantor: this.props.journey === "guarantor",
    });

    if (!this.props.qde.entityList.length) {
      await this.props.getQdeEntityList();
    }

    if (
      this.props.qde &&
      this.props.qde.getQdeSectionDetails &&
      this.props.qde.getQdeSectionDetails.data &&
      this.props.qde.getQdeSectionDetails.data.pangstdetails
    ) {
      const { pangstdetails } = this.props.qde.getQdeSectionDetails.data;
      if (
        pangstdetails &&
        pangstdetails.customerType === "individual" &&
        pangstdetails &&
        pangstdetails.occupationType === "selfemployed" &&
        pangstdetails &&
        pangstdetails.documentType === "pan"
        // &&
        // pangstdetails.entity === "Sole Proprietory Firm"
      ) {
        const getData = async () => {
          const response = await this.props.savePanGetGst({
            panNumber: pangstdetails.panNumber,
          });

          const data =
            (await response) && response.payload && response.payload.data;
          this.setState({ gstNumber: data });
          if (
            (response && response.payload && response.payload.error) === false
          ) {
            this.setState({ noGST: true });
          } else {
            this.setState({ noGST: false });
          }
        };
        getData();
      }
    }
  }

  submitForm = (e) => {
    if (
      !isEmpty(this.props.qde.uploadedDocumentData.success) ||
      (!isEmpty(this.props.qde.getQdeSectionDetails.data) &&
        !isEmpty(this.props.qde.getQdeSectionDetails.data.pangstdetails))
    ) {
      let id = null;
      if (
        this.props.qde.getQdeSectionDetails &&
        !isEmpty(this.props.qde.getQdeSectionDetails.data)
      ) {
        id = this.props.qde.getQdeSectionDetails.data.pangstdetails
          ? this.props.qde.getQdeSectionDetails.data.pangstdetails.id
          : null;
      }
      const { dateOfbirth, panNo, ...rest } = e;
      if (e.occupationType === "selfemployed") {
        this.props.savePanGst({
          ...rest,
          dateOfBirth: dateOfbirth && dateOfbirth.format("DD/MM/YYYY"),
          panNumber: panNo,
          ismainapplicant: this.props.journey === "applicant",
          isguarantor: this.props.journey === "guarantor",
          applicantUniqueId: this.props.match.params.id,
          lead_code: this.props.qde.getQdeSectionDetails.data.leadCode,
          leadCode: this.props.qde.getQdeSectionDetails.data.leadCode,
          id,
        });
      } else if (e.occupationType === "salaried") {
        this.props.savePanGst({
          ...rest,
          dateOfBirth: dateOfbirth && dateOfbirth.format("DD/MM/YYYY"),
          panNumber: panNo,
          ismainapplicant: this.props.journey === "applicant",
          isguarantor: this.props.journey === "guarantor",
          applicantUniqueId: this.props.match.params.id,
          lead_code: this.props.qde.getQdeSectionDetails.data.leadCode,
          leadCode: this.props.qde.getQdeSectionDetails.data.leadCode,
          id,
        });
      }
    } else {
      te("Please upload valid document");
    }
    setTimeout(()=>{
      this.props.getQdeDetail({
        applicant_uniqueid: this.props.match.params.id,
        ismainapplicant: this.props.journey  === "applicant",
        isguarantor: this.props.journey === "guarantor",
      });
    },500)
  };

  deleteUpload = (e) => {
    this.form.resetFields(["panNo", "dateOfbirth", "panName", "gender", "gst"]);
    this.setState({
      document_upload_list: null,
      showUploadImage: false,
    });
    let leadCode =
      this.props.qde.getQdeSectionDetails.data &&
      this.props.qde.getQdeSectionDetails.data.leadCode;
    this.props.resetUploadedPan(
      { leadCode, applicantUniqueId: this.props.match.params.id },
      true
    );
  };

  formChange = (changedFields, allFields) => {
    let pan = this.form.getFieldValue("panNo");
    if (
      changedFields.occupationType === "selfemployed" &&
      pan?.substring(3, 4) === "P"
    ) {
      console.log("inside selEmployed");
      this.setState({ selfEmployVerify: false });
    }
    if (changedFields.customerType || changedFields.occupationType) {
      const { customerType, occupationType, entity } =
        this.form.getFieldsValue();
      this.setState({
        disableEntity: !(
          customerType === "non-individual" ||
          (customerType === "individual" && occupationType === "selfemployed")
        ),
        disableOccupationType: !(customerType === "individual"),
      });
      if (customerType === "non-individual") {
        this.form.resetFields(["occupationType"]);
      } else {
        this.form.resetFields(["entity"]);
      }

      //For showing Entity Dropdown for Individual and Self-Employed
      if (
        allFields.customerType === "individual" &&
        changedFields.occupationType === "selfemployed"
      ) {
        this.setState({ showEntityType: true });
      } else {
        this.setState({ showEntityType: false });
      }
    }

    if (changedFields.documentType) {
      if (
        changedFields.documentType === "form60" &&
        this.props &&
        this.props.qde &&
        this.props.qde.getQdeSectionDetails &&
        this.props.qde.getQdeSectionDetails.data &&
        this.props.qde.getQdeSectionDetails.data.additionalDetails &&
        this.props.qde.getQdeSectionDetails.data.additionalDetails
          .kycaddresDetails &&
        this.props.qde.getQdeSectionDetails.data.additionalDetails
          .kycaddresDetails.identityProofType !== "voter"
      ) {
        this.props.deleteDocuments({
          applicantUniqueId: this.props.match.params.id,
          deleteflag: true,
        });
      }

      if (
        !isEmpty(this.props.qde.uploadedDocumentData.success) ||
        (!isEmpty(this.props.qde.getQdeSectionDetails) &&
          !isEmpty(this.props.qde.getQdeSectionDetails.data) &&
          !isEmpty(this.props.qde.getQdeSectionDetails.data.pangstdetails) &&
          !isEmpty(
            this.props.qde.getQdeSectionDetails.data.pangstdetails.filePath
          ))
      ) {
        const { panName, dateOfbirth, panNo, gender } =
          this.form.getFieldsValue();

        if (
          (panName && panName.length > 0) ||
          (this.state.document_upload_list &&
            this.state.document_upload_list.length > 0) ||
          (dateOfbirth && dateOfbirth.length > 0) ||
          (gender && gender.length > 0)
        ) {
          const docType =
            changedFields.documentType === "pan" ? "Form60" : "Pan";
          tw(`${docType} data will get reset`);
          this.deleteUpload();
        }
      }
      this.setState({
        disablePanVerify: changedFields.documentType === "pan" ? false : true,
        isSelected: false,
      });
      this.setState({
        disablePanVerify: changedFields.documentType === "pan" ? false : true,
        isSelected: false,
      });
    }

    if (changedFields.occupationType) {
      if (
        !isEmpty(this.props.qde.uploadedDocumentData.success) ||
        (!isEmpty(this.props.qde.getQdeSectionDetails) &&
          !isEmpty(this.props.qde.getQdeSectionDetails.data) &&
          !isEmpty(this.props.qde.getQdeSectionDetails.data.pangstdetails) &&
          !isEmpty(
            this.props.qde.getQdeSectionDetails.data.pangstdetails.filePath
          ))
      ) {
        const { panName, dateOfbirth, panNo, gender } =
          this.form.getFieldsValue();

        if (
          (panName && panName.length > 0) ||
          (this.state.document_upload_list &&
            this.state.document_upload_list.length > 0) ||
          (dateOfbirth && dateOfbirth.length > 0) ||
          (gender && gender.length > 0)
        ) {
          const occTypes =
            changedFields.occupationType === "salaried"
              ? "Self Employed"
              : "Salaried";
          tw(`${occTypes} data will get reset`);
          this.deleteUpload();
        }
      }
    }

    if (changedFields.customerType) {
      if (!isEmpty(this.props.qde.uploadedDocumentData.success)) {
        const docType = changedFields.documentType === "pan" ? "Form60" : "Pan";
        tw(`${docType} data will get reset`);
        this.deleteUpload();
      }
    }
  };

  verifyPanDetails = async (e) => {
    let pan = this.form.getFieldValue("panNo");
    if (
      this.form &&
      this.form.getFieldValue("occupationType") === "selfemployed" &&
      pan?.substring(3, 4) === "C"
    ) {
      console.log("inside if");
      this.setState({ selfEmployVerify: true });
    }
    if (
      this.state.showEntityType &&
      this.props.qde.panVerified &&
      this.state.noGST &&
      this?.form?.getFieldValue("occupationType") === "selfemployed" &&
      pan?.substring(3, 4) === ("P" || "C")
    ) {
      console.log("inside iff");
      this.setState({ selfEmployVerify: true });
    }
    const {
      panNo,
      dateOfbirth,
      panName,
      customerType,
      occupationType,
      documentType,
    } = this.form.getFieldsValue();
    if (
      !isEmpty(this.props.qde.uploadedDocumentData.success) ||
      (this.props.qde &&
        this.props.qde.getQdeSectionDetails &&
        this.props.qde.getQdeSectionDetails.data &&
        this.props.qde.getQdeSectionDetails.data.pangstdetails &&
        this.props.qde.getQdeSectionDetails.data.pangstdetails.filePath)
    ) {
      this.props.verifyPanDetails({
        panNumber: panNo,
        employeeId: JSON.parse(localStorage.getItem("UserData"))
          ? JSON.parse(localStorage.getItem("UserData")).employeeId
          : "",
        employeeName: JSON.parse(localStorage.getItem("UserData"))
          ? JSON.parse(localStorage.getItem("UserData")).employeeName
          : "",
        dateOfBirth: dateOfbirth.format("DD/MM/YYYY"),
        panName,
        leadCode:
          (this.props.qde.getQdeSectionDetails &&
            this.props.qde.getQdeSectionDetails.data &&
            this.props.qde.getQdeSectionDetails.data.leadCode) ||
          "",
        customerType,
        applicantUniqueId: this.props.match.params.id,
      });
      if (
        customerType === "individual" &&
        occupationType === "selfemployed" &&
        documentType === "pan"
      ) {
        const getData = async () => {
          const response = await this.props.savePanGetGst({
            panNumber: panNo,
          });
          const data =
            (await response) && response.payload && response.payload.data;
          this.setState({ gstNumber: data });
          if (
            (response && response.payload && response.payload.error) === false
          ) {
            this.setState({ noGST: true });
          } else {
            this.setState({ noGST: false });
          }
        };
        getData();
      }
    } else {
      te("Please upload valid document");
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.qde.uploadedDocumentData.success !==
        this.props.qde.uploadedDocumentData.success &&
      !isEmpty(this.props.qde.uploadedDocumentData.success)
    ) {
      ts("File Uploaded Successfully");
      const { dateOfbirth, originalFile, panName, panNo } =
        this.props.qde.uploadedDocumentData.success;
      const documentType = this.form.getFieldValue("documentType");
      const customerType = this.form.getFieldValue("customerType");
      const occupationType = this.form.getFieldValue("occupationType");
      this.setState({ documenttype: documentType });
      this.setState({ occupationType });
      if (documentType === "pan") {
        this.form.setFieldsValue({
          dateOfbirth: moment(dateOfbirth, "DD/MM/YYYY"),
          panName,
          panNo,
        });
        if (
          this.props.qde.uploadedDocumentData &&
          this.props.qde.uploadedDocumentData.success &&
          this.props.qde.uploadedDocumentData.success.panNo &&
          panNo.toString().substr(3, 1).toLowerCase() !== "p" &&
          occupationType === "salaried"
        ) {
          this.form.setFields([
            {
              name: ["panNo"],
              errors: ["Invalid PAN for selected occupation type."],
            },
          ]);
        }
        if (
          this.props.qde.uploadedDocumentData &&
          this.props.qde.uploadedDocumentData.success &&
          this.props.qde.uploadedDocumentData.success.panNo &&
          panNo.toString().substr(3, 1).toLowerCase() !== "p" &&
          panNo.toString().substr(3, 1).toLowerCase() !== "c" &&
          occupationType === "selfemployed"
        ) {
          console.log("-->", panNo.toString().substr(3, 1));
          this.form.setFields([
            {
              name: ["panNo"],
              errors: ["Invalid PAN for selected occupation type."],
            },
          ]);
        }
      }
      this.setState({
        showWebCam: false,
        showUploadImage: true,
        document_upload_list: (await (originalFile.name.split(".").pop() ===
          "pdf"))
          ? await originalFile
          : await this.getBase64(originalFile),
        disablePanVerify: documentType === "form60" ? true : false,
      });
    }

    if (
      prevProps.qde.uploadedDocumentData.error !==
        this.props.qde.uploadedDocumentData.error &&
      !isEmpty(this.props.qde.uploadedDocumentData.error)
    ) {
      te(this.props.qde.uploadedDocumentData.error.message);
    }

    if (
      prevProps.qde.getQdeSectionDetails !==
        this.props.qde.getQdeSectionDetails &&
      !isEmpty(this.props.qde.getQdeSectionDetails)
    ) {
      if (
        this.props.qde.getQdeSectionDetails &&
        this.props.qde.getQdeSectionDetails.data &&
        this.props.qde.getQdeSectionDetails.data.pangstdetails
      ) {
        const { pangstdetails } = this.props.qde.getQdeSectionDetails.data;
        this.form.setFieldsValue({
          customerType: pangstdetails.customerType,
          dateOfbirth:
            pangstdetails.dateOfBirth &&
            moment(pangstdetails.dateOfBirth, "DD/MM/YYYY"),
          documentType: pangstdetails.documentType,
          occupationType: pangstdetails.occupationType,
          panName: pangstdetails.panName,
          panNo: pangstdetails.panNumber,
          gender: pangstdetails.gender,
          entity: pangstdetails.entity,
          gst: pangstdetails.gst,
        });
        this.setState({ gender: pangstdetails.gender });
        if (pangstdetails.entity || pangstdetails.gst) {
          this.setState({ showEntityType: true });
          this.setState({ noGST: true });
        } else {
          this.setState({ showEntityType: false });
          this.setState({ noGST: false });
        }
        let originalDoc =
          this.props.qde.getQdeSectionDetails.data.pangstdetails.filePath;
        let NewFilePath =
          originalDoc && originalDoc.replace("/var/www/html", BASE_URL);
        this.setState({
          showUploadImage: true,
          docEdit: true,
          document_upload_list: this.props.qde.getQdeSectionDetails.data
            .pangstdetails.filePath
            ? NewFilePath
            : null,
          disablePanVerify: !(pangstdetails.documentType === "pan"),
          disableEntity: !(
            pangstdetails.customerType === "non-individual" ||
            (pangstdetails.customerType === "individual" &&
              pangstdetails.occupationType === "selfemployed")
          ),
          disableOccupationType: !(pangstdetails.customerType === "individual"),
        });

        const { customerType, occupationType, panNumber, documentType } =
          this.props &&
          this.props.qde &&
          this.props.qde.getQdeSectionDetails &&
          this.props.qde.getQdeSectionDetails.data &&
          this.props.qde.getQdeSectionDetails.data.pangstdetails;

        if (
          customerType === "individual" &&
          occupationType === "selfemployed" &&
          documentType === "pan"
        ) {
          const getData = async () => {
            const response = await this.props.savePanGetGst({
              // panNumber: "AAPCA3085R",
              panNumber: panNumber,
            });
            const data =
              (await response) && response.payload && response.payload.data;
            this.setState({ gstNumber: data });
            if (
              (response && response.payload && response.payload.error) === false
            ) {
              this.setState({ noGST: true });
            } else {
              this.setState({ noGST: false });
            }
          };
          getData();
        }
      }
    }
  }

  changeStep = () => {
    const pangstdetails =
      this.props.qde &&
      this.props.qde.getQdeSectionDetails &&
      this.props.qde.getQdeSectionDetails.data &&
      this.props.qde.getQdeSectionDetails.data.pangstdetails;
    if (
      !isEmpty(pangstdetails) &&
      !isEmpty(pangstdetails.filePath) &&
      !isEmpty(pangstdetails.dateOfBirth) &&
      !isEmpty(pangstdetails.panName) &&
      !isEmpty(pangstdetails.panNumber)
    ) {
      this.props.changeStep(1);
    }
    if (
      this.props.journey === "applicant" &&
      !isEmpty(pangstdetails && pangstdetails.filePath) &&
      pangstdetails.documentType === "form60"
    ) {
      this.props.changeStep(1);
    }
    if (
      this.props.journey === "co-applicant" ||
      this.props.journey === "guarantor"
    ) {
      this.props.changeStep(1);
    }
  };

  redirectToLeadList = () => {
    this.props.history.push(
      `${public_url.leadLists}/${this.props.qde.getQdeSectionDetails.data.productId}`
    );
  };

  dateOfBirthValidator = (rule, value, callback) => {
    if (
      this.form.getFieldValue("occupationType") === "salaried" &&
      this.form.getFieldValue("documentType") === "pan"
    ) {
      if (value > moment().clone().subtract(18, "years")) {
        callback("Invalid Date of birth");
        return;
      }
      callback();
    } else {
      callback();
    }
  };

  disabledDate = (current) => {
    if (
      this.form &&
      this.form.getFieldValue("occupationType") === "selfemployed"
    ) {
      return current && current > moment().endOf("day");
    } else if (
      this.form &&
      this.form.getFieldValue("occupationType") === "salaried"
    ) {
      return current > moment().clone().subtract(18, "years");
    }
  };

  render() {
    const inputProps = {
      readOnly:
        this.state.disablePanVerify ||
        this.props.freezeCase ||
        this.props.freezeUser ||
        this.props.freezePan ||
        this.props.journey === "applicant"
          ? this.props.freezePan
          : this.props.journey === "co-applicant"
          ? this.props.freezeCoappPan
          : this.props.journey === "guarantor"
          ? this.props.freezeGuarPan
          : false,
      disabled:
        this.state.disablePanVerify ||
        this.props.freezeCase ||
        this.props.freezeUser ||
        this.props.freezePan ||
        this.props.journey === "applicant"
          ? this.props.freezePan
          : this.props.journey === "co-applicant"
          ? this.props.freezeCoappPan
          : this.props.journey === "guarantor"
          ? this.props.freezeGuarPan
          : false,
    };

    const entityDropdownList = [
      <option hidden> {} </option>,
      <option value={"Sole Proprietory Firm"}>
        {"Sole Proprietory Firm"}
      </option>,
      <option value={"Partnership Firm"}>{"Partnership Firm"}</option>,
    ];

    const uploadProps = {
      customRequest: this.props.uploadDocument,
      showUploadList: false,
      data: {
        panInfo: JSON.stringify({
          docType: this.form ? this.form.getFieldValue("documentType") : "pan",
          leadCode:
            (this.props.qde.getQdeSectionDetails &&
              this.props.qde.getQdeSectionDetails.data &&
              this.props.qde.getQdeSectionDetails.data.leadCode) ||
            "",
          mobileNumber:
            (this.props.qde.getQdeSectionDetails &&
              this.props.qde.getQdeSectionDetails.data &&
              this.props.qde.getQdeSectionDetails.data.customerMobile) ||
            "",
          applicantUniqueId: this.props.match.params.id,
        }),
      },
    };
    const pangstdetails = !isEmpty(this.props.qde.getQdeSectionDetails)
      ? this.props.qde.getQdeSectionDetails.data.pangstdetails
      : {};

    const documentType = this.form
      ? this.form.getFieldValue("documentType")
      : "pan";

    //upload pdf Icon for pdf
    let uploadIcon;
    if (this.state.docEdit) {
      if (
        this.state.document_upload_list &&
        this.state.document_upload_list.split(".").pop() === ("jpeg" || "jpg")
      ) {
        uploadIcon = this.state.document_upload_list;
      } else {
        uploadIcon = PdfIcon;
      }
    } else {
      if (this.state.document_upload_list !== null) {
        if (
          this.state.document_upload_list &&
          this.state.document_upload_list.name &&
          this.state.document_upload_list.name.split(".").pop() === "jpeg"
        ) {
          uploadIcon = this.state.document_upload_list;
        } else {
          uploadIcon = PdfIcon;
        }
      }
    }

    const customFormat = (value) => {
      return value.format("DD/MM/YYYY");
    };

    const getGstNumber = [
      <option hidden> {} </option>,
      ...map(this.state.gstNumber, (item) => {
        return <option value={item.gstinId}>{item.gstinId}</option>;
      }),
    ];

    console.log("document Type-->", this.props.freezePan);
    return (
      <div className={"pangstcontainer"}>
        <Card bordered={false}>
          <Form
            onValuesChange={this.formChange}
            onFinish={this.submitForm}
            onFinishFailed={this.finishFailed}
            ref={(e) => (this.form = e)}
          >
            <Row className={"typeRow"} gutter={40}>
              <Col lg={8}>
                <h5 className="headerLabel">Customer Type</h5>
                <Form.Item name={"customerType"} initialValue={"individual"}>
                  {this.props.freezeCase ||
                  this.props.freezeUser ||
                  this.props.freezePan ? (
                    <Radio.Group>
                      <Radio disabled value={"individual"}>
                        Individual
                      </Radio>
                      {/* <Radio value={"non-individual"}>Non Individual</Radio> */}
                    </Radio.Group>
                  ) : (
                    <Radio.Group>
                      <Radio value={"individual"}>Individual</Radio>
                      {/* <Radio value={"non-individual"}>Non Individual</Radio> */}
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <h5 className="headerLabel">Occupation Type</h5>
                <Form.Item
                  name={"occupationType"}
                  rules={[
                    {
                      required: !this.state.disableOccupationType,
                      message: "Ocupation Type is required",
                    },
                  ]}
                  initialValue={"salaried"}
                >
                  {this.props.freezeCase || this.props.freezeUser ? (
                    <Radio.Group disabled={this.state.disableOccupationType}>
                      <Radio disabled value={"salaried"}>
                        Salaried
                      </Radio>
                      <Radio disabled value={"selfemployed"}>
                        Self-Employed
                      </Radio>
                    </Radio.Group>
                  ) : (
                    <Radio.Group disabled={this.state.disableOccupationType}>
                      <Radio value={"salaried"}>Salaried</Radio>
                      <Radio value={"selfemployed"}>Self-Employed</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              {this.state.showEntityType && (
                <Col lg={8}>
                  <h5 className="headerLabel">Entity</h5>
                  <div className="entityContainer">
                    <div className={"mui-dropdown-wrapper"}>
                      <img
                        alt={"select"}
                        src={SelectIcon}
                        className="searchIcon"
                      />
                      <Form.Item
                        name={"entity"}
                        rules={[
                          {
                            required: true,
                            message: "Entity Type is required",
                          },
                        ]}
                      >
                        <TextField
                          id="entity"
                          select
                          fullWidth
                          disabled={
                            this.props.freezeCase ||
                            this.props.freezeUser ||
                            this.props.freezePan ||
                            this.props.journey === "applicant"
                              ? this.props.freezePan
                              : this.props.journey === "co-applicant"
                              ? this.props.freezeCoappPan
                              : this.props.journey === "guarantor"
                              ? this.props.freezeGuarPan
                              : false
                          }
                          onChange={(e) => {
                            this.form &&
                              this.form.setFieldsValue({
                                entity: e.target.value,
                              });
                          }}
                          SelectProps={{
                            native: true,
                          }}
                          InputLabelProps={{
                            shrink: this.form
                              ? this.form.getFieldValue("entity")
                              : false,
                          }}
                        >
                          <option hidden> {} </option>,
                          <option value={"Sole Proprietory Firm"}>
                            {"Sole Proprietory Firm"}
                          </option>
                          ,
                          <option value={"Partnership Firm"}>
                            {"Partnership Firm"}
                          </option>
                        </TextField>
                      </Form.Item>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
            <Row className={"documentRow"}>
              <Row>
                <Form.Item name={"documentType"} initialValue={"pan"}>
                  {this.props.freezeCase ||
                  this.props.freezeUser ||
                  this.props.freezePan ||
                  this.props.journey === "applicant" ? (
                    this.props.freezePan
                  ) : this.props.journey === "co-applicant" ? (
                    this.props.freezeCoappPan
                  ) : this.props.journey === "guarantor" ? (
                    this.props.freezeGuarPan
                  ) : false ? (
                    <Radio.Group>
                      <Radio disabled value={"pan"}>
                        Pan
                      </Radio>
                      <Radio disabled value={"form60"}>
                        Form 60
                      </Radio>
                    </Radio.Group>
                  ) : (
                    <Radio.Group>
                      <Radio value={"pan"}>Pan</Radio>
                      <Radio value={"form60"}>Form 60</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Col lg={8}>
                  {!(this.props.freezeCase ||
                  this.props.freezeUser ||
                  this.props.freezePan ||
                  this.props.journey === "applicant"
                    ? this.props.freezePan
                    : this.props.journey === "co-applicant"
                    ? this.props.freezeCoappPan
                    : this.props.journey === "guarantor"
                    ? this.props.freezeGuarPan
                    : false) && (
                    <Upload {...uploadProps} accept=".jpg , .jpeg , .png, .pdf">
                      {!this.state.document_upload_list && (
                        <React.Fragment>
                          <div style={{ display: "flex" }}>
                            <div className="uploadImage">
                              <PictureOutlined />
                            </div>
                            <span className="Upload-Photo">Upload Photo</span>
                          </div>
                        </React.Fragment>
                      )}
                    </Upload>
                  )}
                  {this.state.document_upload_list &&
                    this.state.showUploadImage && (
                      <div className={"uploadedImageWrapper"}>
                        {!(
                          this.props.freezeCase ||
                          this.props.freezeUser ||
                          this.props.freezePan
                        ) && <span onClick={this.deleteUpload}>X</span>}
                        <img
                          alt={"Uploaded Document"}
                          // src={uploadIcon}
                          src={this.state.document_upload_list}
                        />
                      </div>
                    )}
                </Col>
                <Col lg={8}>
                  {!this.state.document_upload_list &&
                    (this.state.showWebCam ? (
                      <React.Fragment>
                        {!(this.props.freezeCase ||
                        this.props.freezeUser ||
                        this.props.freezePan ||
                        this.props.journey === "applicant"
                          ? this.props.freezePan
                          : this.props.journey === "co-applicant"
                          ? this.props.freezeCoappPan
                          : this.props.journey === "guarantor"
                          ? this.props.freezeGuarPan
                          : false) && (
                          <CameraFeed
                            disabled
                            dimensions={{ height: 200, width: 300 }}
                            data={uploadProps.data}
                            uploadDocument={this.props.uploadDocument}
                          />
                        )}
                      </React.Fragment>
                    ) : (
                      <div onClick={() => this.setState({ showWebCam: true })}>
                        {!(this.props.freezeCase ||
                        this.props.freezeUser ||
                        this.props.freezePan ||
                        this.props.journey === "applicant"
                          ? this.props.freezePan
                          : this.props.journey === "co-applicant"
                          ? this.props.freezeCoappPan
                          : this.props.journey === "guarantor"
                          ? this.props.freezeGuarPan
                          : false) && (
                          <div style={{ display: "flex" }}>
                            <div className="takeaPhoto">
                              <CameraOutlined />
                            </div>
                            <span className="Upload-Photo">Take a Photo</span>
                          </div>
                        )}
                      </div>
                    ))}
                </Col>
                <Col lg={8}>
                  <Row style={{ display: "flex", justifyContent: "end" }}>
                    <Col lg={8}></Col>
                    <Col lg={8} className="verifiedRow">
                      {!(this.props.freezeCase ||
                      this.props.freezeUser ||
                      this.props.freezePan ||
                      this.props.journey === "applicant"
                        ? this.props.freezePan
                        : this.props.journey === "co-applicant"
                        ? this.props.freezeCoappPan
                        : this.props.journey === "guarantor"
                        ? this.props.freezeGuarPan
                        : false) && (
                        <Button
                          disabled={
                            this.props.qde.panVerified ||
                            this.state.disablePanVerify
                          }
                          className="save-button verifyButtonTheme"
                          onClick={this.verifyPanDetails}
                        >
                          {" "}
                          Verify{" "}
                        </Button>
                      )}
                      {this.props.qde.panVerified && (
                        <div className="verifiedTheme verifyButtonTheme">
                          <img src={Verified} alt={"Verified"} />
                          Verified
                        </div>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
            <Row className={"panDetailsRow"} gutter={30}>
              <Col lg={8}>
                <Form.Item
                  rules={[
                    {
                      pattern:
                        this.form &&
                        this.form.getFieldValue("occupationType") ===
                          "selfemployed" &&
                        this.form.getFieldValue("documentType") === "pan"
                          ? new RegExp(/^[A-Z]{3}[CcPp][A-Z][0-9]{4}[A-Z]$/)
                          : this.form &&
                            this.form.getFieldValue("occupationType") ===
                              "salaried" &&
                            this.form.getFieldValue("documentType") === "pan"
                          ? new RegExp(/^[A-Z]{3}[Pp][A-Z][0-9]{4}[A-Z]$/)
                          : new RegExp(/^[a-z A-Z ]*$/),
                      message:
                        (this.form &&
                          this.form.getFieldValue("occupationType") ===
                            "selfemployed" &&
                          this.form.getFieldValue("documentType") === "pan") ||
                        "salaried"
                          ? "Invalid PAN for selected occupation type."
                          : "Invalid PAN name",
                    },
                    {
                      required:
                        this.form &&
                        this.form.getFieldValue("documentType") === "pan"
                          ? true
                          : false,
                      message: "PAN number is mandatory",
                    },
                    {
                      max: 10,
                      message: "Length cannot exceed than 10 characters",
                    },
                  ]}
                  name={"panNo"}
                >
                  <TextField
                    disabled={documentType === "form60"}
                    inputProps={inputProps}
                    label={"Pan Number*"}
                    InputLabelProps={{
                      shrink: this.form
                        ? this.form.getFieldValue("panNo")
                        : false,
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .slice(0, 10)
                        .toUpperCase();
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <label
                  id={"date-picker-label"}
                  className={`MuiFormLabel-root MuiInputLabel-root ${
                    (this.form && this.form.getFieldValue("dateOfbirth")) ||
                    this.state.isSelected
                      ? "MuiInputLabel-animated MuiInputLabel-shrink"
                      : ""
                  } MuiInputLabel-formControl MuiInputLabel-animated`}
                  data-shrink="false"
                  for="panNo"
                >
                  {this.form &&
                  this.form.getFieldValue("customerType") === "individual" &&
                  this.form.getFieldValue("occupationType") === "selfemployed"
                    ? "Date of Incorporation*"
                    : "Date of Birth"}
                </label>
                <Form.Item
                  rules={[
                    {
                      validator: this.dateOfBirthValidator,
                    },
                  ]}
                  name={"dateOfbirth"}
                >
                  <DatePicker
                    inputReadOnly={true}
                    disabledDate={this.disabledDate}
                    disabled={
                      this.props.freezeCase ||
                      this.props.freezeUser ||
                      this.props.freezePan ||
                      this.props.journey === "applicant"
                        ? this.props.freezePan
                        : this.props.journey === "co-applicant"
                        ? this.props.freezeCoappPan
                        : this.props.journey === "guarantor"
                        ? this.props.freezeGuarPan
                        : false
                    }
                    format={customFormat}
                    placeholder={""}
                    onChange={this.handleChangeDate}
                    labelId={"date-picker-label"}
                    bordered={false}
                    className={
                      "MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                    }
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"panName"}
                  rules={[
                    {
                      pattern: new RegExp(/^[a-z A-Z ]*$/),
                      message: "Invalid PAN name",
                    },
                    {
                      max: 50,
                      message: "Length cannot exceed than 50 characters",
                    },
                    {
                      required: true,
                      message: "Name is mandatory",
                    },
                  ]}
                >
                  <TextField
                    inputProps={{
                      readOnly:
                        this.props.freezeCase ||
                        this.props.freezeUser ||
                        this.props.freezePan ||
                        this.props.journey === "applicant"
                          ? this.props.freezePan
                          : this.props.journey === "co-applicant"
                          ? this.props.freezeCoappPan
                          : this.props.journey === "guarantor"
                          ? this.props.freezeGuarPan
                          : false,
                      disabled:
                        this.props.freezeCase ||
                        this.props.freezeUser ||
                        this.props.freezePan ||
                        this.props.journey === "applicant"
                          ? this.props.freezePan
                          : this.props.journey === "co-applicant"
                          ? this.props.freezeCoappPan
                          : this.props.journey === "guarantor"
                          ? this.props.freezeGuarPan
                          : false,
                    }}
                    multiline
                    label="Name*"
                    InputLabelProps={{
                      shrink: this.form
                        ? this.form.getFieldValue("panName")
                        : false,
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .toString()
                        .match(/^[a-zA-Z ]*$/)
                        ? e.target.value.toString().slice(0, 50)
                        : e.target.value
                            .toString()
                            .slice(0, e.target.value.length - 1);
                    }}
                  />
                </Form.Item>
              </Col>
              {this.form &&
                this.form.getFieldValue("occupationType") === "salaried" && (
                  <Col lg={8}>
                    <div className={"mui-dropdown-wrapper"}>
                      <img
                        alt={"select"}
                        src={SelectIcon}
                        className="searchIcon"
                      />
                      <Form.Item
                        name={"gender"}
                        rules={[
                          {
                            required: true,
                            message: "Gender is mandatory",
                          },
                        ]}
                      >
                        <TextField
                          inputProps={{
                            readOnly:
                              this.props.freezeCase ||
                              this.props.freezeUser ||
                              this.props.freezePan ||
                              this.props.journey === "applicant"
                                ? this.props.freezePan
                                : this.props.journey === "co-applicant"
                                ? this.props.freezeCoappPan
                                : this.props.journey === "guarantor"
                                ? this.props.freezeGuarPan
                                : false,
                            disabled:
                              this.props.freezeCase ||
                              this.props.freezeUser ||
                              this.props.freezePan ||
                              this.props.journey === "applicant"
                                ? this.props.freezePan
                                : this.props.journey === "co-applicant"
                                ? this.props.freezeCoappPan
                                : this.props.journey === "guarantor"
                                ? this.props.freezeGuarPan
                                : false,
                          }}
                          label="Gender*"
                          id="gender"
                          select
                          fullWidth
                          InputLabelProps={{
                            shrink: this.form
                              ? this.form.getFieldValue("gender")
                              : false,
                          }}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option hidden></option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                        </TextField>
                      </Form.Item>
                    </div>
                  </Col>
                )}
            </Row>

            {this.state.showEntityType &&
              this.props.qde.panVerified &&
              this.state.noGST && (
                <Row className={"gstRow"} gutter={30}>
                  <Col lg={8}>
                    <div className={"mui-dropdown-wrapper"}>
                      <img
                        alt={"select"}
                        src={SelectIcon}
                        className="searchIcon"
                      />
                      <Form.Item
                        name="gst"
                        rules={[
                          {
                            required: true,
                            message: "GST number is mandatory",
                          },
                        ]}
                      >
                        <TextField
                          inputProps={{
                            readOnly:
                              this.props.freezeCase ||
                              this.props.freezeUser ||
                              this.props.freezePan ||
                              this.props.journey === "applicant"
                                ? this.props.freezePan
                                : this.props.journey === "co-applicant"
                                ? this.props.freezeCoappPan
                                : this.props.journey === "guarantor"
                                ? this.props.freezeGuarPan
                                : false,
                            disabled:
                              this.props.freezeCase ||
                              this.props.freezeUser ||
                              this.props.freezePan ||
                              this.props.journey === "applicant"
                                ? this.props.freezePan
                                : this.props.journey === "co-applicant"
                                ? this.props.freezeCoappPan
                                : this.props.journey === "guarantor"
                                ? this.props.freezeGuarPan
                                : false,
                          }}
                          label="GST"
                          id="gst"
                          select
                          fullWidth
                          InputLabelProps={{
                            shrink: this.form
                              ? this.form.getFieldValue("gst")
                              : false,
                          }}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          {getGstNumber}
                        </TextField>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              )}
            <Row className={"buttonRow"}>
              <div>
                <Form.Item>
                  <Button
                    className="save-button"
                    onClick={() => {
                      this.props.history.push(
                        `${public_url.loanSummary}/${
                          this.props.qde.getQdeSectionDetails &&
                          this.props.qde.getQdeSectionDetails.data &&
                          this.props.qde.getQdeSectionDetails.data.id
                        }`
                      );
                    }}
                    disabled={
                      (this.props.journey === "applicant" &&
                        this.props.qde.getQdeSectionDetails &&
                        this.props.qde.getQdeSectionDetails.data &&
                        !this.props.qde.getQdeSectionDetails.data
                          .pangstdetails) ||
                      this.props.qde.resetData === true
                    }
                  >
                    Loan Summary
                  </Button>{" "}
                  &nbsp;
                  <button
                    className="cancle-button mr-2"
                    onClick={this.redirectToLeadList}
                  >
                    Cancel
                  </button>
                  {this.props.qde.panVerified &&
                    !(this.props.freezeCase ||
                    this.props.freezeUser ||
                    this.props.freezePan ||
                    this.props.journey === "applicant"
                      ? this.props.freezePan
                      : this.props.journey === "co-applicant"
                      ? this.props.freezeCoappPan
                      : this.props.journey === "guarantor"
                      ? this.props.freezeGuarPan
                      : false) && (
                      <button
                        className="cancle-button mr-2"
                        onClick={this.deleteUpload}
                      >
                        Reset
                      </button>
                    )}
                  {!(this.props.freezeCase ||
                  this.props.freezeUser ||
                  this.props.journey === "applicant"
                    ? this.props.freezePan
                    : this.props.journey === "co-applicant"
                    ? this.props.freezeCoappPan
                    : this.props.journey === "guarantor"
                    ? this.props.freezeGuarPan
                    : false) && (
                    <Button className="save-button mr-2" htmlType={"submit"}>
                      Save
                    </Button>
                  )}
                  {this.props.journey === "applicant" && (
                    <Button
                      className="save-button"
                      onClick={this.changeStep}
                      disabled={
                        (this.props.journey === "applicant" &&
                          this.props.qde.getQdeSectionDetails &&
                          this.props.qde.getQdeSectionDetails.data &&
                          !this.props.qde.getQdeSectionDetails.data
                            .pangstdetails) ||
                        this.props.qde.resetData === true ||
                        (this.state.showEntityType &&
                        this.props.qde.panVerified &&
                        this.state.noGST
                          ? !this?.props?.qde?.getQdeSectionDetails?.data
                              ?.pangstdetails?.gst
                          : false) ||
                        (documentType === "pan"
                          ? !this.props.qde.panVerified
                          : false)
                      }
                    >
                      Next
                    </Button>
                  )}
                  {(this.props.journey === "co-applicant" ||
                    this.props.journey === "guarantor") && (
                    <Button
                      className="save-button"
                      onClick={() => {
                        this.props.changeStep(1);
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Form.Item>
              </div>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    qde: state.qde,
  };
};

const mapDispatchToProps = {
  getQdeEntityList,
  uploadDocument,
  verifyPanDetails,
  savePanGetGst,
  savePanGst,
  resetUploadedPan,
  deleteDocuments,
  getQdeDetail,
};

export default connect(mapStateToProps, mapDispatchToProps)(pangstverify);
