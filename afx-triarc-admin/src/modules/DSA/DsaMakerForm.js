import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  PanDetails,
  GstNumber,
  Gstaddress,
  getAllState,
  getAllCities,
  AddDSA,
  getCompanytypeList,
  uploadDoc,
  postIsMobileNumberPresent,
  postIsEmailExist,
  BranchList,
} from "../../Utils/dsa";
import { withRouter } from "react-router-dom";
// import { BranchList } from "../../Utils/management";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Select from "react-select";
import ImageUploader from "react-images-upload";
import { ToastContainer, toast } from "react-toastify";
import JSZip from "jszip";
import fs from "fs";
import {
  SpinnerLoader,
  FullScreenLoader,
} from "../../Components/Assets/Loader";
import { CloseSection } from "../../Components/Assets/CloseSection";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { isNull } from "util";
toast.configure();

// const statusOption = [
//   { id: 1, value: "Private Ltd Company", label: "Private Ltd Company" },
//   { id: 2, value: "Sole Proprietorship", label: "Sole Proprietorship" },
//   {
//     id: 3,
//     value: "Joint Hindu Family Bussiness",
//     label: "Joint Hindu Family Bussiness",
//   },
//   { id: 4, value: "Partnership", label: "Partnership" },
//   {
//     id: 4,
//     value: "Limited Liability Partnership(LLP)",
//     label: "Limited Liability Partnership(LLP)",
//   },
// ];

// const CompanytypeOption = [
//   { id: 1, value: "Private Ltd Company", label: "Private Ltd Company" },
//   { id: 2, value: "Sole Proprietorship", label: "Sole Proprietorship" },
//   {
//     id: 3,
//     value: "Joint Hindu Family Business",
//     label: "Joint Hindu Family Business"
//   },
//   { id: 4, value: "Partnership", label: "Partnership" },
//   {
//     id: 5,
//     value: "Limited Liability Partnership(LLP)",
//     label: "Limited Liability Partnership(LLP)"
//   }
// ];

// const CompanyNameOption = [
//   { id: 1, value: "Company Name", label: "Company Name" },
//   { id: 1, value: "Individual Name", label: "Individual Name" },
//   { id: 1, value: "HUF", label: "HUF" },
// ];

export class DsaMakerForm extends Component {
  state = {
    show: false,
    status: null,
    company: null,
    companyName: null,
    gst: null,
    panNumber: null,
    stat: null,
    city: null,
    branch: null,
    addressFlag: null,
    startDate: "",
    dateOfBirth: "",
    address: [],
    addrs: "",
    gstShow: false,
    invalidPanNumber: false,
    noGstfound: false,
    invalidemailId: false,
    invalidecontactName: false,
    getdis: false,
    name: "",
    mobileNO: "",
    emailId: "",
    bankName: "",
    accountName: "",
    document: "",
    bankAccountNumber: "",
    ifscCode: "",
    hsnCode: "",
    DOB: "",
    stateCode: "",
    pan: null,
    panStatus: null,
    permanantAddress: "",
    communicationAddress: "",
    pinCode: "",
    GstDetails: [],
    GSTAddress: [],
    getState: [],
    getCities: [],
    branchListData: [],
    CompanytypeOption: [],
    cancelcheque: null,
    aggrement: [],
    aggrement: [],
    profilePicture: [],
    cancelcheque: [],
    shopact: [],
    adhaar: [],
    panCard: [],
    showInner: false,
    gstdis: true,
    isMobileNumberExist: null,
    errors: {
      TypeOfCompanyError: null,
      PanNumberError: null,
      dateOfBirthError: null,
      statError: null,
      gstNoError: false,
      cityError: false,
      branchError: null,
      pinCodeError: null,
      nameError: null,
      mobileNOError: false,
      emailIdError: null,
      permanantAddressError: null,
      accountNameError: null,
      bankNameError: null,
      bankAccountNumberError: null,
      ifscCodeError: null,
      // isMobileNumberExist: null,
      isEmailAddressExist: null,
      validAccountNumber: null,
      validAccountNameError: false,
      validBankNameError: false,
      aggrementError: null,
      profilePictureError: null,
      cancelchequeError: null,
      shopactError: null,
      adhaarError: null,
      panCardError: null,
      invalidifscCode: null,
      validpinCode: null,
      invalidmobileNo: null,
    },
    verifyLoading: false,
    isSameRegisterAndCommunicationAddress: false,
    loading: false,
    screenLoader: false,
    mobileVerifyLoading: false,
    emailVerifyLoading: false,
    gstVerifyLoading: false,
    view: false,
  };

  componentWillMount() {
    if (this.props.location.pathname.includes("view")) {
      this.setState({ view: true });
    }
  }

  componentDidMount() {
    let { errors } = this.state;
    document.body.style.position = "fixed";
    document.body.style.top = `-${window.scrollY}px`;
    this.handleShow();
    this.handlestateName();
    this.setState({ errors: { ...errors, cityError: false } });
    this.GetCompanyListData();
    this.GetallStateData();
    this.getAllBranchList();
  }


  componentWillUnmount() {
    document.body.style.position = "";
    document.body.style.top = "";
  }

  handleShow = () => {
    this.setState({
      show: true,
    });
  };

  handleClose = (close) => {
    this.props.history.push("/:mode/dashboard");
    if (!close) this.close();
    this.setState({ show: false });
    // this.props.addUser();
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleRegisterAddress = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if (e.target.value.trim() == "") {
      errors = { ...errors, permanantAddressError: true };
    } else {
      errors = { ...errors, permanantAddressError: false };
    }
    this.setState({ [name]: value, errors });
  };

  handleCommunicationAddress = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleStatus = (company) => {
    let { errors } = this.state;
    if (company === "" || company === null || company === undefined) {
      errors = { ...errors, TypeOfCompanyError: true };
    } else {
      errors = { ...errors, TypeOfCompanyError: false };
    }
    this.setState({ company, panNumber: "", DOB: null, pan: "", errors });
  };

  handlestateName = (stat) => {
    let { errors } = this.state;
    if (stat === "" || stat === null || stat === undefined) {
      this.setState({ errors: { ...errors, statError: true } });
    } else {
      this.setState({
        errors: { ...errors, statError: false, cityError: false }
      });
    }
    this.setState(
      { stat, city:"", errors: { ...errors, cityError: true } },
      () => this.GetAllCitiesData()
    );
  };

  handleCity = (city) => {
    let { errors } = this.state;
    if (city === "" || city === null || city === undefined) {
      this.setState({ errors: { ...errors, cityError: true } });
    } else {
      this.setState({ errors: { ...errors, cityError: false } });
    }
    this.setState({ city });
  };

  handleContactName = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if (e.target.value.trim() == "") {
      errors = { ...errors, nameError: true };
    } else {
      errors = { ...errors, nameError: false };
    }
    this.setState({ [name]: value.replace(/[^a-zA-Z ]/g, ""), errors });
  };

  handleBankName = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if (e.target.value.trim() == "") {
      errors = { ...errors, bankNameError: true };
    } else {
      errors = { ...errors, bankNameError: false };
    }
    this.setState({ [name]: value.replace(/[^a-zA-Z ]/g, ""), errors });
  };

  BankAccountName = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if (e.target.value.trim() == "") {
      errors = { ...errors, accountNameError: true };
    } else {
      errors = { ...errors, accountNameError: false };
    }
    this.setState({ [name]: value.replace(/[^a-zA-Z ]/g, ""), errors });
  };

  handleGST = (gst) => {
    let { errors } = this.state;
    if (gst === "" || gst === null || gst === undefined) {
      this.setState({ errors: { ...errors, gstNoError: true } });
    } else {
      this.setState({ errors: { ...errors, gstNoError: false } });
    }
    this.setState({ gst }, () => this.GSTAddressDetails());
  };

  handleBranch = (branch) => {
    let { errors } = this.state;
    if (branch === "" || branch === null || branch === undefined) {
      this.setState({ errors: { ...errors, branchError: true } });
    } else {
      this.setState({ errors: { ...errors, branchError: false } });
    }
    this.setState({ branch });
  };

  handlePan = (e) => {
    let { errors } = this.state;
    if (e.target.value == "" || e.target.value === null || e.target.value === undefined) {
      errors = { ...errors, PanNumberError: true };
    } else {
      errors = { ...errors, PanNumberError: false };
    }
    this.setState({
      panNumber: e.target.value.toUpperCase(),
      panStatus: null,
      errors,
      // company: null
    });
    // if(this.state.panNumber.length < 10){
    //   this.setState({company: null})
    // }
  };

maxLengthCheck = (object) => {
 if (object.target.value.length > object.target.maxLength) {
  object.target.value = object.target.value.slice(10, object.target.maxLength)
   }
 }

  handlepinCode = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if (value.trim() == "") {
      this.setState({
        errors: { ...errors, pinCodeError: true },
      });
    } else {
      this.setState({
        errors: { ...errors, pinCodeError: false },
      });
    }

    if ((value && value.length !== 6) || (value && value == "000000")) {
      this.setState({
        errors: { ...errors, validpinCode: true },
      });
    } else {
      this.setState({ errors: { ...errors, validpinCode: false } });
    }

    this.setState({
      pinCode: e.target.value,
    });
  };

  handlemobile = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if (value.trim() == "") {
      this.setState({ errors: { ...errors, mobileNOError: true } });
    } else {
      this.setState({ errors: { ...errors, mobileNOError: false } });
    }

    if (name === "mobileNO") {
      let indianMobilenumber = /^[6789]\d{9}$/;
      if ((value && value.length < 10) || !value.match(indianMobilenumber)) {
        this.setState({
          errors: { ...errors, invalidmobileNo: true },
        });
      } else {
        this.setState(
          {
            errors: { ...errors, invalidmobileNo: false },
          },
          () => {
            if (value) this.isMobileNumberPresent(value);
          }
        );
      }
    }

    this.setState({
      mobileNO: e.target.value,
    });
  };

  handleifsc = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    let verifyIfsc = "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$";
    if (value.trim() == "") {
      this.setState({ errors: { ...errors, ifscCodeError: true } });
    } else {
      this.setState({ errors: { ...errors, ifscCodeError: false } });
    }
    if (value && !value.match(verifyIfsc)) {
      this.setState({ errors: { ...errors, invalidifscCode: true } });
    } else {
      this.setState({ errors: { ...errors, invalidifscCode: false } });
    }
    this.setState({
      ifscCode: e.target.value.toUpperCase(),
    });
  };

  handleDOB = (date, e) => {
    let { errors } = this.state;
    if (date === "" || date === null || date === undefined) {
      errors = { ...errors, dateOfBirthError: true };
    } else {
      errors = { ...errors, dateOfBirthError: false };
    }
    this.setState(
      {
        DOB: date,
        panStatus: null,
        errors,
      },
      () => this.handleMoment()
    );
  };

  handleAccountNumber = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if ((value.trim() == "") || (value == "0000000000000000")) {
      this.setState({ errors: { ...errors, bankAccountNumberError: true } });
    } else {
      this.setState({ errors: { ...errors, bankAccountNumberError: false } });
    }

    this.setState({ [name]: value });
  };

  blurAccountNumber = (e) => {
    let { errors } = this.state;
    let { name, value } = e.target;
    if (
      (e.target.value.trim().length == 9 || e.target.value.trim().length > 9) &&
      (e.target.value.trim().length == 16 || e.target.value.trim().length < 16)
    ) {
      this.setState({ errors: { ...errors, validAccountNumber: false } });
    } else {
      this.setState({ errors: { ...errors, validAccountNumber: true } });
    }
  };

  handleMoment = () => {
    this.setState({
      dateOfBirth: moment(this.state.DOB && this.state.DOB).format(
        "YYYY-MM-DD"
      ),
    });
  };

  handleCheck = () => {
    let { gstShow, errors, panNumber, panStatus, verifyLoading } = this.state;
    if (!panNumber) {
      toast.error("Please enter pan number.");
      return;
    }
    if (panStatus == "Invalid" || (panStatus == "" && !verifyLoading)) {
      toast.error("Please verify your pan number.");
      return;
    }
    if (verifyLoading) {
      toast.error("Please wait!, Your pan card is verifying.");
      return;
    }
    if (panStatus == "" || panStatus == null) {
      toast.error("Please verify your pan number.");
      return;
    }

    if (!gstShow) {
      errors = {
        ...errors,
        gstNoError: true,
        permanantAddressError: false,
      };
    } else {
      let { gst, hsnCode, statecode, permanantAddress } = this.state;
      this.setState({
        gst: null,
        hsnCode: null,
        stateCode: null,
        permanantAddress: "",
        communicationAddress: "",
        addressFlag: false,
        errors: { ...errors, gstNoError: false },
      });
      errors = {
        ...errors,
        // gstNoError: false,
        permanantAddressError: true,
      };
      delete errors.hsnCodeError;
      delete errors.stateCodeError;
      this.setState({ getdis: false });
    }
    this.setState(
      {
        gstShow: !gstShow,
        isSameRegisterAndCommunicationAddress: false,
        // permanantAddress: "",
        addrs: "",
        errors,
      },
      () => {
        if (this.state.gstShow) {
          this.GSTData();
        }
      }
    );
  };

  isSameRegisterAndCommunicationAddress = () => {
    let {
      isSameRegisterAndCommunicationAddress,
      permanantAddress,
      communicationAddress,
    } = this.state;
    if (permanantAddress && permanantAddress.length > 0) {
      this.setState({
        isSameRegisterAndCommunicationAddress: !isSameRegisterAndCommunicationAddress,
        communicationAddress: !isSameRegisterAndCommunicationAddress
          ? permanantAddress
          : "",
      });
    }
    if (!isSameRegisterAndCommunicationAddress) {
      this.setState({
        addressFlag: true,
      });
    } else {
      this.setState({ addressFlag: false });
    }
  };

  PanDetailData = () => {
    const { panNumber, dateOfBirth, errors, invalidPanNumber } = this.state;
    if (
      panNumber &&
      !errors.PanNumberError &&
      !invalidPanNumber &&
      invalidPanNumber != null &&
      !errors.dateOfBirthError &&
      errors.dateOfBirthError != null
    ) {
      this.setState({ verifyLoading: true });

      let obj = { panNumber };
      PanDetails(obj).then((response) => {
        if (response.data && response.data.error === false) {
          this.setState(
            {
              pan:
                response.data.data && response.data.data
                  ? response.data.data.name
                  : [],
              verifyLoading: false,
              panStatus:
                response.data.data && response.data.data
                  ? response.data.status
                  : [],
              gstdis: false,
            },
            () => {
              if (this.state.panStatus != "success") {
                toast.error("PAN Is Invalid. Please Enter Valid PAN Number");
              } else {
                if (this.state.gstShow) {
                  this.GSTData();
                }
              }
            }
          );
          toast.success("PAN details fetched successfully");
        } else {
          this.setState({ verifyLoading: false });
          toast.error("Please try Again later!!!.");
        }
      });
    }
  };

  onDrop = (file, picture, name) => {
    let { errors } = this.state;
    if (picture.length > 0) {
      errors = { ...errors, [name + "Error"]: false };
    } else {
      errors = { ...errors, [name + "Error"]: true };
    }
    this.setState({ [name]: file, errors: errors });
  };

  GSTData = () => {
    const { panNumber, errors } = this.state;
    let objs = { panNumber };
    this.setState({ gstVerifyLoading: true });
    GstNumber(objs).then((response) => {
      if (response.data && response.data.error === false) {
        this.setState({
          gstVerifyLoading: false,
          GstDetails:
            response.data && response.data.data ? response.data.data : [],
        });
      }
      if (response.data && response.data.error === true) {
        this.setState({
          gstVerifyLoading: false,
          errors: { ...errors, gstNoError: false },
          noGstfound: true,
        });
      }
      if (response.data && response.data.data.length == 0) {
        toast.error(
          "No GST is available against this PAN",
          {
            type: toast.TYPE.ERROR,
            autoClose: 4000,
          },
          this.setState({
            errors: { ...errors, gstNoError: false },
            gstShow: false,
          })
        );
      }
    });
  };

  GetCompanyListData = () => {
    getCompanytypeList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          CompanytypeOption:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  GSTAddressDetails = () => {
    const { gst } = this.state;
    let ojbts = { gstNumber: gst && gst.gstinId };
    Gstaddress(ojbts).then((response) => {
      if (response.data && response.data.error === false) {
        this.setState(
          {
            GSTAddress:
              response.data && response.data.data ? response.data.data : [],
            stateCode: gst && gst.gstinId.substring(0, 2),
            hsnCode: gst && gst.gstinId.substring(12, 15),
          },
          () => this.getPermanentAdd()
        );
      }
    });
  };

  getPermanentAdd = () => {
    const { GSTAddress, errors } = this.state;
      this.setState({
        permanantAddress: GSTAddress.pradr && GSTAddress.pradr.adr,
        errors: { ...this.state.errors, permanantAddressError: false },
      });
      if (
        (GSTAddress.pradr && GSTAddress.pradr.adr == "") ||
        (GSTAddress.pradr && GSTAddress.pradr.adr == null) ||
        (GSTAddress.pradr && GSTAddress.pradr.adr == undefined)
      ) {
        this.setState({
          getdis: false,
          errors: { ...errors, permanantAddressError: true },
        });
      } else {
        this.setState({
          getdis: true,
          errors: { ...errors, permanantAddressError: false },
        });
      }
  };

  GetallStateData = () => {
    getAllState().then((response) => {
      if (response.data && response.data.error === false) {
        this.setState({
          getState:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  GetAllCitiesData = () => {
    const { stat } = this.state;
    getAllCities(stat && stat.stateId).then((response) => {
      if (response.data && response.data.error === false) {
        this.setState({
          getCities:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  getAllBranchList = () => {
    BranchList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          branchListData:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  verifyGst = () => {
    const {
      panStatus,
      panNumber,
      errors,
      invalidPanNumber,
      dateOfBirth,
      verifyLoading,
      DOB,
      company,
    } = this.state;
    if (
      company === "" ||
      company === null ||
      company === undefined ||
      !panNumber ||
      (errors && errors.dateOfBirthError) ||
      !DOB ||
      DOB.length === 0
    ) {
      this.setState({
        errors: {
          ...errors,
          TypeOfCompanyError:
            company === "" || company === null || company === undefined
              ? true
              : false,
          PanNumberError: !panNumber ? true : false,
          dateOfBirthError: !DOB ? true : false,
        },
      });
      return;
    }

    if (!panNumber) {
      this.setState({ errors: { ...errors, PanNumberError: true } });
      return;
    }
    if ((errors && errors.dateOfBirthError) || !DOB || DOB.length === 0) {
      this.setState({
        errors: { ...errors, dateOfBirthError: true },
      });
      return;
    }
    if (errors.PanNumberError || invalidPanNumber) {
      this.setState({ invalidPanNumber: true });
      return;
    }

    if (panStatus && panStatus === "Active") {
      toast.success("PAN Is Valid", {
        type: toast.TYPE.SUCCESS,
        autoClose: 4000,
      });
      return;
    }
    if (panStatus && panStatus === "Invalid") {
      toast.error("PAN Is Invalid. Please Enter Valid PAN Number", {
        type: toast.TYPE.ERROR,
        autoClose: 4000,
      });
      return;
    }
    this.PanDetailData();
  };
  restrictAlphabets = (e) => {
    const regx = "^[0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  close = (close) => {
    this.setState({ showInner: !this.state.showInner });
  };

  onValidate = (name) => {
    const { DOB, branch, gst, errors, company, stat, city } = this.state;
    if (name === "DOB") {
      if (DOB === "" || DOB === null || DOB === undefined || DOB.length === 0) {
        this.setState({ errors: { ...errors, dateOfBirthError: true } });
      } else {
        this.setState({ errors: { ...errors, dateOfBirthError: false } });
      }
    }
    if (name === "branch") {
      if (
        branch === "" ||
        branch === null ||
        branch === undefined ||
        (branch && branch.length === 0)
      ) {
        this.setState({ errors: { ...errors, branchError: true } });
      } else {
        this.setState({ errors: { ...errors, branchError: false } });
      }
    }

    if (name === "company") {
      if (company === "" || company === null || company === undefined) {
        this.setState({
          errors: { ...errors, TypeOfCompanyError: true },
        });
      } else {
        this.setState({
          errors: { ...errors, TypeOfCompanyError: false },
        });
      }
    }
    if (name === "gst") {
      if (gst === "" || gst === null || gst === undefined) {
        this.setState({ errors: { ...errors, gstNoError: true } });
      } else {
        this.setState({ errors: { ...errors, gstNoError: false } });
      }
    }

    if (name === "stat") {
      if (stat === "" || stat === null || stat === undefined) {
        this.setState({ errors: { ...errors, statError: true } });
      } else {
        this.setState({ errors: { ...errors, statError: false } });
      }
    }

    if (name === "city") {
      if (
        city === "" ||
        city === null ||
        city === undefined ||
        (city && city.length === 0)
      ) {
        this.setState({ errors: { ...errors, cityError: true } });
      } else {
        this.setState({ errors: { ...errors, cityError: false } });
      }
    }
  };

  handleChangePan = (e) => {
    this.setState({});
  };

  handleValidate = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }

    if (name === "ifscCode") {
      if (value.trim() == "") {
        this.setState({ errors: { ...errors, ifscCodeError: true } });
      } else {
        this.setState({ errors: { ...errors, ifscCodeError: false } });
      }
    }

    if (name === "pinCode") {
      if (value.trim() == "") {
        this.setState({
          errors: { ...errors, pinCodeError: true },
        });
      } else {
        this.setState({
          errors: { ...errors, pinCodeError: false },
        });
      }
    }

    if (name === "emailId") {
      let emailRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value && !value.match(emailRegx)) {
        this.setState({
          invalidemailId: true,
        });
      } else {
        this.setState(
          {
            invalidemailId: false,
          },
          () => {
            if (value) this.isEmailAddressExist(value);
          }
        );
      }
    }
    if (name === "panNumber") {
      if (value && value.length != 10) {
        this.setState({
          invalidPanNumber: true,
        });
      } else {
        this.setState({
          invalidPanNumber: false,
        });
      }
    }

    if (name === "panNumber") {
      var pan_value = value.toUpperCase();
      var reg = /([a-zA-Z]{3})([PCHFATBLJGE]{1})([a-zA-Z]{1})([0-9]{4})([a-zA-Z]{1})/;
      var pan = {
        C: "Company",
        P: "Personal",
        H: "Hindu Undivided Family (HUF)",
        F: "Firm",
        A: "Association of Persons (AOP)",
        T: "AOP (Trust)",
        B: "Body of Individuals 		(BOI)",
        E: "Local Authority",
        J: "Artificial Juridical Person",
        G: "Govt",
      };
      pan = pan[pan_value[3]];
      let company = "";
      // id is comming from database. we have hardcoded the values in front end.
      if (this.state.company.id = "4") {
        company = "C";

      } else if (this.state.company.id = "5") {
        company = "P";

      } else if (this.state.company.id = "6") {
        company = "H";

      } else if (this.state.company.id = "7") {
        company = "A";
        
      } else if (this.state.company.id = "8") {
        company = "E";
      }
      
      if (pan_value.match(reg) && pan_value[3] == company) {
        this.setState({
          invalidPanNumber: false,
        });
      } else {
        this.setState({
          invalidPanNumber: true,
        });
      }

      return;
      let verifiedPan =
        "[A-Z]{3}([CHFATBLJGP])(?:(?<=P)" + "|(?<!P)" + ")[0-9]{4}[A-Z]";
      if (value && !value.match(verifiedPan)) {
        this.setState({
          invalidPanNumber: true,
        });
      } else {
        this.setState({
          invalidPanNumber: false,
        });
      }
    }
    if (name === "mobileNO") {
      let indianMobilenumber = /^[6789]\d{9}$/;
      if ((value && value.length < 10) || !value.match(indianMobilenumber)) {
        this.setState({
          errors: { ...errors, invalidmobileNo: true },
        });
      } else {
        this.setState(
          {
            errors: { ...errors, invalidmobileNo: false },
          },
          () => {
            if (value) this.isMobileNumberPresent(value);
          }
        );
      }
    }

    if (name === "permanantAddress") {
      if (value && value.length > 700) {
        this.setState({
          permanantAddressError: true,
        });
      }
    }
  };
  isMobileNumberPresent = (mobileNumber) => {
    this.setState({ mobileVerifyLoading: true });
    postIsMobileNumberPresent(mobileNumber).then((res) => {
      if (res.data && res.data.error == "true") {
        this.setState({
          mobileVerifyLoading: false,
          isMobileNumberExist: true,
        });
      } else {
        this.setState({
          mobileVerifyLoading: false,
          isMobileNumberExist: false,
        });
      }
    });
  };
  isEmailAddressExist = (emailAddress) => {
    this.setState({ emailVerifyLoading: true });
    postIsEmailExist(emailAddress).then((res) => {
      if (res.data && res.data.error == "true") {
        this.setState({
          emailVerifyLoading: false,
          errors: {
            ...this.state.errors,
            isEmailAddressExist: "Email ID already exist.",
          },
        });
      } else {
        this.setState({
          emailVerifyLoading: false,
          errors: {
            ...this.state.errors,
            isEmailAddressExist: "",
          },
        });
      }
    });
  };
  handleSubmit = () => {
    const {
      company,
      name,
      panNumber,
      gst,
      errors,
      stat,
      city,
      addrs,
      address,
      mobileNO,
      emailId,
      bankName,
      accountName,
      bankAccountNumber,
      ifscCode,
      hsnCode,
      stateCode,
      invalidPanNumber,
      branch,
      DOB,
      dateOfBirth,
      pinCode,
      permanantAddress,
      communicationAddress,
      verifyLoading,
      gstShow,
      addressFlag,
    } = this.state;

    let errField = "";
    let isAdd = true;
    for (var val in errors) {
      if (errors[val] === null || errors[val]) {
        errors[val] = true;
        isAdd = false;
        if (errors[val] == true && document.getElementsByName(val).length > 0) {
          errField = val;
        }
      }
    }

    // let cities = city.find(
    //   (cities) => cities.cityId
    // )

    console.log("stateCode-->", stateCode);

    let gstStatus = gstShow ? "true" : "false";
    let phoneNumber = mobileNO;
    let companyType = company && company.id;
    let companyName = this.state.pan;
    let stateId = stat && stat.stateId;
    let cityId = city && city.cityId;
    let bankAccountName = accountName;
    let bankAccountno = bankAccountNumber;
    let statecode = stateCode;
    let companyPan = panNumber;
    let gstNumber = gst && gst.gstinId;
    let contactName = name;
    let status = "APPROVALPENDING";
    let branchCode = branch && branch.branchCode;
    let makerId = null;
    let remarkFlag = false;
    let gstNumberList = null;
    let statusFlag = "false";
    let dsaBranchMapping = [];
    if (branch != "" && branch != null && branch != undefined) {
      branch.map((res) => {
        dsaBranchMapping.push({
          createdBy: "NP07111912",
          updatedBy: "NP07111912",
          employeeId: null,
          branchCode: res.branchCode,
        });
      });
    }
    let dsaData = {
      gstStatus,
      companyType,
      companyName,
      stateId,
      cityId,
      phoneNumber,
      bankName,
      bankAccountName,
      bankAccountno,
      ifscCode: ifscCode,
      hsncode: hsnCode,
      stateCode: statecode,
      dsaBranchMapping: dsaBranchMapping,
      companyPan,
      gstNumber,
      pinCode,
      permanantAddress,
      communicationAddress,
      dateOfBirth,
      contactName,
      emailId,
      status,
      makerId,
      remarkFlag,
      gstNumberList,
      addressFlag,
      statusFlag,
      gst,
      roleId: JSON.parse(localStorage.getItem("roleId")),
    };

    if (isAdd) {
      this.setState({ loading: true });
      AddDSA(dsaData).then((response) => {
        if (response.data && response.data.error === false) {
          this.ImageConverToZipAndUpload(response.data.data.applicationNumber);
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 4000,
          });
        }
        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 4000,
          });
          this.setState({ loading: false });
        }
      });
    } else {
      var rect = document.getElementById("pinCode");

      document.getElementsByClassName("modal")[0].setAttribute("id", "modal");
      var elmnt = document.getElementById("modal");
      elmnt.scrollLeft = 500;
      elmnt.scrollTop = rect.offsetTop;
      this.setState({ errors: { ...this.state.errors } });
    }
    this.setState({ errors: { ...errors } });
  };

  ImageConverToZipAndUpload = (uniqueId) => {
    var zip = new JSZip();
    let documentObj = {
      aggrement: this.state.aggrement,
      profilePicture: this.state.profilePicture,
      cancelcheque: this.state.cancelcheque,
      shopact: this.state.shopact,
      adhaar: this.state.adhaar,
      panCard: this.state.panCard,
    };

    let keys = Object.keys(documentObj);

    let userDoc = [];
    keys.map((key, index) => {
      documentObj[key].map((res, i) => {
        userDoc.push({
          documentName: res.name,
          description: key,
          uniqueId: uniqueId,
        });
        zip.file(res.name, res, { binary: true });
      });
    });
    let _this = this;
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const formData = new FormData();
      formData.append("file", content, `${uniqueId}.zip`);
      formData.append("dsaDocs", JSON.stringify(userDoc));
      uploadDoc(userDoc, formData).then((response) => {
        if (response.data && response.data.error === false) {
          _this.setState({ loading: false });
          _this.handleClose(true);
          toast.success("DSA  Added Successfully", {
            type: toast.TYPE.SUCCESS,
            autoClose: 4000,
          });
        }
      });
      //saveAs(content, `${uniqueId}.zip`);
    });
  };
  

  render() {
    const {
      loading,
      status,
      errors,
      company,
      companyName,
      panNumber,
      pan,
      dateOfBirth,
      show,
      gst,
      GSTOption,
      stat,
      stateOption,
      getState,
      GSTAddress,
      city,
      cityOption,
      branch,
      branchOption,
      address,
      DOB,
      name,
      mobileNO,
      bankName,
      accountName,
      bankAccountNumber,
      ifscCode,
      hsnCode,
      stateCode,
      getCities,
      branchListData,
      emailId,
      GstDetails,
      addrs,
      pinCode,
      invalidPanNumber,
      CompanytypeOption,
      permanantAddress,
      communicationAddress,
      invalidmobileNo,
      gstShow,
      invalidemailId,
      invalidifscCode,
      verifyLoading,
      panStatus,
      screenLoader,
      mobileVerifyLoading,
      emailVerifyLoading,
      getdis,
      gstVerifyLoading,
      gstdis,
      validpinCode,
      invalidecontactName,
      addressFlag,
      noGstfound,
      isMobileNumberExist,
      view,
    } = this.state;

    getCompanytypeList();
// console.log("PanNumberError", errors.PanNumberError);
// console.log("dobError", errors.dateOfBirthError)

    return (
      <div className="disable-div">
        <div className="disable-div"></div>
        <FullScreenLoader show={screenLoader} />
        <ToastContainer />
        <Modal
          className="add-user"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show && show}
          id="sdsd"
          onHide={() => {
            this.close();
          }}>
          <Modal.Header closeButton>
            <Modal.Title>DSA FORM</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={`p-4 ${loading || (view && "disable-div")}`}
            style={{ background: "#f8f9fa" }}>
            <div className="row">
              <section className="tab-body mt-3 mb-3">
                <div className="row">
                  <h5 className="col-md-12 text-center mb-4">
                    Company Details
                  </h5>
                  <div className="col-md-4">
                    <label>
                      <i className="text-danger">*</i> Type Of Company
                    </label>
                    <Select
                      value={company}
                      onChange={(e) => {
                        this.handleStatus(e);
                      }}
                      onBlur={() => this.onValidate("company")}
                      name="company"
                      options={CompanytypeOption}
                      placeholder="Type Of Company"
                      valueKey="id"
                      labelKey="subcatType"
                      getOptionLabel={(option) => option["subcatType"]}
                      getOptionValue={(option) => option["id"]}
                      className={`${
                        errors.TypeOfCompanyError ? "error-input-border" : ""
                      } `}
                      isDisabled={
                        (panStatus && panStatus == "Active") || 
                        (verifyLoading && true)
                      }
                    />
                    {errors.TypeOfCompanyError && (
                      <span className="errorMsg">
                        Please Select Type Of Company
                      </span>
                    )}
                  </div>

                  <div className="form-group col-md-4 ">
                    <label>
                      <i className="text-danger">*</i> Company Pan Number
                    </label>
                    <div class="inner-addon right-addon">
                      {panStatus && panStatus == "Active" && (
                        <i class="glyphicon glyphicon-ok"></i>
                      )}
                      <input
                        type="text"
                        pattern="\d*"
                        maxLength="10"
                        name="panNumber"
                        value={panNumber}
                        onChange={(e) => {
                          let regex =
                            /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
                          if (e.target.value.match(regex) == null)
                            this.handlePan(e);
                          //this.handleValidate(e);
                        }}
                        onBlur={this.handleValidate}
                        placeholder="Company PAN Number"
                        className={`form-input ${
                          (errors.PanNumberError || invalidPanNumber)
                            ? "error-input-border"
                            : ""
                        } `}
                        disabled={
                          ((panStatus && panStatus == "Active") || 
                            !company ||
                            verifyLoading) &&
                          true
                        }
                      />
                      {(errors.PanNumberError || invalidPanNumber) && (
                        <span className="errorMsg">
                          Please enter valid Pan Number
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-group overflow-visible col-md-4">
                    <label>
                      {" "}
                      <i className="text-danger">*</i>
                      {company && company.id && company.id == 5
                        ? " Date Of Birth"
                        : " Date Of Incorporation"}
                    </label>
                    <div class="inner-addon right-addon">
                      {panStatus && panStatus == "Active" && (
                        <i class="glyphicon glyphicon-ok z-index-1"></i>
                      )}
                      <DatePicker
                        selected={DOB}
                        onBlur={() => this.onValidate("DOB")}
                        onChange={this.handleDOB}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        placeholderText="YYYY-MM-DD"
                        showYearDropdown
                        showMonthDropdown
                        className={`form-input ${
                          errors.dateOfBirthError ? "error-input-border" : ""
                        } `}
                        disabled={
                          ((panStatus && panStatus == "Active") || 
                            !company ||
                            verifyLoading) &&
                          true
                        }
                      />
                    </div>
                    {errors.dateOfBirthError && (
                      <span className="errorMsg">
                        {company && company.id && company.id == 5
                          ? "Please Select Date Of Birth"
                          : "Please Select Date Of Incorporation"}
                      </span>
                    )}
                  </div>
                  <div className="form-group col-md-4">
                    <label>
                      <i className="text-danger">*</i> Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={pan}
                      onChange={this.handleChange}
                      onBlur={this.handleValidate}
                      placeholder="Enter Company Name"
                      disabled
                      id="ttt"
                      className={`form-input ${
                        errors.companyNameError ? "error-input-border" : ""
                      } `}
                    />
                    {errors.companyNameError && (
                      <span className="errorMsg">
                        Please enter Company Name
                      </span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>&nbsp;</label>
                    <div
                      className="d-flex align-items-center  custom-checkbox cust-checkbox"
                      style={{ marginTop: 7 }}>
                      <input
                        type="checkbox"
                        id="defaultUnchecked"
                        onClick={this.handleCheck}
                        checked={this.state.gstShow}
                        style={{ width: 18, height: 18 }}
                      />
                      <label style={{ paddingLeft: 4 }}>
                        <span>Do You Have GST?</span>
                      </label>
                    </div>
                  </div>
                  <div
                    className="col-md-4 inner-addon right-addon"
                    style={
                      gstShow == false
                        ? { display: "none" }
                        : { display: "block" }
                    }>
                    <label>
                      <i className="text-danger">*</i> GST
                    </label>

                    <div class="inner-addon left-addon">
                      {gstVerifyLoading && (
                        <i class="fa fa-spinner fa-spin"></i>
                      )}
                      <Select
                        value={gst}
                        onChange={this.handleGST}
                        onBlur={() => this.onValidate("gst")}
                        options={GstDetails}
                        name="gst"
                        placeholder="GST"
                        labelKey="gstinId"
                        valueKey="id"
                        getOptionLabel={(option) => option["gstinId"]}
                        getOptionValue={(option) => option["id"]}
                      />
                    </div>
                    {errors.gstNoError && (
                      <span className="errorMsg">Please select GST Number</span>
                    )}
                    {!errors.gstNoError && noGstfound && (
                      <span className="errorMsg">
                        Address not pulled from GST
                      </span>
                    )}
                  </div>
                  <div className="col-md-12 text-center mt-2">
                    <Button
                      className="btn-success buttonload btn-large"
                      onClick={this.verifyGst}
                      disabled={(panStatus && panStatus == "Active") || (panStatus && panStatus == "success") && true}
                      style={{ height: "45px" }}>
                      {verifyLoading ? (
                        <React.Fragment>
                          <i class="fa fa-spinner fa-spin"></i>
                          Verifying
                        </React.Fragment>
                      ) : panStatus && panStatus == "success" ? (
                        "Verified"
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </div>
              </section>
              <section className="tab-body mt-3 mb-3">
                <div className="row">
                  <h5 className="col-md-12 text-center mb-4">
                    <i className="text-danger">*</i> Address Details
                  </h5>
                  <div className="col-md-4">
                    <label>
                      <i className="text-danger">*</i> State
                    </label>
                    <Select
                      value={stat}
                      onChange={this.handlestateName}
                      onBlur={() => this.onValidate("stat")}
                      options={getState}
                      name="stat"
                      placeholder="State"
                      valueKey="stateId"
                      labelKey="stateName"
                      getOptionLabel={(option) => option["stateName"]}
                      getOptionValue={(option) => option["stateName"]}
                      className={`${
                        errors.statError ? "error-input-border" : ""
                      } `}
                    />
                    {errors.statError && (
                      <span className="errorMsg">Please select State</span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>
                      <i className="text-danger">*</i> City
                    </label>
                    <Select
                      value={city}
                      onChange={this.handleCity}
                      onBlur={() => this.onValidate("city")}
                      // isMulti
                      options={getCities}
                      name="city"
                      placeholder="City"
                      valueKey="cityId"
                      labelKey="cityName"
                      getOptionLabel={(option) => option["cityName"]}
                      getOptionValue={(option) => option["cityId"]}
                      // className={`${
                      //   errors.cityError ? "error-input-border" : ""
                      // } `}
                    />
                    {errors.cityError && (
                      <span className="errorMsg">Please select City</span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>
                      <i className="text-danger">*</i> Branch
                    </label>
                    <Select
                      value={branch}
                      onChange={this.handleBranch}
                      onBlur={() => this.onValidate("branch")}
                      isMulti
                      options={branchListData}
                      name="branch"
                      placeholder="Branch"
                      valueKey="branchCode"
                      labelKey="branchName"
                      getOptionLabel={(option) => option["branchName"]}
                      getOptionValue={(option) => option["branchCode"]}
                      className={`${
                        errors.branchError ? "error-input-border" : ""
                      } `}
                    />
                    {errors.branchError && (
                      <span className="errorMsg">Please select Branch</span>
                    )}
                  </div>

                  <div className="form-group col-md-4 mt-4">
                    <label>
                      <i className="text-danger">*</i> Pin Code
                    </label>
                    <input
                      type="text"
                      pattern="\d*"
                      maxLength="6"
                      className="form-input"
                      name="pinCode"
                      value={pinCode}
                      onChange={this.handlepinCode}
                      onBlur={this.handleValidate}
                      onInput={this.maxLengthCheck}
                      onKeyPress={this.restrictAlphabets}
                      placeholder="Enter Pin Code"
                      className={`form-input ${
                        errors.pinCodeError ? "error-input-border" : ""
                      } `}
                      id="pinCode"
                    />
                    {errors.pinCodeError && (
                      <span className="errorMsg">Please enter pinCode</span>
                    )}
                    {!errors.pinCodeError && errors.validpinCode && (
                      <span className="errorMsg">
                        Please Enter Valid pinCode
                      </span>
                    )}
                  </div>
                  <div className="form-group col-md-4 mt-4">
                    <label>
                      <i className="text-danger">*</i> Contact Name
                    </label>
                    <input
                      type="text"
                      pattern="\d*"
                      maxLength="100"
                      className="form-input"
                      name="name"
                      value={name}
                      onChange={this.handleContactName}
                      onBlur={this.handleValidate}
                      placeholder="Enter Contact Name"
                      className={`form-input ${
                        errors.nameError ? "error-input-border" : ""
                      } `}
                    />
                    {errors.nameError && (
                      <span className="errorMsg">
                        Please enter Contact Name
                      </span>
                    )}
                  </div>

                  <div className="form-group col-md-4  ">
                    <label className="mt-4">
                      <i className="text-danger">*</i> Mobile Number
                    </label>

                    <div class="inner-addon right-addon">
                      {mobileVerifyLoading && (
                        <i class="fa fa-spinner fa-spin"></i>
                      )}

                      <input
                        type="text"
                        pattern="\d*"
                        maxLength="10"
                        className="form-input"
                        name="mobileNO"
                        value={mobileNO}
                        onChange={this.handlemobile}
                        // onBlur={this.handleValidate}
                        onKeyPress={this.restrictAlphabets}
                        placeholder="Enter Mobile Number"
                        className={`form-input ${
                          errors.mobileNOError ? "error-input-border" : ""
                        } `}
                      />
                    </div>

                    {errors.mobileNOError && (
                      <span className="errorMsg">
                        Please enter Mobile Number
                      </span>
                    )}
                    {!errors.mobileNOError && isMobileNumberExist && (
                      <span className="errorMsg">
                        Mobile number already exist
                      </span>
                    )}
                    {!errors.mobileNOError && errors.invalidmobileNo && (
                      <span className="errorMsg">
                        Please enter valid Mobile Number
                      </span>
                    )}
                  </div>
                  <div className="form-group col-md-4 mt-3">
                    <label>
                      {" "}
                      <i className="text-danger">*</i> Email ID
                    </label>
                    <div class="inner-addon right-addon">
                      {emailVerifyLoading && (
                        <i class="fa fa-spinner fa-spin"></i>
                      )}
                      <input
                        type="text"
                        pattern="\d*"
                        maxLength="50"
                        className="form-input"
                        name="emailId"
                        value={emailId}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                        placeholder="Enter Email Address"
                        className={`form-input ${
                          errors.emailIdError ||
                          invalidemailId ||
                          errors.isEmailAddressExist
                            ? "error-input-border"
                            : ""
                        } `}
                      />
                    </div>
                    {errors.emailIdError && (
                      <span className="errorMsg">
                        Please enter Email Address
                      </span>
                    )}
                    {invalidemailId && (
                      <span className="errorMsg">
                        Please enter valid Email Address
                      </span>
                    )}
                    {errors.isEmailAddressExist && (
                      <span className="errorMsg">
                        {errors.isEmailAddressExist}
                      </span>
                    )}
                  </div>
                  <div className="form-group col-md-4 mt-3">
                    <label>
                      <i className="text-danger">*</i> Registered Address
                    </label>
                    <textarea
                      type="text"
                      pattern="\d*"
                      maxLength="700"
                      className="form-input"
                      name="permanantAddress"
                      value={permanantAddress}
                      onChange={(e) => {
                        if (e.target.value.length == 700)
                          toast.error("Please fill address in 700 Characters.");
                        this.handleRegisterAddress(e);
                      }}
                      // onBlur={this.handleValidate}
                      placeholder="Enter Registered Address"
                      disabled={getdis}
                      className={`form-input ${
                        errors.permanantAddressError ? "error-input-border" : ""
                      } `}
                      autocomplete="false"
                    />

                    {errors.permanantAddressError && (
                      <span className="errorMsg">
                        Please enter Registered Address
                      </span>
                    )}
                  </div>
                  <div className="col-md-4 mt-3">
                    <label>Communication Address</label>
                    <textarea
                      type="text"
                      pattern="\d*"
                      maxLength="700"
                      className="form-input"
                      name="communicationAddress"
                      value={
                        this.state.isSameRegisterAndCommunicationAddress ===
                        true
                          ? permanantAddress
                          : communicationAddress
                      }
                      onChange={this.handleCommunicationAddress}
                      placeholder="Enter Communication Address"
                      disabled={
                        this.state.isSameRegisterAndCommunicationAddress
                      }
                    />
                    <div className="d-flex align-items-center custom-checkbox cust-checkbox  mt-4">
                      <input
                        type="checkbox"
                        id="isSameRegisterAndCommunicationAddress"
                        checked={this.state.addressFlag}
                        onClick={this.isSameRegisterAndCommunicationAddress}
                        disabled={
                          permanantAddress == null ||
                          permanantAddress == "" ||
                          permanantAddress == undefined
                        }
                        style={{ width: 15, height: 15 }}
                      />
                      <label style={{ paddingLeft: 4 }}>
                        <span>Same as registered address</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
              <section className="tab-body mt-3 mb-3">
                <div className="row">
                  <h5 className="col-md-12 text-center mb-4">Bank Details</h5>
                  <div className="form-group col-md-4">
                    <label>
                      <i className="text-danger">*</i> Bank Account Name
                    </label>
                    <input
                      type="text"
                      pattern="\d*"
                      maxLength="100"
                      className="form-input"
                      name="accountName"
                      value={accountName}
                      onChange={this.BankAccountName}
                      onBlur={this.handleValidate}
                      placeholder="Enter Account Name"
                    />
                    {errors.accountNameError && (
                      <span className="errorMsg">
                        Please enter Account Name
                      </span>
                    )}
                  </div>

                  <div className="form-group col-md-4">
                    <label>
                      <i className="text-danger">*</i> Bank Name
                    </label>
                    <input
                      type="text"
                      pattern="\d*"
                      maxLength="100"
                      className="form-input"
                      name="bankName"
                      value={bankName}
                      onChange={this.handleBankName}
                      onBlur={this.handleValidate}
                      placeholder="Enter Bank Name"
                    />
                    {errors.bankNameError && (
                      <span className="errorMsg">Please enter Bank Name</span>
                    )}
                  </div>

                  <div className="form-group col-md-4">
                    <label>
                      {" "}
                      <i className="text-danger">*</i> Account Number
                    </label>
                    <input
                      type="number"
                      pattern="\d*"
                      maxLength="16"
                      className="form-input"
                      name="bankAccountNumber"
                      value={bankAccountNumber}
                      onKeyPress={this.restrictAlphabets}
                      onChange={(e) => {
                        if (e.target.value.toString().length <= 16)
                          this.handleAccountNumber(e);
                      }}
                      onBlur={this.blurAccountNumber}
                      placeholder="Enter Account Number"
                      className={`form-input ${
                        errors.bankAccountNumberError
                          ? "error-input-border"
                          : ""
                      } `}
                    />
                    {errors.bankAccountNumberError && (
                      <span className="errorMsg">
                        Please enter Account Number
                      </span>
                    )}
                    {!errors.bankAccountNumberError &&
                      errors.validAccountNumber && (
                        <span className="errorMsg">
                          Account number should be between 9 to 16.
                        </span>
                      )}
                  </div>

                  <div className="form-group col-md-4">
                    <label>
                      <i className="text-danger">*</i> IFSC Code
                    </label>
                    <input
                      type="text"
                      pattern="\d*"
                      maxLength="11"
                      className="form-input"
                      name="ifscCode"
                      value={ifscCode}
                      onChange={(e) => {
                        let regex =/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
                        if (e.target.value.match(regex) == null)
                          this.handleifsc(e);
                      }}
                      onBlur={this.handleValidate}
                      placeholder="Enter IFSC Code"
                      className={`form-input ${
                        errors.ifscCodeError ? "error-input-border" : ""
                      } `}
                    />
                    {errors.ifscCodeError && (
                      <span className="errorMsg">Please enter IFSC Code</span>
                    )}
                    {!errors.ifscCodeError && errors.invalidifscCode && (
                      <span className="errorMsg">
                        Please enter valid IFSC Code
                      </span>
                    )}
                  </div>
                  {gstShow && (
                    <React.Fragment>
                      <div className="form-group col-md-4">
                        <label>
                          <i className="text-danger">*</i> HSN Code
                        </label>
                        <input
                          type="text"
                          pattern="\d*"
                          maxLength="20"
                          className="form-input"
                          name="hsnCode"
                          value={hsnCode}
                          onChange={this.handleChange}
                          onBlur={this.handleValidate}
                          onKeyPress={this.restrictAlphabets}
                          placeholder="Enter HSN Code"
                          disabled
                          className={`form-input ${
                            errors.hsnCodeError ? "error-input-border" : ""
                          } `}
                        />
                        {errors.hsnCodeError && (
                          <span className="errorMsg">
                            Please enter HSN Code
                          </span>
                        )}
                      </div>
                      <div className="form-group col-md-4">
                        <label>
                          <i className="text-danger">*</i> State Code
                        </label>
                        <input
                          type="number"
                          pattern="\d*"
                          maxLength="20"
                          className="form-input"
                          name="stateCode"
                          value={stateCode}
                          onChange={this.handleChange}
                          onBlur={this.handleValidate}
                          placeholder="Enter State Code"
                          disabled
                          className={`form-input ${
                            errors.stateCodeError ? "error-input-border" : ""
                          } `}
                        />
                        {errors.stateCodeError && (
                          <span className="errorMsg">
                            Please enter State Code
                          </span>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </section>
              <section className="tab-body mt-3 mb-3">
                <div className="row">
                  <h5 className="col-md-12 text-center mb-4">
                    Upload Document
                  </h5>
                  <div className="col-md-4">
                    <label>
                      <i className="text-danger">*</i> Upload PAN
                    </label>
                    <ImageUploader
                      name="panCard"
                      withIcon={true}
                      withPreview={true}
                      withLabel={true}
                      accept="image/*"
                      buttonText="Upload PAN"
                      onChange={(file, base64) => {
                        this.onDrop(file, base64, "panCard");
                      }}
                      imgExtension={[".jpg", ".gif", ".png", ".jpeg", ".pdf"]}
                      maxFileSize={5242880}
                    />

                    {errors.panCardError && (
                      <span className="errorMsg">Please upload Pan</span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>
                      <i className="text-danger">*</i> Upload Aadhaar
                    </label>
                    <ImageUploader
                      name="adhaar"
                      withIcon={true}
                      withPreview={true}
                      withLabel={true}
                      max={4}
                      accept="image/*"
                      buttonText="Upload Aadhaar"
                      onChange={(file, base64) => {
                        this.onDrop(file, base64, "adhaar");
                      }}
                      fileTypeError="is not supported file extension"
                      imgExtension={[".jpg", ".gif", ".png", ".jpeg", ".pdf"]}
                      maxFileSize={5242880}
                    />

                    {errors.adhaarError && (
                      <span className="errorMsg">Please upload Aadhaar</span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>
                      <i className="text-danger">*</i> Upload Shopact
                    </label>
                    <ImageUploader
                      name="shopact"
                      withIcon={true}
                      withPreview={true}
                      withLabel={true}
                      name
                      accept="image/*"
                      buttonText="Upload Shopact"
                      onChange={(file, base64) => {
                        this.onDrop(file, base64, "shopact");
                      }}
                      fileTypeError="is not supported file extension"
                      imgExtension={[".jpg", ".gif", ".png", ".jpeg", ".pdf"]}
                      maxFileSize={5242880}
                    />
                    {errors.shopactError && (
                      <span className="errorMsg">Please upload Shopact</span>
                    )}
                  </div>
                  <div className="col-md-4 mt-4">
                    <label>
                      <i className="text-danger">*</i> Upload Cancelled Cheque
                    </label>
                    <ImageUploader
                      id="cancelcheque"
                      withIcon={true}
                      withPreview={true}
                      withLabel={true}
                      accept="image/*"
                      buttonText="Upload Cancelled Cheque"
                      onChange={(file, base64) => {
                        this.onDrop(file, base64, "cancelcheque");
                      }}
                      fileTypeError="is not supported file extension"
                      imgExtension={[".jpg", ".gif", ".png", ".jpeg", ".pdf"]}
                      maxFileSize={5242880}
                      name="cancelcheque"
                    />
                    {errors.cancelchequeError && (
                      <span className="errorMsg">
                        Please upload Cancelled Cheque
                      </span>
                    )}
                  </div>
                  <div className="col-md-4 mt-4">
                    <label>
                      <i className="text-danger">*</i> Upload Profile Picture
                    </label>
                    <ImageUploader
                      name="profilePicture"
                      withIcon={true}
                      withPreview={true}
                      withLabel={true}
                      accept="image/*"
                      buttonText="Upload Profile Picture"
                      onChange={(file, base64) => {
                        this.onDrop(file, base64, "profilePicture");
                      }}
                      fileTypeError="is not supported file extension"
                      imgExtension={[".jpg", ".gif", ".png", ".jpeg", ".pdf"]}
                      maxFileSize={5242880}
                    />
                    {errors.profilePictureError && (
                      <span className="errorMsg">
                        Please upload Profile Picture.
                      </span>
                    )}
                  </div>
                  <div className="col-md-4 mt-4">
                    <label>
                      <i className="text-danger">*</i> Upload Agreement
                    </label>
                    <ImageUploader
                      name="aggrement"
                      withIcon={true}
                      withPreview={true}
                      withLabel={true}
                      accept="image/*"
                      buttonText="Upload Agreement"
                      onChange={this.onDrop}
                      fileTypeError="is not supported file extension"
                      imgExtension={[".jpg", ".gif", ".png", ".jpeg", ".pdf"]}
                      maxFileSize={5242880}
                      onChange={(file, base64) => {
                        this.onDrop(file, base64, "aggrement");
                      }}
                    />
                    {errors.aggrementError && (
                      <span className="errorMsg">Please upload Agreement</span>
                    )}
                  </div>

                  <p className="mt-5" style={{ color: "black" }}>
                    <i className="text-danger">*</i>Upload documents in jpg,
                    jpeg, png or gif format with Maximum size up to 5 MB
                  </p>
                </div>
              </section>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-danger" onClick={this.close}>
              Cancel
            </Button>
            <Button
              className="btn-success"
              onClick={this.handleSubmit}
              disabled={
                isMobileNumberExist || loading || panStatus != "success"
                  ? true
                  : false
              }>
              {this.props.editObj ? (
                "Update"
              ) : loading ? (
                <React.Fragment>
                  <i class="fa fa-spinner fa-spin"></i>
                  Creating...
                </React.Fragment>
              ) : (
                "Add"
              )}
            </Button>
            {/* <Button className="btn-success" onClick={this.GetAllCitiesData}>
              {this.props.editObj ? "Update" : "Create"}
            </Button> */}
          </Modal.Footer>
        </Modal>
        <CloseSection
          show={this.state.showInner}
          button2={this.close}
          button1={this.handleClose}
          title="Do you want to close ?"
        />
      </div>
    );
  }
}

export default withRouter(DsaMakerForm);
