import TextField from "@material-ui/core/TextField";
import { Button, Col, Form, Row, Checkbox } from "antd";
import isEmpty from "lodash/isEmpty";
import React from "react";
import SelectIcon from "../../../assets/Images/select.svg";
import { connect } from "react-redux";
import {
  getPincodeDetail,
  saveAddressDetails,
  getGstAddress,
} from "../../../Redux/Services/Qde";
import "./style.scss";
import { ts } from "../../../Utility/ReduxToaster";

function CurrentOfficeAddress(props) {
  let form;
  const [InputLabelProps, setInputLabelProps] = React.useState({
    shrink: false,
  });
  const [city, setCity] = React.useState();
  const [state, setState] = React.useState();
  const [pincode, setPincode] = React.useState();
  const [isOptional, setIsOptional] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [officeYear, setofficeYear] = React.useState(0);
  const [officeMonth, setofficeMonth] = React.useState(0);
  const [officeType, setofficeType] = React.useState(0);
  const [gstAdd, setGstAdd] = React.useState(null);
  const [emptyFlag, setEmptyFlag] = React.useState(false);
  const [gstFlag, setGstFlag] = React.useState(false);
  const [kycChecked, setKycChecked] = React.useState(false);
  const [select, setSelect] = React.useState(false);

  const handleValueChange = (changedFields, allFields) => {
    if (changedFields.pinCode && changedFields.pinCode.length === 6) {
      setPincodeDetails(changedFields.pinCode, form);
    }
    if (changedFields.pinCode) {
      form && form.resetFields(["city", "state"]);
    }
    if (allFields.address1 || allFields.address2) {
      setInputLabelProps({
        shrink: true,
      });
    } else {
      setInputLabelProps({
        shrink: false,
      });
    }

    if (
      changedFields.address1 ||
      changedFields.address2 ||
      changedFields.pinCode ||
      changedFields.city ||
      changedFields.state ||
      changedFields.officeType ||
      changedFields.officeYear ||
      changedFields.officeMonth
    ) {
      setKycChecked(true);
      setChecked(false);
    }

  };

  if(checked && !select){
    if(gstAdd && checked){
      console.log("gst & checked")
      setChecked(false)
    }
  }


  // set InputLabelProps
  const inputLabel = (key) => {
    return checked ? { shrink: true } : { shrink: form && form.getFieldValue(`${key}`) }
  }

  const fetchKycAdress = (e) => {
    if (gstAdd && !checked){
      console.log("inside if", checked)
      setChecked(true)
      setSelect(true)
    }else{
      console.log("inside else")
      setChecked(e.target.checked);
    }
  };

  //-----------For GST api calling if gst Number is present-------------------------
  React.useEffect(() => {
    if (
      props.qde &&
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.pangstdetails &&
      props.qde.getQdeSectionDetails.data.pangstdetails.gst &&
      props.qde &&
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails
        .currentOfficeAddresDetails &&
      !props.qde.getQdeSectionDetails.data.additionalDetails
        .currentOfficeAddresDetails.gstAddressFlag
    ) {
      const getData = async () => {
        const response = await props.getGstAddress({
          gst:
            props.qde &&
            props.qde.getQdeSectionDetails &&
            props.qde.getQdeSectionDetails.data &&
            props.qde.getQdeSectionDetails.data.pangstdetails &&
            props.qde.getQdeSectionDetails.data.pangstdetails.gst,
        });
        const data = (await response) && response.payload;
        setGstAdd(data);
        setGstFlag(true);
      };
      getData();
      ts("GST Address fetched successfully");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.qde.getQdeSectionDetails && props.qde.getQdeSectionDetails.data]);
  //-----------For GST api calling if gst Number is present-------------------------

  //---------------For setting GST address in fields-------------------------------
  React.useEffect(() => {
    if (gstAdd !== null) {
      form &&
         form.setFieldsValue({
          address1: gstAdd.addressLine1,
          address2: gstAdd.addressLine2,
          pinCode: gstAdd.pincode,
        });
    }
    const getData = async () => {
      if (gstAdd && gstAdd.pincode && gstAdd.pincode.length === 6) {
        const response = await getPincodeDetail({ pincode: gstAdd.pincode });
        setState(response.state);
        setCity(response.city);
      }
    };
    getData();
  }, [checked, form, gstAdd]);
  //---------------For setting GST address in fields-------------------------------

  React.useEffect(() => {
    if (gstAdd !== null) {
      form &&
         form.setFieldsValue({
          city,
          state,
        });
    }
  }, [gstAdd, state, city, form]);

  //--------------For gst-----------------------
  React.useEffect(() => {
    const { kycaddresDetails } =
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails;

    const { sameRegisteredAddressFlag } =
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails.currentOfficeAddresDetails;

      console.log("sameRegisteredAddressFlag-->", sameRegisteredAddressFlag);

    if (gstAdd) {
      console.log("gstAdd dikhna chaiye--->", gstAdd);
      form &&
         form.setFieldsValue({
          address1: gstAdd.addressLine1,
          address2: gstAdd.addressLine2,
          pinCode: gstAdd.pincode,
        });
      if (sameRegisteredAddressFlag){
       form &&
         form.setFieldsValue({
           address1: gstAdd.addressLine1,
           address2: gstAdd.addressLine2,
           pinCode: gstAdd.pincode,
         });
      }
        if (kycaddresDetails && checked) {
          const address1 = kycaddresDetails.address1;
          const address2 = kycaddresDetails.address2;
          const pinCode = kycaddresDetails.pinCode;
          const city = kycaddresDetails.city;
          const state = kycaddresDetails.state;
          const officeMonth = kycaddresDetails.kycMonth;
          const officeYear = kycaddresDetails.kycYear;
          const officeType = kycaddresDetails.residenceType;
          const landmark1 = kycaddresDetails.landmark1;
          const landmark2 = kycaddresDetails.landmark2;
          setofficeYear(officeYear);
          setofficeMonth(officeMonth);
          setofficeType(officeType);
          if (kycChecked || checked) {
            console.log("gst: kyc addresDetails dikhna chaiye");
            setInputLabelProps({ shrink: true });
            form &&
              form.setFieldsValue({
                address1,
                address2,
                pinCode,
                city,
                state,
                officeMonth: officeMonth,
                officeYear: officeYear,
                officeType: officeType,
                landmark1,
                landmark2,
              });
            setEmptyFlag(true);
            setGstAdd(null);
          } else if (emptyFlag) {
            console.log("gst: kuch nahi dikhna chaiye");
            if (!kycChecked) {
              form &&
                form.resetFields([
                  "address1",
                  "address2",
                  "pinCode",
                  "city",
                  "state",
                  "officeMonth",
                  "officeYear",
                  "officeType",
                  "landmark1",
                  "landmark2",
                ]);
              setInputLabelProps({ shrink: false });
            }
          }
        }
    }
  }, [checked, emptyFlag, form, gstAdd, kycChecked, props.qde.getQdeSectionDetails]);

  //-----------------For all the conditions------------------------------------------
  React.useEffect(() => {
    const { currentOfficeAddresDetails } =
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails;

    const { kycaddresDetails } =
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails 

    const { saveCurrentOfficeFlag } =
      props.qde && props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails
        .currentOfficeAddresDetails;
    if(!gstAdd){
    if ((saveCurrentOfficeFlag && !checked) || (!saveCurrentOfficeFlag && !checked)) {
      console.log(
        "currentOfficeAddresDetails dikhna chaiye-->",
        currentOfficeAddresDetails
      );
      const address1 = currentOfficeAddresDetails.address1;
      const address2 = currentOfficeAddresDetails.address2;
      const pinCode = currentOfficeAddresDetails.pinCode;
      const city = currentOfficeAddresDetails.city;
      const state = currentOfficeAddresDetails.state;
      const officeMonth = currentOfficeAddresDetails.kycMonth;
      const officeYear = currentOfficeAddresDetails.kycYear;
      const officeType = currentOfficeAddresDetails.residenceType;
      const landmark1 = currentOfficeAddresDetails.landmark1;
      const landmark2 = currentOfficeAddresDetails.landmark2;
      setofficeYear(officeYear);
      setofficeMonth(officeMonth);
      setofficeType(officeType);
      if (checked) {
        setInputLabelProps({ shrink: true });
        form.setFieldsValue({
          address1,
          address2,
          pinCode,
          city,
          state,
          officeMonth: officeMonth,
          officeYear: officeYear,
          officeType: officeType,
          landmark1,
          landmark2
        });
        setEmptyFlag(true);
      } else if (emptyFlag) {
        if (!kycChecked) {
          form.resetFields([
            "address1",
            "address2",
            "pinCode",
            "city",
            "state",
            "officeMonth",
            "officeYear",
            "officeType",
            "landmark1",
            "landmark2"
          ]);
          setInputLabelProps({ shrink: false });
        }
      }
    } else if (!checked) {
      console.log("kuch nahi dikhna chaiye");
      form.resetFields([
        "address1",
        "address2",
        "pinCode",
        "city",
        "state",
        "officeMonth",
        "officeYear",
        "officeType",
        "landmark1",
        "landmark2",
      ]);
    } else if (
      (kycaddresDetails && checked) ||
      (saveCurrentOfficeFlag && checked)
    ) {
      console.log("kycAddressDetails dikhna chaiye-->", kycaddresDetails);
      const address1 = kycaddresDetails.address1;
      const address2 = kycaddresDetails.address2;
      const pinCode = kycaddresDetails.pinCode;
      const city = kycaddresDetails.city;
      const state = kycaddresDetails.state;
      const officeMonth = kycaddresDetails.kycMonth;
      const officeYear = kycaddresDetails.kycYear;
      const officeType = kycaddresDetails.residenceType;
      const landmark1 = kycaddresDetails.landmark1;
      const landmark2 = kycaddresDetails.landmark2;
      setofficeYear(officeYear);
      setofficeMonth(officeMonth);
      setofficeType(officeType);
      if (checked) {
        setInputLabelProps({ shrink: true });
        form.setFieldsValue({
          address1,
          address2,
          pinCode,
          city,
          state,
          officeMonth: officeMonth,
          officeYear: officeYear,
          officeType: officeType,
          landmark1,
          landmark2
        });
        setEmptyFlag(true);
      } else if (emptyFlag) {
        form.resetFields([
          "address1",
          "address2",
          "pinCode",
          "city",
          "state",
          "officeMonth",
          "officeYear",
          "officeType",
          "landmark1",
          "landmark2"
        ]);
        setInputLabelProps({ shrink: false });
      }
    }
  }
  }, [checked, emptyFlag, form, gstAdd, kycChecked, props.qde, props.qde.getQdeSectionDetails]);
  //-----------------For all the conditions------------------------------------------

  const setPincodeDetails = async (pinCode, formInstance) => {
    const response = await getPincodeDetail({ pincode: pinCode });
    if (isEmpty(response)) {
      form && form.resetFields(["city", "state"]);
    }
    const { city, state } = response;
    if (city || state) {
      formInstance.setFieldsValue({
        city,
        state,
      });
      setInputLabelProps({ shrink: true });
    } else {
      formInstance.resetFields(["city", "state"]);
      setInputLabelProps({ shrink: false });
    }
    setCity(city ? city : null);
    setState(state ? state : null);
  };

  React.useEffect(() => {
    if (
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails &&
      (props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails
        .residenceType !== "PG" ||
        props.qde.getQdeSectionDetails.data.additionalDetails.kycaddresDetails
          .residenceType !== "Corporate Provided")
    ) {
      setIsOptional(true);
    } else {
      setIsOptional(false);
    }
  }, [props.qde.getQdeSectionDetails.data]);

  const onFinish = (values) => {
    let id = null;
    if (
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      !isEmpty(
        props.qde.getQdeSectionDetails.data.additionalDetails
          .currentOfficeAddresDetails
      )
    ) {
      id =
        props.qde.getQdeSectionDetails.data.additionalDetails
          .currentOfficeAddresDetails.id;
    }
    const payload = {
      ...values,
      applicantUniqueId: props.match.params.id,
      leadCode: props.qde.getQdeSectionDetails.data.leadCode,
      type: "Current office",
      id,
      sameRegisteredAddressFlag: checked,
      saveCurrentOfficeFlag: true,
      // gstAddressFlag: gstFlag,
      gstAddressFlag: true,
    };
    const other = {
      officeMonth,
      officeYear,
    };
    const data = !checked ? { ...payload } : { ...payload, ...other };
    props.saveAddressDetails(data, "permanent");
  };

  const onFinishFailed = (errorInfo) => {};

  const inputProps = {
    readOnly: props.freezeCase || props.freezeUser || props.bureauFreeze,
    disabled: props.freezeCase || props.freezeUser || props.bureauFreeze,
  };

  React.useEffect(() => {
    if (
      props.qde.getQdeSectionDetails &&
      props.qde.getQdeSectionDetails.data &&
      props.qde.getQdeSectionDetails.data.additionalDetails &&
      props.qde.getQdeSectionDetails.data.additionalDetails
        .currentOfficeAddresDetails
    ) {
      const {
        city,
        state,
        address1,
        address2,
        pinCode,
        officeMonth,
        officeYear,
        sameRegisteredAddressFlag,
        officeType,
        landmark1,
        landmark2
      } =
        props.qde.getQdeSectionDetails.data.additionalDetails
          .currentOfficeAddresDetails;
      form &&
         form.setFieldsValue({
          address1,
          address2,
          pinCode,
          city,
          state,
          officeMonth,
          officeYear,
          officeType,
          landmark1,
          landmark2,
        });
      setChecked(sameRegisteredAddressFlag);
      setPincode({ pinCode });
      city &&
        state &&
        setInputLabelProps({
          shrink: true,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.qde.getQdeSectionDetails]);

  console.log("checked-->", checked);

  return (
    <div className="DetailsCommon">
      <Form
        ref={(e) => (form = e)}
        name="basic"
        initialValues={{ remember: true }}
        onValuesChange={handleValueChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Row gutter={30}>
          {props.qde.getQdeSectionDetails.data &&
            props.qde.getQdeSectionDetails.data.additionalDetails &&
            props.qde.getQdeSectionDetails.data.additionalDetails
              .kycaddresDetails &&
            (props.qde.getQdeSectionDetails.data.additionalDetails
              .kycaddresDetails.residenceType === "Owned" ||
              props.qde.getQdeSectionDetails.data.additionalDetails
                .kycaddresDetails.residenceType === "Rented") && (
              <Col lg={24} className="mb-3">
                <Checkbox
                  disabled={
                    props.freezeCase || props.freezeUser || props.bureauFreeze
                  }
                  checked={checked}
                  onChange={fetchKycAdress}></Checkbox>
                <span className="sub-title">
                  &nbsp;Same as Registered Address?
                </span>
              </Col>
            )}
          <Col lg={8}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Address is mandatory",
                },
              ]}
              name={"address1"}>
              <TextField
                // InputLabelProps={InputLabelProps}
                InputLabelProps={inputLabel("address1")}
                inputProps={inputProps}
                multiline
                fullWidth
                rowsMax={5}
                label={"Address Line 1*"}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            {" "}
            <Form.Item
              rules={[
                {
                  required: false,
                  type: "string",
                  message: "Address is mandatory",
                },
              ]}
              name={"address2"}>
              <TextField
                // InputLabelProps={InputLabelProps}
                inputProps={inputProps}
                InputLabelProps={inputLabel("address2")}
                multiline
                fullWidth
                rowsMax={4}
                label="Address Line 2"
              />
            </Form.Item>
          </Col>
          <Col span={8}></Col>
          <Col lg={8}>
            {" "}
            <Form.Item
              name={"landmark1"}
              rules={[
                {
                  required: true,
                  message: "Landmark 1 is mandatory",
                },
              ]}>
              <TextField
                // InputLabelProps={InputLabelProps}
                inputProps={inputProps}
                InputLabelProps={inputLabel("landmark1")}
                multiline
                fullWidth
                rowsMax={4}
                label="Landmark 1*"
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            {" "}
            <Form.Item name={"landmark2"}>
              <TextField
                // InputLabelProps={InputLabelProps}
                inputProps={inputProps}
                InputLabelProps={inputLabel("landmark2")}
                multiline
                fullWidth
                rowsMax={4}
                label="Landmark 2"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={30}>
          <Col lg={8}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Pincode is mandatory",
                },
                {
                  pattern: new RegExp(/^[0-9]{6}$/),
                  message: "Invalid Pincode Number",
                },
              ]}
              name={"pinCode"}>
              <TextField
                // InputLabelProps={InputLabelProps}
                inputProps={inputProps}
                InputLabelProps={inputLabel("pinCode")}
                onKeyDown={(e) =>
                  (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
                }
                onInput={(e) => {
                  e.target.value = Math.max(0, parseInt(e.target.value))
                    .toString()
                    .slice(0, 6);
                }}
                type="number"
                label={"Pincode*"}
                fullWidth
              />
            </Form.Item>
          </Col>

          <Col lg={8}>
            {" "}
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "City is mandatory",
                },
              ]}
              name={"city"}>
              <TextField
                inputProps={inputProps}
                // InputLabelProps={InputLabelProps}
                InputLabelProps={inputLabel("city")}
                fullWidth
                id="standard-read-only-input"
                label={"City*"}
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
          <Col lg={8}>
            {" "}
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "   is mandatory",
                },
              ]}
              name="state">
              <TextField
                inputProps={inputProps}
                // InputLabelProps={InputLabelProps}
                InputLabelProps={inputLabel("state")}
                fullWidth
                label={"State*"}
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

          <Col lg={8}>
            {" "}
            <div className={"mui-dropdown-wrapper"}>
              <img alt={"select"} src={SelectIcon} className="searchIcon" />
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Office Type is mandatory",
                  },
                ]}
                name="officeType">
                <TextField
                  inputProps={inputProps}
                  InputLabelProps={InputLabelProps}
                  label="Office Type*"
                  select
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}>
                  {/* {officeType} */}
                  <option hidden></option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                </TextField>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <br />
        {/* {!checked && ( */}
        <>
          <p className="sub-title">Business at Current Address since*</p>
          <Row gutter={40}>
            <Col lg={8}>
              <Form.Item
                name={"officeYear"}
                rules={[
                  {
                    required: true,
                    message: "Years is mandatory",
                  },
                ]}>
                <TextField
                  inputProps={inputProps}
                  InputLabelProps={InputLabelProps}
                  fullWidth={true}
                  id="standard-basic"
                  label="Years*"
                  className="textField fileNoinput"
                  onKeyDown={(e) =>
                    (e.keyCode === 69 || e.keyCode === 190) &&
                    e.preventDefault()
                  }
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value))
                      .toString()
                      .slice(0, 2);
                  }}
                  type="number"
                />
              </Form.Item>
            </Col>

            <Col lg={8}>
              <div className={"mui-dropdown-wrapper"}>
                <img alt={"select"} src={SelectIcon} className="searchIcon" />
                <Form.Item
                  name={"officeMonth"}
                  rules={[
                    {
                      required: true,
                      message: "Months is mandatory",
                    },
                  ]}>
                  <TextField
                    inputProps={inputProps}
                    InputLabelProps={InputLabelProps}
                    label="Months*"
                    select
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}>
                    <option hidden></option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                  </TextField>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </>
        {/* )} */}
        <div className="alignButton">
          {!(props.freezeCase || props.freezeUser) && (
            <Button
              htmlType="submit"
              className="save-button"
              disabled={props.bureauFreeze}>
              Save
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { qde: state.qde };
};

const mapDispatchToProps = {
  saveAddressDetails,
  getGstAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentOfficeAddress);