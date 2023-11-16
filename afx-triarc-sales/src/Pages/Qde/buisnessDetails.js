import React from "react";
import { connect } from "react-redux";
import {
  saveUpdateBusinessDetailsService,
  getBankAccountTypeList,
  createCustomer,
} from "../../Redux/Services/Qde";
import { Form, Button } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Row, Col, Checkbox } from "antd";
import { useEffect } from "react";
import {
  fetchSectors,
  fetchIndustries,
  fetchSubIndustries,
  fetchSegments,
  // uploadSelfie,
} from "../../Utility/Services/businessDetails";
import { uploadSelfieFB } from "../../Redux/Services/Qde";
import { getBusinessDetails } from "../../Utility/Services/businessDetails";
import { getIfscDetails } from "../../Utility/Services/PersonalDetails";
import {
  getPennyDetails,
  deleteUploadedSelfieFB,
  getQdeDetail,
} from "../../Redux/Services/Qde";
import { te, ti } from "../../Utility/ReduxToaster";
import SelectIcon from "../../assets/Images/select.svg";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import BusinessDetailsDropdown from "./BusinessDetailsDropdown";
import { map } from "lodash";
import _ from "lodash";
import "./style.scss";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import Verified from "../../assets/Images/verified.svg";
import { CameraFB } from "./CameraFB";
import { CameraOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../Utility/Config";

const BuisnessDetails = (props) => {
  // const classes = useStyles();
  const [form] = Form.useForm();

  const [valueID, setValueID] = React.useState(null);
  const [valueSector, setValueSector] = React.useState(null);
  const [sectorFlag, setSectorFlag] = React.useState(false);
  const [valueIndustry, setValueIndustry] = React.useState(null);
  const [industryFlag, setIndustryFlag] = React.useState(false);

  const [valueSubIndustry, setValueSubIndustry] = React.useState(null);
  const [subIndustryFlag, setSubIndustryFlag] = React.useState(false);
  const [valueSegment, setValueSegment] = React.useState(null);
  const [segmentFlag, setSegmentFlag] = React.useState(false);

  const [valueIfscCode, setValueIfscCode] = React.useState(null);
  const [valueBankName, setValueBankName] = React.useState(null);
  const [valueNetworth, setValueNetworth] = React.useState(null);
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [sectorList, setSectorList] = React.useState([]);
  const [sectorListName, setSectorListName] = React.useState([]);
  const [industryList, setIndustryList] = React.useState([]);
  const [industryListName, setIndustryListName] = React.useState([]);
  const [subindustryList, setSubIndustryList] = React.useState([]);
  const [subindustryListName, setSubIndustryListName] = React.useState([]);
  const [segmentList, setSegmentList] = React.useState([]);
  const [segmentListName, setSegmentListName] = React.useState([]);
  const [isSelected, setIsSelected] = React.useState(true);
  const [subIndustryClear, setSubIndustryClear] = React.useState(false);

  const [isSaved, setIsSaved] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [bankType, setBankType] = React.useState([]);
  const [bankDisable, setBankDisable] = React.useState(false);
  const [bankTypeData, setBankTypeData] = React.useState("");
  const [monthInc, setMonthInc] = React.useState("");
  // penny Drop
  const [showPenny, setShowPenny] = React.useState(false);
  const [allowPenny, setAllowPenny] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  // camera feed
  const [showWebCam, setShowWebCam] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [showUploadImage, setShowUploadImage] = React.useState(false);

  let history = useHistory();

  const useStyles = makeStyles((theme) => ({
    popupIndicator: {
      "& span": {
        "& svg": {
          "& path": {
            d: "path('M20 20L0 40')",
            stroke: "#fff",
          },
        },
      },
    },
  }));

  useEffect(() => {
    if (props.qde.customerCreateSuccess) {
      if (props.qde.customerCreateSuccess) {
        const { customerCreation, bureauPull, BRE } = props.qde.customerData;
        if (!customerCreation || !bureauPull) {
          ti("Something went wrong. Please try again");
          return;
        }
        if (BRE === "" || BRE === "System Rejected") {
          te("Loan case moved to Credit Module with BRE decision as Rejected");
          const { loanId } = props.qde.getQdeSectionDetails.data;
          props.history.push(`/loan-summary/${loanId}`);
          return;
        }
        // Approved / Rejected / Pending Approval
        if (BRE === "System Approved" || BRE === "Manual Underwriting") {
          const { journey, id } = props.match.params;
          if (props.qde.getQdeSectionDetails.data.scheme) {
            const { scheme } = props.qde.getQdeSectionDetails.data.scheme;
            if (scheme === "Income Proof") {
              props.history.push(`/${journey}${public_url.dde}/add/${id}`);
              return;
            }
          }
          props.history.push(
            `/${journey}${public_url.qde}${public_url.loanOffer}/success/${id}`
          );
        }
      }
    }
  });

  useEffect(() => {
    (async () => {
      setBankType(await getBankAccountTypeList());
    })();
  }, []);

  const getBankAccountTypeListDDL = [
    <option hidden> {} </option>,
    ...map(bankType, (item) => {
      return (
        <option value={item.bankAccountType}>{item.bankAccountType}</option>
      );
    }),
  ];

  useEffect(() => {
    const getData = async () => {
      const leadCode = props.leadCode;
      console.log("11111111111111")
      const response = await getBusinessDetails({
        lead_code: leadCode,
        applicant_uniqueid: props.match.params.id,
      });

      const data =
        (await response) &&
        response.data?.data?.businessdetails?.bankAccountType;
      setBankTypeData(data);
      const monthlyInc =
        (await response) && response.data?.data?.businessdetails?.monthlyIncome;
      setMonthInc(monthlyInc);
    };
  }, [
    bankTypeData,
    form,
    monthInc,
    props.leadCode,
    props.match.params.id,
    props.qde,
    setBankTypeData,
  ]);

  useEffect(() => {
    (async () => {
      try {
        console.log("2222222222222")
        const leadCode = props.leadCode;
        const response = await getBusinessDetails({
          lead_code: leadCode,
          applicant_uniqueid: props.match.params.id,
        }).then((re) => {
          return re;
        });

        if (!response.data.error) {
          // setBusinessDetails(response.data.data.businessdetails);
          setValueID(response.data.data.businessdetails.id);
          setValueIndustry(response.data.data.businessdetails.industry);
          setValueSector(response.data.data.businessdetails.sector);
          setValueSubIndustry(response.data.data.businessdetails.subindustry);
          setValueSegment(response.data.data.businessdetails.segment);
          setValueNetworth(response.data.data.businessdetails.networth);
          
          
          // set Business Selfie
          if (response.data.data.businessdetails.filePath) {
            let originalDoc = response.data.data.businessdetails.filePath
            //      this.props.qde.getQdeSectionDetails.data &&
            //      this.props.qde.getQdeSectionDetails.data.personalDetails &&
            //      this.props.qde.getQdeSectionDetails.data.personalDetails.filePath;
            let NewFilePath =
              originalDoc && originalDoc.replace("/var/www/html", BASE_URL);
            if (!file) {
              //  this.setState({
              //    showUploadImage: true,
              //    file: originalDoc ? NewFilePath : null,
              //  });
              setShowUploadImage(true)
              setFile(originalDoc ? NewFilePath : null);
            }
          }
          form &&
            form.setFieldsValue({
              bankAccountType:
                response.data.data.businessdetails.bankAccountType,
            });
          form &&
            form.setFieldsValue({
              accountHolderName:
                response.data.data.businessdetails.accountHolderName,
            });
          console.log(
            "response.data.data.businessdetails.accountHolderName",
            response.data.data.businessdetails.accountHolderName
          );
          const accountHolderName = await response.data.data.businessdetails
            .accountHolderName;
          if (accountHolderName) {
            console.log("eeeeeeeee");
            setShowPenny(true);
            setAllowPenny(true);
          }
          if (response.data.data.businessdetails.verified) {
            setVerified(response.data.data.businessdetails.verified);
          }
          form &&
            form.setFieldsValue({
              monthlyIncome: response.data.data.businessdetails.monthlyIncome,
            });
          
          form &&
            form.setFieldsValue({
              accountNumber: response.data.data.businessdetails.accountNumber,
            });
          setValueIfscCode(response.data.data.businessdetails.ifscCode);
          setValueBankName(response.data.data.businessdetails.bankName);
          setChecked(response.data.data.businessdetails.isItCompanyBankAccount);
          setIsUpdated(true);
        } else if (response.data.error) {
          console.log(response.data.message);
        }
      } catch (error) {
        te("Something went wrong");
        console.log(error, "ERROR");
      }
    })();
  }, [form, props.leadCode, props.match.params.id]);

  useEffect(() => {
    (async () => {
      if (isSaved) {
        try {
          console.log("33333333333333333")
          const leadCode = props.leadCode;
          const response = await getBusinessDetails({
            lead_code: leadCode,
            applicant_uniqueid: props.match.params.id,
          }).then((re) => {
            return re;
          });

          if (!response.data.error) {
            // setBusinessDetails(response.data.data.businessdetails);
            setValueID(response.data.data.businessdetails.id);
            setValueIndustry(response.data.data.businessdetails.industry);
            setValueSector(response.data.data.businessdetails.sector);
            setValueSubIndustry(response.data.data.businessdetails.subindustry);
            setValueSegment(response.data.data.businessdetails.segment);
            setValueNetworth(response.data.data.businessdetails.networth);

            form &&
              form.setFieldsValue({
                accountHolderName:
                  response.data.data.businessdetails.accountHolderName,
              });
            
            setVerified(response.data.data.businessdetails.verified);
            if (response.data.data.businessdetails.accountHolderName) {
              setShowPenny(true);
              setAllowPenny(true);
            }
            if (response.data.data.businessdetails.verified) {
              setVerified(response.data.data.businessdetails.verified);
            }
            form &&
              form.setFieldsValue({
                bankAccountType:
                  response.data.data.businessdetails.bankAccountType,
              });
            form &&
              form.setFieldsValue({
                monthlyIncome: response.data.data.businessdetails.monthlyIncome,
              });
           
            form &&
              form.setFieldsValue({
                accountNumber: response.data.data.businessdetails.accountNumber,
              });
            setValueIfscCode(response.data.data.businessdetails.ifscCode);
            setValueBankName(response.data.data.businessdetails.bankName);
            setChecked(
              response.data.data.businessdetails.isItCompanyBankAccount
            );
            setIsSaved(false);
          } else if (response.data.error) {
            console.log(response.data.message);
          }
        } catch (error) {
          console.log(error, "ERROR");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaved, props.leadCode, props.match.params.id]);

  const fetchSectorDetails = async () => {
    fetchSectors().then((res) => {
      if (res.data) {
        if (!res.data.error) {
          setSectorList(res.data.data);
        }
      }
    });
  };

  const fetchSectorCode = async (e, value) => {
    if (value) {
      if (value !== valueSector) {
        setValueSubIndustry(null);
        setSubIndustryClear(true);
      }
      setValueSector(value);

      // ? ---------[logic to get sector_code matching sector_name]------------->
      let obj = sectorList.find((o) => o.sectorName === value);

      if (obj.sector_code) {
        fetchSubndustriesDetails(obj.sector_code);
      }
    }
  };

  const fetchSubndustriesDetails = (sectorcode) => {
    fetchSubIndustries(sectorcode).then((res) => {
      if (res.data) {
        if (!res.data.error) {
          setIsSelected(false);
          setSubIndustryList(res.data.data);
        }
      }
    });
  };

  const fetchIndustriesDetails = async () => {
    fetchIndustries().then((res) => {
      if (res.data) {
        if (!res.data.error) {
          setIndustryList(res.data.data);
        }
      }
    });
  };

  const fetchSegmentsDetails = async () => {
    fetchSegments().then((res) => {
      if (res.data) {
        if (!res.data.error) {
          setSegmentList(res.data.data);
        }
      }
    });
  };

  const redirectToLeadList = () => {
    history.push(
      `${public_url.leadLists}/${props.qde.getQdeSectionDetails.data.productId}`
    );
  };

  const handleChangeStep = () => {
    if (props.match.params.journey === "applicant") {
      props.changeStep(3);
    } else {
      props.createCustomer({
        applicant_uniqueid: props.match.params.id,
        isguarantor: props.match.params.journey === "guarantor",
        ismainapplicant: props.match.params.journey === "applicant",
      });
    }
  };

  const random = () => {};
  //*---------------[set Flag]-----------------------/-->
  useEffect(() => {
    if (valueSegment !== null && isUpdated) {
      setSegmentFlag(true);
    }
  }, [isUpdated, valueSegment]);
  // ----------------
  useEffect(() => {
    if (valueIndustry !== null && isUpdated) {
      setIndustryFlag(true);
    }
  }, [isUpdated, valueIndustry]);
  // -----------------
  useEffect(() => {
    if (valueSubIndustry !== null && isUpdated) {
      setSubIndustryFlag(true);
    }
  }, [isUpdated, subIndustryClear, valueSubIndustry]);

  useEffect(() => {
    if (valueSector !== null && isUpdated) {
      setSectorFlag(true);
    }
  }, [isUpdated, valueSector]);

  useEffect(() => {
    fetchSectorDetails();
    fetchIndustriesDetails();
    fetchSegmentsDetails();
  }, []);

  //logic to Extract and Send sector_code
  useEffect(() => {
    (async () => {
      if (isUpdated) {
        // logic to get sector_code matching sector_name
        let obj = await sectorList.find((o) => o.sectorName === valueSector);

        if (obj) {
          fetchSubndustriesDetails(obj.sector_code);
        }
      }
    })();
  }, [isUpdated, sectorList, valueSector]);

  //!logic to convert array of obj to array

  useEffect(() => {
    if (sectorList) {
      let resultt = sectorList.map((a) => a.sectorName);

      setSectorListName(resultt);
    }
  }, [sectorList]);

  useEffect(() => {
    if (industryList) {
      let resultt = industryList.map((a) => a.industryDesc);

      setIndustryListName(resultt);
    }
  }, [industryList]);

  useEffect(() => {
    if (segmentList) {
      let resultt = segmentList.map((a) => a.segmentcode);
      setSegmentListName(resultt);
    }
  }, [segmentList]);

  useEffect(() => {
    if (subindustryList) {
      let resultt = subindustryList.map((a) => a.subindustryDesc);

      setSubIndustryListName(resultt);
    }
  }, [subindustryList]);



  const handleFormChange = (changedFields, allFields) => {

      if (changedFields.file) {
       
        setShowUploadImage(true)
        setFile(getBase64(changedFields.file.file));
      }
    if (changedFields.sector) {
      setValueSector(changedFields.sector);
    }
    if (changedFields.industry) {
      setValueIndustry(changedFields.industry);
    }
    if (changedFields.segment) {
      setValueSegment(changedFields.segment);
    }
    if (allFields.bankAccountType) {
      console.log("allFields.bankAccountType", allFields.bankAccountType);
      form &&
        form.setFieldsValue({ bankAccountType: allFields.bankAccountType });
    }

    if (changedFields.ifscCode || changedFields.accountNumber) {
      setAllowPenny(false);
      setShowPenny(true);
      // setVerified(false);
    }
    if (changedFields.ifscCode && changedFields.ifscCode.length === 11) {
      (async () => {
        if (changedFields.ifscCode.length === 11) {
          const response = await getIfscDetails({
            ifsc: changedFields.ifscCode,
          });
          setValueBankName(response.bank);
          if (!response) {
            form && form.setFieldsValue({ bankName: "" });
          }
          if (response && response.bank) {
            form && form.setFieldsValue({ bankName: response.bank });
            setBankDisable(true);
          }
        }
      })();
    }
  };

  const handlePennyDrop = () => {
    // setAllowPenny(true);
    props.getPennyDetails({
      applicantUniqueId: props.match.params.id,
      accountNumber: form && form.getFieldValue("accountNumber"),
      ifscNumber: valueIfscCode,
      type: "business",
    });
  };

  React.useEffect(() => {
    form &&
      form.setFieldsValue({
        accountHolderName: props.qde?.pennyDropDetails?.accountHolderName,
      });
    if (props.qde.pennySuccess) {
      // this.setState({ verified: true });
      setAllowPenny(true);
      setVerified(true);
    }
  }, [
    props.qde.pennySuccess,
    allowPenny,
    form,
    props.qde.pennyDropDetails.accountHolderName,
  ]);

  // !---------------[onFinish]------------------------>
  const onFinish = (values) => {
    const { journey } = props;
    const applicant_uniqueid = props.match.params.id;
    const data = {
      id: valueID,
      applicant_uniqueid,
      sector: valueSector,
      industry: valueIndustry,
      subindustry: valueSubIndustry,
      segment: valueSegment,
      networth: valueNetworth,
      monthlyIncome: values.monthlyIncome,
      ismainapplicant: journey === "applicant",
      isguarantor: journey === "guarantor",
      isItCompanyBankAccount: checked,
      bankAccountType: values.bankAccountType,
      accountNumber: form.getFieldValue("accountNumber"),
      ifscCode: valueIfscCode,
      bankName: valueBankName,
      accountHolderName: form.getFieldValue("accountHolderName"),
      verified: verified,
      filePath: props?.qde?.uploadSelfieFB?.filePath
      // ...values
    };
    props.saveUpdateBusinessDetailsService(data);
    setTimeout(() => {
      setIsSaved(true);
    }, 2000);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failedd........:", errorInfo);
    te(errorInfo);
  };

  const onChangeCheckbox = (e) => {
    setChecked(e.target.checked);
  };

  function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        thousandsGroupStyle="lakh"
        isNumericString
        prefix="&#8377;"
      />
    );
  }

    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

  // for deleting selfie
    const deleteUploadedFunctn = (e) => {

      // setting to initail values upload states
      setFile(null)
      setShowUploadImage(false)
       props.deleteUploadedSelfieFB(
        {
          applicant_uniqueid: props.match.params.id,
        },
        true
      );
      props.getQdeDetail({
        applicant_uniqueid: props.match.params.id,
        ismainapplicant: props.match.params.journey === "applicant",
        isguarantor: props.match.params.journey === "guarantor",
      });
    };

  const inputProps = {
    readOnly: props.freezeCase || props.freezeUser,
    disabled: props.freezeCase || props.freezeUser,
  };

  const uploadProps = {
    customRequest: props.uploadSelfieFB,
    businessInfo: JSON.stringify({
      applicant_uniqueid: props.match.params.id,
      ismainapplicant: props.match.params.journey === "applicant",
      isguarantor: props.match.params.journey === "guarantor",
    }),
  };

  const classes = useStyles();
  return (
    <div className="business">
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={handleFormChange}
        form={form}>
        <div className="Business-container" style={{ padding: 40 }}>
          <br />
          <br />
          <Row>
            {file && showUploadImage && (
              <div className={"uploadedImageWrapperBusiness"}>
                {!(props.freezeCase || props.freezeUser) && (
                  <span
                    onClick={deleteUploadedFunctn}
                    className="personalCrossIcon">
                    X
                  </span>
                )}
                <img alt={"Uploaded Document"} src={file} />
              </div>
            )}
            <Col span={24}>
              {!file &&
                (showWebCam ? (
                  <React.Fragment>
                    {!(props.freezeCase || props.freezeUser) && (
                      <CameraFB
                        disabled
                        dimensions={{ height: 200, width: 300 }}
                        data={uploadProps.businessInfo}
                        uploadDocument={props.uploadSelfieFB}
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <div onClick={() => setShowWebCam({ showWebCam: true })}>
                    {!(props.freezeCase || props.freezeUser) && (
                      <div className="displayFlex">
                        <span className="Upload-Photo">Upload Selfie</span>
                        <div className="wrapperBusiness">
                          <div className="takeaPhoto">
                            <CameraOutlined />
                          </div>
                        </div>
                        <span className="Upload-Photo">Take a Photo</span>
                      </div>
                    )}
                  </div>
                ))}
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              <Form.Item name="sector">
                <Autocomplete
                  disabled={props.freezeCase || props.freezeUser}
                  classes={{
                    popupIndicator: classes.popupIndicator,
                  }}
                  key={sectorFlag}
                  disableClearable
                  id="sector"
                  onClick={() => {
                    !isUpdated ? setSectorFlag(true) : random();
                  }}
                  filterSelectedOptions
                  defaultValue={valueSector}
                  options={sectorList.length > 0 ? sectorListName : []}
                  getOptionSelected={(option, value) => option === value}
                  getOptionLabel={(option) => option}
                  onChange={fetchSectorCode}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            <InputAdornment position="end">
                              <IconButton className="btnDropdownCommonArrow">
                                <img
                                  alt="select-Icon"
                                  src={SelectIcon}
                                  className="searchIcon"
                                />
                              </IconButton>
                            </InputAdornment>
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      label="Sector"
                      margin="normal"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              {/* {valueIndustry} */}
              <Form.Item name="industry">
                <Autocomplete
                  disabled={props.freezeCase || props.freezeUser}
                  classes={{
                    popupIndicator: classes.popupIndicator,
                  }}
                  key={industryFlag}
                  onClick={() => {
                    !isUpdated ? setIndustryFlag(true) : random();
                  }}
                  // forcePopupIcon={false}
                  disableClearable
                  id="industry"
                  onChange={(event, newValue) => {
                    setValueIndustry(newValue);
                  }}
                  options={industryListName.length > 0 ? industryListName : []}
                  getOptionSelected={(option, value) => option === value}
                  getOptionLabel={(option) => option}
                  defaultValue={valueIndustry}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      // inputProps={inputProps}
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            <InputAdornment position="end">
                              <IconButton className="btnDropdownCommonArrow">
                                <img
                                  alt="select-Icon"
                                  src={SelectIcon}
                                  className="searchIcon"
                                />
                              </IconButton>
                            </InputAdornment>
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      value={valueIndustry}
                      label={"Industry"}
                      margin="normal"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="subindustry">
                <BusinessDetailsDropdown
                  freezeCase={props.freezeCase}
                  freezeUser={props.freezeUser}
                  valueSubIndustry={valueSubIndustry}
                  isSelected={isSelected}
                  setValueSubIndustry={setValueSubIndustry}
                  subindustryListName={subindustryListName}
                  subIndustryClear={subIndustryClear}
                  subIndustryFlag={subIndustryFlag}
                  valueSector={valueSector}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              <Form.Item name="segment">
                <Autocomplete
                  disabled={props.freezeCase || props.freezeUser}
                  classes={{
                    popupIndicator: classes.popupIndicator,
                  }}
                  key={segmentFlag}
                  // forcePopupIcon={false}
                  disableClearable
                  onClick={() => {
                    !isUpdated ? setSegmentFlag(true) : random();
                  }}
                  options={segmentListName.length > 0 ? segmentListName : []}
                  defaultValue={valueSegment}
                  filterSelectedOptions
                  getOptionLabel={(segmentListName) => segmentListName}
                  onChange={(event, value) => {
                    setValueSegment(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      inputProps={inputProps}
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            <InputAdornment position="end">
                              <IconButton className="btnDropdownCommonArrow">
                                <img
                                  alt="select-Icon"
                                  src={SelectIcon}
                                  className="searchIcon"
                                />
                              </IconButton>
                            </InputAdornment>
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      label="Segment"
                      margin="normal"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginTop: 15 }}>
              <Form.Item
                name="monthlyIncome"
                rules={[
                  {
                    pattern: new RegExp(/^[0-9]*$/),
                    message: "Invalid Monthly Icome",
                  },
                ]}>
                {/* {valueMonthlyIncome} */}
                <TextField
                  inputProps={inputProps}
                  // key={valueMonthlyIncome}
                  // defaultValue={valueMonthlyIncome}
                  id="monthlyIncome"
                  label="Monthly Income"
                  fullWidth
                  name="numberformat"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={24} className="mb-3">
              <Checkbox
                disabled={true}
                style={{ color: "#fff !important" }}
                onChange={onChangeCheckbox}
                checked={checked}></Checkbox>
              <span className="sub-title">
                &nbsp;Is it a Company Bank Account?
              </span>
            </Col>
          </Row>

          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col lg={8} style={{ paddingTop: "2%" }}>
              <div className={"mui-dropdown-wrapper"}>
                <img alt={"select"} src={SelectIcon} className="searchIcon" />
                <Form.Item
                  name="bankAccountType"
                  rules={[
                    {
                      required: true,
                      message: "Bank Account Type is mandatory",
                    },
                  ]}>
                  <TextField
                    disabled={verified}
                    inputProps={inputProps}
                    InputLabelProps={{
                      shrink: form
                        ? form.getFieldValue("bankAccountType")
                        : true,
                    }}
                    key={Math.random()}
                    select
                    style={{
                      pointerEvents: verified ? "none" : "initial",
                    }}
                    label="Account Type*"
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}>
                    {getBankAccountTypeListDDL}
                  </TextField>
                </Form.Item>
              </div>
            </Col>
            <Col span={8} style={{ marginTop: 15 }}>
              <Form.Item
                name="accountNumber"
                rules={[
                  {
                    required: true,
                    message: "Account Number is mandatory",
                  },
                  {
                    pattern: new RegExp(/[0-9]{8,}/),
                    message: "Invalid Account Number",
                  },
                ]}>
                {/* {valueAccountNumber} */}
                <TextField
                  disabled={verified}
                  inputProps={inputProps}
                  style={{
                    pointerEvents: verified ? "none" : "initial",
                  }}
                  // key={valueAccountNumber}
                  // defaultValue={valueAccountNumber}
                  id="accountNumber"
                  label="Account Number*"
                  fullWidth
                  // onBlur={(e) => setValueAccountNumber(e.target.value)}
                  type="number"
                  // onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                  onKeyDown={(e) =>
                    (e.keyCode === 69 || e.keyCode === 190) &&
                    e.preventDefault()
                  }
                  // onInput={(e) => {
                  //   e.target.value = e.target.value
                  //     ? Math.max(0, parseInt(e.target.value))
                  //         .toString()
                  //         .slice(0, 18)
                  //     : "";
                  // }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginTop: 15 }}>
              <Form.Item
                name="ifscCode"
                rules={[
                  {
                    required: valueIfscCode ? false : true,
                    message: "IFSC code is mandatory",
                  },
                  {
                    pattern: new RegExp(/^[A-Z]{4}0[a-zA-Z0-9]{6}$/),
                    message: "Invalid IFSC Number",
                  },
                ]}>
                {/* {valueIfscCode} */}
                <TextField
                  disabled={verified}
                  inputProps={inputProps}
                  key={valueIfscCode}
                  style={{
                    pointerEvents: verified ? "none" : "initial",
                  }}
                 
                  defaultValue={valueIfscCode}
                  id="ifscCode"
                  label="IFSC Code*"
                  fullWidth
                  onBlur={(e) => setValueIfscCode(e.target.value)}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 11).toUpperCase();
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginTop: 15 }}>
              <Form.Item name="bankName">
                <TextField
                  disabled={verified}
                  inputProps={{
                    readOnly: { bankDisable },
                  }}
                  style={{
                    pointerEvents: verified ? "none" : "initial",
                  }}
                  key={valueBankName}
                  defaultValue={valueBankName}
                  id="bankName"
                  label="Bank Name*"
                  fullWidth
                  onBlur={(e) => setValueBankName(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg={8} style={{ marginTop: 15 }}>
              {
                // this.props?.qde?.pennyDropDetails?.accountHolderName &&
                (allowPenny || props.qde.pennySuccess) && (
                  <Form.Item
                    name="accountHolderName"
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}>
                    <TextField
                      disabled={verified}
                      style={{
                        pointerEvents: verified ? "none" : "initial",
                      }}
                      key={props?.qde?.pennyDropDetails?.accountHolderName}
                      inputProps={inputProps}
                      value={props?.qde?.pennyDropDetails?.accountHolderName}
                      InputLabelProps={{
                        shrink: form && form.getFieldValue("accountHolderName"),
                      }}
                      fullWidth={true}
                      label="Account Holder Name"
                      className="textField"
                      onKeyDown={(e) => e.keyCode === 32 && e.preventDefault()}
                    />
                  </Form.Item>
                )
              }
            </Col>
            <Col lg={8}>
              {true &&
                // (this.props.qde.pennySuccess && this.state.allowPenny ?
                (verified ? (
                  <div
                    className="verifiedTheme verifyButtonTheme"
                    style={{ marginTop: 5 }}>
                    <img src={Verified} alt={"Verified"} />
                    Verified
                  </div>
                ) : (
                  <Button
                    className="cancle-button mr-3"
                    onClick={() => {
                      handlePennyDrop();
                    }}>
                    Verify
                  </Button>
                ))}
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Button
                className="save-button mr-3"
                onClick={() => {
                  props.history.push(
                    `${public_url.loanSummary}/${
                      props.qde.getQdeSectionDetails &&
                      props.qde.getQdeSectionDetails.data &&
                      props.qde.getQdeSectionDetails.data.id
                    }`
                  );
                }}>
                Loan Summary
              </Button>{" "}
              <button
                className="cancle-button btnBusinessCancel"
                onClick={redirectToLeadList}>
                Cancel
              </button>
              {!(props.freezeCase || props.freezeUser) && (
                <Button
                  htmlType="submit"
                  className="save-button mr-3"
                  disabled={!valueBankName}>
                  Save{" "}
                </Button>
              )}
              <Button
                className="save-button"
                disabled={!valueBankName}
                onClick={handleChangeStep}>
                {" "}
                Next{" "}
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

const mapDispatchToProps = {
  saveUpdateBusinessDetailsService,
  createCustomer,
  getPennyDetails,
  uploadSelfieFB,
  deleteUploadedSelfieFB,
  getQdeDetail,
};

const mapStateToProps = (state) => {
  return {
    qde: state.qde,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuisnessDetails);
