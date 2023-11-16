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
  getDsaByUniqueId,
  uploadDoc,
} from "../../Utils/dsa";
import { AddUser } from "../../Utils/management";
import { cloneDeep } from "lodash";
import JSZip from "jszip";
import { BranchList } from "../../Utils/management";
import Select from "react-select";
import ImageUploader from "react-images-upload";
// import { toast } from "react-toastify";
import moment from "moment";
import { CloseSection } from "../../Components/Assets/CloseSection";
import {frontEndUrl} from "../../Utils/httpInterceptor";
import { toast, ToastContainer } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export class DsaMakerForm extends Component {
  state = {
    show: false,
    status: null,
    company: null,
    companyName: null,
    gst: null,
    companyPan: null,
    stat: null,
    city: "",
    branch: null,
    startDate: "",
    DOJ: "",
    address: [],
    DSAData: [],
    dsaBranch: [],
    savetoaster: false,
    contactName: "",
    remark: "",
    phoneNumber: "",
    emailId: "",
    bankName: "",
    bankAccountName: "",
    bankAccountno: "",
    ifscCode: "",
    hsncode: "",
    statecode: "",
    pan: "",
    mapMessage: "",
    permanantAddress: "",
    communicationAddress: "",
    DSAData: [],
    pinCode: "",
    GstDetails: [],
    GSTAddress: [],
    getState: [],
    getCities: [],
    branchListData: [],
    CompanytypeOption: [],
    aggrement: [],
    // aggrement: [],
    profilePicture: [],
    cancelcheque: [],
    shopact: [],
    adhaar: [],
    panCard: [],
    showInner: false,
    addressFlag: null,
    discommunication: null,
    gstNumber: null,
    errors: {
      TypeOfCompanyError: false,
      PanNumberError: false,
      dateOfBirthError: false,
      bankAccountnoError: false,
      statError: false,
      cityError: false,
      branchError: false,
      pinCodeError: false,
      contactNameError: false,
      mobileNOError: false,
      emailIdError: false,
      permanantAddressError: false,
      accountNameError: false,
      bankNameError: false,
      ifscCodeError: false,
      isMobileNumberExist: false,
      isEmailAddressExist: false,
      validAccountNumber: false,
      validAccountNameError: false,
      validBankNameError: false,
      validRemarkError: false,
      invalidifscCode: false,
      remarkError: false,
      invalidpinCode: false,
      mappedDSA: false,
    },
    isSameRegisterAndCommunicationAddress: false,
    ONHOLD: false,
    REJECTED: false,
    APPROVED: false,
    verifyObj: "",
  };

  componentDidMount() {
    let { errors } = this.state;
    document.body.style.position = "fixed";
    document.body.style.top = `-${window.scrollY}px`;
    this.handleShow();
    this.handleStatus();
    this.handleName();
    this.handleGST();
    this.getAllBranchList();
    this.setState({ errors: { ...errors, cityError: false } });
    this.GetCompanyListData();
    this.GetAllCitiesData();
    this.GetallStateData();
    if (this.props.verifyObj) {
      this.getDsalistByDSacode();
    }
    this.getDsalistByDSacode();
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
    if (!close) this.close();
    this.setState({ show: false });
    this.props.addDsa();
    document.body.style.position = "";
    document.body.style.top = "";
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCommunicationAddress = (e) => {
    let { errors, Data } = this.state;
    let { name, value } = e.target;
    this.setState({ Data: { ...Data, [name]: value } });
  };

  handleifsc = (e) => {
    let { Data, errors } = this.state;
    let { name, value } = e.target;
    if (value.trim() == "") {
      errors = { ...errors, ifscCodeError: true };
    } else {
      errors = { ...errors, ifscCodeError: false };
    }
    this.setState({
      Data: { ...Data, [e.target.name]: e.target.value.toUpperCase() },
      errors: errors,
    });
  };

  handleBankName = (e) => {
    let { errors, Data } = this.state;
    let { name, value } = e.target;

    if (e.target.value.trim() == "") {
      errors = { ...errors, bankNameError: true };
    } else {
      errors = { ...errors, bankNameError: false };
    }
    this.setState({
      Data: { ...Data, [name]: value.replace(/[^a-zA-Z ]/g, "") },
      errors,
    });
  };

  BankAccountName = (e) => {
    let { errors, Data } = this.state;
    let { name, value } = e.target;
    if (e.target.value.trim() == "") {
      errors = { ...errors, bankAccountNameError: true };
    } else {
      errors = { ...errors, bankAccountNameError: false };
    }
    this.setState({
      Data: { ...Data, [name]: value.replace(/[^a-zA-Z ]/g, "") },
      errors,
    });
  };

  handleContactName = (e) => {
    let { Data, errors } = this.state;
    if (e.target.value.trim() == "") {
      errors = { ...errors, contactNameError: true };
    } else {
      errors = { ...errors, contactNameError: false };
    }
    this.setState({
      Data: { ...Data, contactName: e.target.value.replace(/[^a-zA-Z ]/g, "") },
      errors: errors,
    });
  };

  handlePinCode = (e) => {
    let { Data, errors } = this.state;
    let { name, value } = e.target;
    if (
      value.trim() == "" ||
      (value && value.length !== 6) ||
      value == "000000"
    ) {
      errors = { ...errors, pinCodeError: true, invalidpinCode: true };
    } else {
      errors = { ...errors, pinCodeError: false, invalidpinCode: false };
    }
    this.setState({
      Data: { ...Data, [e.target.name]: e.target.value },
      errors: errors,
    });
  };

  handleStatus = (company) => {
    this.setState({ company });
  };

  handleName = (companyName) => {
    this.setState({ companyName });
  };



  handlestateName = (stat) => {
    let { Data, errors } = this.state;
    this.setState(
      {
        Data: { ...Data, stateId: stat.stateId, cityId: null },
        errors: { ...errors, cityError: true },
      },
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
    let { Data } = this.state;
    this.setState({ Data: { ...Data, cityId: city.cityId } });
  };
  // handleGST = (gst) => {
  //   this.setState({ gst }, () => this.GSTAddressDetails());
  // };

   handleGST = (gstNumber) => {
    this.setState({ gstNumber });
  };

  handleBranch = (branch) => {
    let { Data, errors } = this.state;
    let dsaBranchMapping = [];
    
    if (branch != "" && branch != null && branch != undefined) {
      branch.map((res) => {
        dsaBranchMapping.push({
          createdBy: "NP07111912",
          updatedBy: "NP07111912",
          employeeId: Data && Data.applicationNumber,
          branchCode: res.branchCode,
          id: res.id
          // id: 0
        });
      });
    }

    this.setState(
      { Data: { ...Data, dsaBranchMapping } },

      () => (this.onValidate("branch"), this.CheckMappedDSA())
    );

    if (branch === "" || branch === null || branch === undefined) {
      this.setState({ errors: { ...errors, branchError: true } });
    } else {
      this.setState({ errors: { ...errors, branchError: false } });
    }
  };

  CheckMappedDSA = () => {
    let { errors, mappedDSA, Data, dsaBranchMapping, branch } = this.state;
    let branchCodes = [];
    if (Data.dsaBranchMapping.length !== 0) {
      Data &&
        Data.dsaBranchMapping.map((res) => {
          branchCodes.push(res.branchCode);
        });
      let obj = {
        employeeId: Data && Data.dsacode,
        branchCodes: branchCodes,
      };
    }
  };

  handleRemark = (e) => {
      let { errors, Data } = this.state;
      let { name, value } = e.target;
    // this.setState({ status });
    if (e.target.value.trim() == "") {
      errors = { ...errors, remarkError: true };
    } else {
      errors = { ...errors, remarkError: false };
    }
    this.setState({
      Data: { ...Data, [name]: value.replace(/[^a-zA-Z ]/g, "") },
      errors,
    });
  };

  handlePan = (e) => {
    this.setState({
      companyPan: e.target.value,
    });
  };

  handleAccountNumber = (e) => {
    let { errors, Data } = this.state;
    let { name, value } = e.target;
    if (value.trim() == "" || value == "0000000000000000") {
      this.setState({
        errors: { ...errors, bankAccountnoError: true },
      });
    } else {
      this.setState({
        errors: { ...errors, bankAccountnoError: false },
      });
    }
    this.setState({ Data: { ...Data, [name]: value } });
  };

  restrictAlphabets = (e) => {
    const regx = "^[0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  getDsalistByDSacode = () => {
    let { errors, savetoaster } = this.state;
    getDsaByUniqueId(this.props.verifyObj && this.props.verifyObj).then(
      (response) => {
        if (this.props.dsaModule) {
          errors = { ...errors, remark: false };
        }
        let Data = response.data.data && response.data.data;
        savetoaster = Data && Data.status == "APPROVED" ? true : false;
        this.setState({ Data, errors: errors, savetoaster }, () => {
          this.PanDetailData();
          // this.GSTData();
          this.GetallStateData();
        });
      }
    );
  };

  PanDetailData = () => {
    const { companyPan } = this.state;
    let obj = { panNumber: "AAACG7496H", dateOfInc: "08/10/1973" };
    PanDetails(obj).then((response) => {
      if (response.data && response.data.error === false) {
        this.setState({
          pan:
            response.data && response.data.data
              ? response.data.data.panName
              : [],
        });
      }
    });
  };

  // GSTData = () => {
  //   let objs = { panNumber: this.state.companyPan };
  //   GstNumber(objs).then((response) => {
  //     if (response.data && response.data.error === true) {
  //       this.setState({
  //         GstDetails:
  //           response.data && response.data.data ? response.data.data : [],
  //       });
  //     }
  //   });
  // };

  GetCompanyListData = () => {
    let categoryid = 2;
    getCompanytypeList(categoryid).then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          CompanytypeOption:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  Companyvalue = () => {
    const { CompanytypeOption } = this.state;
  };

  // GSTAddressDetails = () => {
  //   const { gst } = this.state;
  //   let ojbts = { gstNumber: gst && gst.gstNo };
  //   Gstaddress(ojbts).then((response) => {
  //     if (response.data && response.data.error === "false") {
  //       this.setState({
  //         GSTAddress:
  //           response.data && response.data.data ? response.data.data : [],
  //       });
  //     }
  //   });
  // };

  GetallStateData = () => {
    getAllState().then((response) => {
      if (response.data && response.data.error === false) {
        this.setState(
          {
            getState:
              response.data && response.data.data ? response.data.data : [],
          },
          () => {
            this.GetAllCitiesData();
          }
        );
      }
    });
  };

  GetAllCitiesData = () => {
    const { Data, getState, errors } = this.state;
    let stateName = "";

    getState.map((res) => {
      if (res.stateId == (Data && Data.stateId)) {
        stateName = Data && Data.stateId;
      }
    });
    getAllCities(stateName).then((response) => {
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

  handleSubmit = (formStatus) => {
    const { errors, Data, branch, dsaBranch, savetoaster } = this.state;
    let isAdd = true;
    let errField = "";
    for (var val in errors) {
      if (errors[val] === null || errors[val]) {
        errors[val] = true;
        isAdd = false;
        if (errors[val] == true) {
          errField = val;
        }
      }
    }

    this.setState({ errors: { ...this.state.errors } });

    Data.status = formStatus;
    delete Data.isSameRegisterAndCommunicationAddress;
    Data.remarkFlag = "False";

    if (isAdd) {
      this.setState({ [formStatus]: true });
      let obj = cloneDeep(Data);
      delete obj.document;

      AddDSA(obj).then((response) => {
        if (response.data && response.data.error === false) {
          console.log("------------------")
          this.ImageConverToZipAndUpload(response.data.data.applicationNumber);
          this.props.fetchDsa();
          console.log("response.data.message-->", response.data.message)
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 5000,
          });
          if (formStatus == "APPROVED") {
            console.log("APPROVED")
            toast.success("DSA has been Approved Sucessfully", {
              type: toast.TYPE.SUCCESS,
              autoClose: 5000,
            });

            //Add User
            if (isAdd && formStatus == "APPROVED") {
              console.log("addUser")
              let userObj = {
                userName: Data && Data.emailId,
                status: "ACTIVE",
                employeeId: response.data.data && response.data.data.dsacode,
                employeeName:
                  response.data.data && response.data.data.companyName,
                mobileNo: Data && Data.phoneNumber,
                role: {
                  roleId: 130017,
                  roleName: "DSA",
                  description: "perform all activities",
                },
              };
              AddUser(userObj).then((response) => {
              });
            }

            // END user
          } 
          else if (formStatus == "APPROVED") {
            console.log("app")
            // this.setState({ Data: { ...Data, statusFlag: "true" } });
            toast.success("DSA has been Saved Sucessfully", {
              // type: toast.TYPE.SUCCESS,
               autoClose: 5000,
            });
          } else if (formStatus == "REJECTED") {
            console.log("rej")
            toast.success("DSA has been Rejected Sucessfully", {
              // type: toast.TYPE.SUCCESS,
               autoClose: 5000,
            });
          } else if (formStatus == "ONHOLD") {
            console.log("onHold")
            toast.success("DSA has been Put On Hold Successfully", {
              // type: toast.TYPE.SUCCESS,
               autoClose: 5000,
            });
          }
        }
        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 4000,
          });
        }
        this.setState({ [formStatus]: false });
      });
    }
  };

  handleValidate = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } }, () => {
      });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }

    if (name == "bankAccountName") {
      let regex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (value && !value.match(regex)) {
        this.setState({
          errors: { ...errors, validAccountNameError: true },
        });
      } else {
        this.setState({
          errors: { ...errors, validAccountNameError: false },
        });
      }
    }

    if (name === "bankAccountno") {
      if (
        (e.target.value.trim().length == 9 ||
          e.target.value.trim().length > 9) &&
        (e.target.value.trim().length == 16 ||
          e.target.value.trim().length < 16)
      ) {
        this.setState({
          errors: { ...errors, validAccountNumber: false },
        });
      } else {
        this.setState({ errors: { ...errors, validAccountNumber: true } });
      }
    }

    if (name === "pinCode") {
      if ((value && value.length !== 6) || (value && value == "000000")) {
        this.setState({ eroors: { ...errors, invalidpinCode: true } });
      } else {
        this.setState({ errors: { ...errors, invalidpinCode: false } });
      }
    }

    if (name == "bankName") {
      let regex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
      if (value && !value.match(regex)) {
        this.setState({
          errors: { ...errors, validBankNameError: true },
        });
      } else {
        this.setState({
          errors: { ...errors, validBankNameError: false },
        });
      }
    }

      if (name == "remark") {
        let regex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
        if (value && !value.match(regex)) {
          this.setState({
            errors: { ...errors, validRemarkError: true },
          });
        } else {
          this.setState({
            errors: { ...errors, validRemarkError: false },
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
      if (value && value.length < 10) {
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
      var reg = /^[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/;
      var pan = {
        C: "Company",
        P: "Personal",
        H: "Hindu Undivided Family (HUF)",
        F: "Firm",
        A: "Association of Persons (AOP)",
        T: "AOP (Trust)",
        B: "Body of Individuals 		(BOI)",
        L: "Local Authority",
        J: "Artificial Juridical Person",
        G: "Govt",
      };
      pan = pan[pan_value[3]];
      let company = "";
      if (this.state.company.id == "4") {
        company = "C";
      } else if (this.state.company.id == "5") {
        company = "P";
      } else if (this.state.company.id == "6") {
        company = "H";
      } else if (this.state.company.id == "7") {
        company = "A";
      } else if ((this.state.company.id = "8")) {
        company = "L";
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
      let verifiedPan = "[A-Z]{3}([CHFATBLJGP])(?:(?<=P)" + "|(?<!P)" + ")[0-9]{4}[A-Z]";
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
      if (value && value.length < 10) {
        this.setState({
          invalidmobileNo: true,
        });
      } else {
        this.setState(
          {
            invalidmobileNo: false,
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

    if (name === "ifscCode") {
      this.setState({
        errors: { ...this.state.errors, ifscCodeError: true },
      });
      if (value.trim() == "") {
      } else {
        this.setState({
          errors: { ...this.state.errors, ifscCodeError: false },
        });
      }
      let verifyIfsc = "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$";
      if (value && !value.match(verifyIfsc)) {
        this.setState({
          errors: { ...this.state.errors, invalidifscCode: true },
        });
      } else {
        this.setState({
          errors: { ...this.state.errors, invalidifscCode: false },
        });
      }
    }
  };

  Remark = (e) => {
    let { errors, Data } = this.state;
    let { name, value } = e.target;
    this.setState({ Data: { ...Data, [name]: value } });
  };

  onValidate = (name) => {
    const { DOB, branch, gst, errors, company, stat, city, Data } = this.state;
    if (name === "DOB") {
      if (DOB === "" || DOB === null || DOB === undefined) {
        this.setState({ errors: { ...errors, dateOfBirthError: true } });
      } else {
        this.setState({
          errors: { ...errors, dateOfBirthError: false },
        });
      }
    }
    if (name === "branch") {
      if (
        Data.dsaBranchMapping === "" ||
        Data.dsaBranchMapping === null ||
        Data.dsaBranchMapping === undefined ||
        (Data.dsaBranchMapping && Data.dsaBranchMapping.length === 0)
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

  handleRegisterAddress = (e) => {
    let { errors, Data } = this.state;
    let { name, value } = e.target;
    if (value.trim() == "") {
      errors = { ...errors, permanantAddressError: true };
    } else {
      errors = { ...errors, permanantAddressError: false };
    }
    this.setState({ Data: { ...Data, [name]: value }, errors: errors });
  };

  isSameRegisterAndCommunicationAddress = () => {
    let { isSameRegisterAndCommunicationAddress, Data } = this.state;
    let { permanantAddress, communicationAddress, addressFlag } = Data;
    this.setState({
      Data: {
        ...Data,
        addressFlag: !addressFlag,
      },
    });
    if (!addressFlag) {
      this.setState({
        Data: {
          ...Data,
          communicationAddress: permanantAddress,
          addressFlag: true,
        },
      });
    } else {
      this.setState({
        Data: {
          ...Data,
          communicationAddress: "",
          addressFlag: false,
        },
      });
    }
  };

  onDrop = (file, picture, name) => {
    let { errors } = this.state;
    if (picture.length > 6) {
      errors = { ...errors, [name + "Error"]: true };
    } else {
      errors = { ...errors, [name + "Error"]: false };
    }
    this.setState({ [name]: file, errors: errors });
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
      uploadDoc(userDoc, formData).then((res) => {
        _this.handleClose(true);
      });
      //saveAs(content, `${uniqueId}.zip`);
    });
  };

  close = (close) => {
    this.setState({ showInner: !this.state.showInner });
  };

  render() {
    const {
      company,
      show,
      getState,
      getCities,
      branchListData,
      GstDetails,
      CompanytypeOption,
      Data,
      errors,
      ONHOLD,
      REJECTED,
      APPROVED,
    } = this.state;

    let companyObj = {};
    let gstObj = {};
    let statObj = {};
    let cityObj = {};
    let formStatus = "";
    let selectedBranch = [];
    let dateField = "";
    if (Data) {
      Data.dsaBranchMapping &&
        Data.dsaBranchMapping.map((res) => {
          branchListData.map((list) => {
            if (res.branchCode.toLowerCase() == list.branchCode.toLowerCase()) {
              selectedBranch.push(list);
            }
          });
        });
      Data.companyType &&
        CompanytypeOption.map((res) => {
          if (res.productId == Data.companyType) {
            companyObj = res;
          }
        });
      // Data.gstNumber &&
      //   GstDetails.map((res) => {
      //     if (res.gstNo == Data.gstNumber) {
      //       gstObj = res;
      //     }
      //   });
      Data.cityId &&
        getCities.map((res) => {
          if (res.cityId == Data.cityId) {
            cityObj = res;
          }
        });
      Data.stateId &&
        getState.map((res) => {
          if (res.stateId == Data.stateId.toString()) {
            statObj = res;
          }
        });
      dateField = moment(Data && Data.dateOfBirth).format("YYYY-MM-DD");
    }
    if (this.props.status == "APPROVALPENDING") {
      formStatus = "APPROVAL PENDING";
    } else if (this.props.status == "ONHOLD") {
      formStatus = "On Hold";
    } else if (this.props.status == "REJECTED") {
      formStatus = "REJECTED";
    } else if (this.props.status == "APPROVED") {
      formStatus = "APPROVED";
    }


    return (
      <React.Fragment>
        <div className="disable-div">
          <ToastContainer autoClose={5000} closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover/>
          <Modal
            className="add-user"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show && show}
            onHide={() => {
              this.close();
            }}>
            <Modal.Header closeButton>
              <Modal.Title className="w-100">
                DSA FORM
                <span className="right"> {`${formStatus}`} </span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              className={`p-4 ${
                REJECTED || APPROVED || ONHOLD ? "disable-div" : null
              }`}
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
                        value={companyObj}
                        onChange={this.handleStatus}
                        name="company"
                        options={CompanytypeOption}
                        placeholder="Type Of Comapny"
                        valueKey="id"
                        labelKey="subcatType"
                        getOptionLabel={(option) => option["subcatType"]}
                        getOptionValue={(option) => option["id"]}
                        isDisabled={true}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label>
                        <i className="text-danger">*</i> Company Pan Number
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="companyPan"
                        value={Data && Data.companyPan}
                        onChange={this.handlePan}
                        onBlur={this.handleValidate}
                        placeholder="PAN Number"
                        disabled
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label>
                        {" "}
                        <i className="text-danger">*</i>
                        {company && company.id
                          ? "Date Of Birth"
                          : "Date Of Incorporation"}
                      </label>
                      <br />
                      <input
                        type="date"
                        className="form-input"
                        name="DOJ"
                        value={Data && dateField}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                        placeholder="Date Of Birth / Date Of Incorporation"
                        disabled
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>
                        <i className="text-danger">*</i> Company Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="companyName"
                        value={Data && Data.companyName}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                        placeholder="Enter Company Name"
                        disabled
                      />
                    </div>
                    {Data && Data.gstStatus == "true" && (
                      <React.Fragment>
                        <div className="col-md-4">
                          <label>
                            <i className="text-danger">*</i> GST
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            name="gst"
                            value={Data && Data.gstNumber}
                            onChange={this.handleChange}
                            onBlur={this.handleValidate}
                            placeholder="Enter Company Name"
                            disabled
                          />
                        </div>
                      </React.Fragment>
                    )}
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
                        value={statObj}
                        onChange={this.handlestateName}
                        options={getState}
                        placeholder="State"
                        valueKey="stateId"
                        labelKey="stateName"
                        getOptionLabel={(option) => option["stateName"]}
                        getOptionValue={(option) => option["stateId"]}
                        isDisabled={this.props.status === "REJECTED"}
                      />
                      {/* } */}
                    </div>
                    <div className=" col-md-4">
                      <label>
                        <i className="text-danger">*</i> City
                      </label>
                      <Select
                        value={cityObj}
                        onChange={this.handleCity}
                        options={getCities}
                        placeholder="City"
                        valueKey="city_id"
                        labelKey="name"
                        getOptionLabel={(option) => option["cityName"]}
                        getOptionValue={(option) => option["cityId"]}
                        isDisabled={this.props.status === "REJECTED"}
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
                        value={selectedBranch}
                        onChange={this.handleBranch}
                        isMulti
                        onBlur={() => this.onValidate("branch")}
                        options={branchListData}
                        name="branch"
                        placeholder="Branch"
                        valueKey="branchCode"
                        labelKey="branchname"
                        getOptionLabel={(option) => option["branchName"]}
                        getOptionValue={(option) => option["branchCode"]}
                        className={`${
                          errors.branchError ? "error-input-border" : ""
                        } `}
                        isDisabled={this.props.status === "REJECTED"}
                      />
                      {errors.branchError && (
                        <span className="errorMsg">Please select Branch</span>
                      )}
                      {!errors.branchError && errors.mappedDSA && (
                        <span className="errorMsg">
                          {this.state.mapMessage}
                        </span>
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
                        value={Data && Data.pinCode}
                        onChange={(e) => {
                          this.handlePinCode(e);
                        }}
                        onBlur={this.handleValidate}
                        onKeyPress={this.restrictAlphabets}
                        placeholder="Enter Pin Code"
                        className={`form-input ${
                          errors.pinCodeError || errors.invalidpinCode
                            ? "error-input-border"
                            : ""
                        } `}
                        // readOnly={this.props.status === "REJECTED"}
                        disabled={this.props.status === "REJECTED"}
                      />
                      {errors.pinCodeError && (
                        <span className="errorMsg">Please enter Pin Code</span>
                      )}
                      {!errors.pinCodeError && errors.invalidpinCode && (
                        <span className="errorMsg">
                          Please Enter Valid Pincode
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
                        name="contactName"
                        value={Data && Data.contactName}
                        onChange={this.handleContactName}
                        onBlur={this.handleValidate}
                        placeholder="Enter Contact Name"
                        className={`form-input ${
                          errors.contactNameError ? "error-input-border" : ""
                        } `}
                        disabled={this.props.status === "REJECTED"}
                      />
                      {errors.contactNameError && (
                        <span className="errorMsg">
                          Please enter Contact Name.
                        </span>
                      )}
                    </div>
                    <div className=" col-md-4 mt-4">
                      <label>
                        <i className="text-danger">*</i> Mobile Number
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        name="phoneNumber"
                        maxLength="10"
                        value={Data && Data.phoneNumber}
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                        placeholder="Enter Mobile Number"
                        disabled
                      />
                    </div>
                    <div className="form-group col-md-4 mt-4">
                      <label>
                        {" "}
                        <i className="text-danger">*</i> Email ID
                      </label>
                      <input
                        type="email"
                        pattern="\d*"
                        maxLength="50"
                        className="form-input"
                        value={Data && Data.emailId}
                        name="emailId"
                        onChange={this.handleChange}
                        onBlur={this.handleValidate}
                        placeholder="Enter Email Address"
                        disabled
                      />
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
                        value={Data && Data.permanantAddress}
                        onChange={(e) => {
                          if (e.target.value.length == 700)
                            toast.error(
                              "Please fill Address in 700 Characters."
                            );
                          this.handleRegisterAddress(e);
                        }}
                        onBlur={this.handleValidate}
                        placeholder="Enter Register Address"
                        disabled={
                          this.props.status === "REJECTED" ||
                          (Data && Data.gstStatus == "true" && true)
                        }
                        className={`form-input ${
                          errors.permanantAddressError
                            ? "error-input-border"
                            : ""
                        } `}
                      />
                      {errors.permanantAddressError && (
                        <span className="errorMsg">
                          Please enter Registered Address
                        </span>
                      )}
                    </div>
                    <div className="form-group col-md-4 mt-3">
                      <label>Communication Address</label>
                      <textarea
                        type="text"
                        pattern="\d*"
                        maxLength="700"
                        className="form-input"
                        name="communicationAddress"
                        value={
                          Data && Data.addressFlag == true
                            ? Data && Data.permanantAddress
                            : Data && Data.communicationAddress
                        }
                        onChange={this.handleCommunicationAddress}
                        placeholder="Enter Communication Address"
                        // disabled={discommunication === true ? true : false}
                        disabled={Data && Data.addressFlag}
                      />
                      <div className="d-flex align-items-center custom-checkbox cust-checkbox  mt-4">
                        <input
                          type="checkbox"
                          id="isSameRegisterAndCommunicationAddress"
                          checked={Data && Data.addressFlag}
                          onClick={this.isSameRegisterAndCommunicationAddress}
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
                        name="bankAccountName"
                        value={Data && Data.bankAccountName}
                        onChange={this.BankAccountName}
                        onBlur={this.handleValidate}
                        placeholder="Enter Account Name"
                        className={`form-input ${
                          errors.bankAccountNameError
                            ? "error-input-border"
                            : ""
                        } `}
                        disabled={this.props.status === "REJECTED"}
                      />
                      {errors.bankAccountNameError && (
                        <span className="errorMsg">
                          Please enter Bank Account Name
                        </span>
                      )}
                      {!errors.bankAccountNameError &&
                        errors.validAccountNameError && (
                          <span className="errorMsg">
                            Account Name should be in character.
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
                        value={Data && Data.bankName}
                        onChange={this.handleBankName}
                        onBlur={this.handleValidate}
                        placeholder="Enter Bank Name"
                        className={`form-input ${
                          errors.bankNameError || errors.validBankNameError
                            ? "error-input-border"
                            : ""
                        } `}
                        disabled={this.props.status === "REJECTED"}
                      />
                      {errors.bankNameError && (
                        <span className="errorMsg">
                          Please enter Bank Name.
                        </span>
                      )}
                      {!errors.bankNameError && errors.validBankNameError && (
                        <span className="errorMsg">
                          Bank Name should be in character.
                        </span>
                      )}
                    </div>
                    <div className="form-group col-md-4">
                      <label>
                        {" "}
                        <i className="text-danger">*</i> Account Number
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        name="bankAccountno"
                        value={Data && Data.bankAccountno}
                        onChange={(e) => {
                          if (e.target.value.toString().length <= 16)
                            this.handleAccountNumber(e);
                        }}
                        onBlur={this.handleValidate}
                        onKeyPress={this.restrictAlphabets}
                        placeholder="Enter Bank Account Number"
                        className={`form-input ${
                          errors.bankAccountnoError || errors.validAccountNumber
                            ? "error-input-border"
                            : ""
                        } `}
                        disabled={this.props.status === "REJECTED"}
                      />
                      {errors.bankAccountnoError && (
                        <span className="errorMsg">
                          Please enter Account Number
                        </span>
                      )}
                      {!errors.bankAccountnoError &&
                        errors.validAccountNumber && (
                          <span className="errorMsg">
                            Account Number should be between 9 to 16.
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
                        value={Data && Data.ifscCode}
                        onChange={(e) => {
                          let regex =
                            /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
                          if (e.target.value.match(regex) == null)
                            this.handleifsc(e);
                        }}
                        onBlur={this.handleValidate}
                        placeholder="Enter IFSC Code"
                        className={`form-input ${
                          errors.ifscCodeError || errors.invalidifscCode
                            ? "error-input-border"
                            : ""
                        } `}
                        disabled={this.props.status === "REJECTED"}
                      />
                      {errors.ifscCodeError && (
                        <span className="errorMsg">Please enter ifsc code</span>
                      )}
                      {!errors.ifscCodeError && errors.invalidifscCode && (
                        <span className="errorMsg">
                          Please enter valid IFSC Code
                        </span>
                      )}
                    </div>
                    {Data && Data.gstStatus == "true" && (
                      <React.Fragment>
                        <div className="form-group col-md-4">
                          <label>HSN Code</label>
                          <input
                            type="text"
                            className="form-input"
                            name="hsncode"
                            value={Data && Data.hsnCode}
                            onChange={this.handleChange}
                            onBlur={this.handleValidate}
                            placeholder="Enter HSN Code"
                            disabled={true}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label>State Code</label>
                          <input
                            type="number"
                            className="form-input"
                            name="statecode"
                            value={Data && Data.stateCode}
                            onChange={this.handleChange}
                            onBlur={this.handleValidate}
                            placeholder="Enter State Code"
                            disabled={true}
                          />
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
                        withIcon={true}
                        withPreview={true}
                        withLabel={true}
                        accept="image/*"
                        buttonText="Upload PAN"
                        onChange={(file, base64) => {
                          this.onDrop(file, base64, "panCard");
                        }}
                        fileTypeError="is not supported file extension"
                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                        maxFileSize={5242880}
                        name="panCard"
                        disabled
                      />
                      {errors.panCardError && (
                        <span className="errorMsg">Please upload Pan</span>
                      )}
                      <ul>
                        {Data &&
                          Data.document.map((res) => {
                            if (res.description == "panCard") {
                              let pathArray = res.documentPath.split("/");
                              let path = "";
                              pathArray.map((section, index) => {
                                if (index > 3) {
                                  path += section;
                                  if (index != pathArray.length - 1)
                                    path += "/";
                                }
                              });
                              return (
                                <li>
                                  <a
                                    href={`${frontEndUrl}${path}`}
                                    download
                                    target="_blank">
                                    {res.documentName}
                                  </a>
                                </li>
                              );
                            }
                          })}
                      </ul>
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
                        accept="image/*"
                        buttonText="Upload Aadhaar"
                        onChange={(file, base64) => {
                          this.onDrop(file, base64, "adhaar");
                        }}
                        fileTypeError="is not supported file extension"
                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                        maxFileSize={5242880}
                        className="disabled"
                        disabled
                      />
                      {errors.adhaarError && (
                        <span className="errorMsg">Please upload Aadhaar</span>
                      )}
                      <ul>
                        {Data &&
                          Data.document.map((res) => {
                            if (res.description == "adhaar") {
                              let pathArray = res.documentPath.split("/");
                              let path = "";
                              pathArray.map((section, index) => {
                                if (index > 3) {
                                  path += section;
                                  if (index != pathArray.length - 1)
                                    path += "/";
                                }
                              });
                              return (
                                <li>
                                  <a
                                    href={`${frontEndUrl}${path}`}
                                    download
                                    target="_blank">
                                    {res.documentName}
                                  </a>
                                </li>
                              );
                            }
                          })}
                      </ul>
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
                        accept="image/*"
                        buttonText="Upload Shopact"
                        onChange={(file, base64) => {
                          this.onDrop(file, base64, "shopact");
                        }}
                        fileTypeError="is not supported file extension"
                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                        maxFileSize={5242880}
                      />
                      {errors.shopactError && (
                        <span className="errorMsg">Please upload Shopact</span>
                      )}
                      <ul>
                        {Data &&
                          Data.document.map((res) => {
                            if (res.description == "shopact") {
                              let pathArray = res.documentPath.split("/");
                              let path = "";
                              pathArray.map((section, index) => {
                                if (index > 3) {
                                  path += section;
                                  if (index != pathArray.length - 1)
                                    path += "/";
                                }
                              });
                              return (
                                <li>
                                  <a
                                    href={`${frontEndUrl}${path}`}
                                    download
                                    target="_blank">
                                    {res.documentName}
                                  </a>
                                </li>
                              );
                            }
                          })}
                      </ul>
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
                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                        maxFileSize={5242880}
                        name="cancelcheque"
                      />
                      {errors.cancelchequeError && (
                        <span className="errorMsg">
                          Please upload Cancelled Cheque
                        </span>
                      )}
                      <ul>
                        {Data &&
                          Data.document.map((res) => {
                            if (res.description == "cancelcheque") {
                              let pathArray = res.documentPath.split("/");
                              let path = "";
                              pathArray.map((section, index) => {
                                if (index > 3) {
                                  path += section;
                                  if (index != pathArray.length - 1)
                                    path += "/";
                                }
                              });
                              return (
                                <li>
                                  <a
                                    href={`${frontEndUrl}${path}`}
                                    download
                                    target="_blank">
                                    {res.documentName}
                                  </a>
                                </li>
                              );
                            }
                          })}
                      </ul>
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
                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                        maxFileSize={5242880}
                      />
                      {errors.profilePictureError && (
                        <span className="errorMsg">
                          Please upload Profile Picture.
                        </span>
                      )}
                      <ul>
                        {Data &&
                          Data.document.map((res) => {
                            if (res.description == "profilePicture") {
                              let pathArray = res.documentPath.split("/");
                              let path = "";
                              pathArray.map((section, index) => {
                                if (index > 3) {
                                  path += section;
                                  if (index != pathArray.length - 1)
                                    path += "/";
                                }
                              });
                              return (
                                <li>
                                  <a
                                    href={`${frontEndUrl}${path}`}
                                    download
                                    target="_blank">
                                    {res.documentName}
                                  </a>
                                </li>
                              );
                            }
                          })}
                      </ul>
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
                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                        maxFileSize={5242880}
                        onChange={(file, base64) => {
                          this.onDrop(file, base64, "aggrement");
                        }}
                      />
                      {errors.aggrementError && (
                        <span className="errorMsg">
                          Please upload Agreement
                        </span>
                      )}
                      <ul>
                        {Data &&
                          Data.document.map((res) => {
                            if (res.description == "aggrement") {
                              let pathArray = res.documentPath.split("/");
                              let path = "";
                              pathArray.map((section, index) => {
                                if (index > 3) {
                                  path += section;
                                  if (index != pathArray.length - 1)
                                    path += "/";
                                }
                              });
                              return (
                                <li>
                                  <a
                                    href={`${frontEndUrl}${path}`}
                                    download="true"
                                    target="_blank">
                                    {res.documentName}
                                  </a>
                                </li>
                              );
                            }
                          })}
                      </ul>
                    </div>
                    <p className="mt-5">
                      <i className="text-danger">*</i>Upload documents in jpg,
                      jpeg, png, gif or pdf format with Maximum size up to 5 MB
                    </p>
                  </div>
                </section>
                <section
                  className="tab-body mt-3 mb-3"
                  style={{ width: "100%" }}>
                  <div className="row">
                    <div className="col-md-4">
                      <label>Remark</label>
                      <textarea
                        type="text"
                        pattern="\d*"
                        maxLength="500"
                        className="form-input"
                        name="remark"
                        value={Data && Data.remark}
                        onChange={this.handleRemark}
                        onBlur={this.handleValidate}
                        placeholder="Enter Remark"
                        disabled={this.props.status === "REJECTED"}
                        className={`form-input ${
                          errors.remarkError ? "error-input-border" : ""
                        } `}
                      />
                      {errors.remarkError && (
                        <span className="errorMsg">Please enter Remark</span>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </Modal.Body>
            {this.props.status != "REJECTED" && (
              <Modal.Footer>
                <div className="footer-modal">
                  {this.props.status != "APPROVED" ? (
                    <React.Fragment>
                      <Button
                        className="btn-danger"
                        onClick={() => {
                          this.handleSubmit("REJECTED");
                        }}>
                        {REJECTED ? (
                          <React.Fragment>
                            {" "}
                            <i class="fa fa-spinner fa-spin"></i>Please wait...
                          </React.Fragment>
                        ) : (
                          "Reject"
                        )}
                      </Button>
                      <Button
                        className="btn-success"
                        onClick={() => {
                          this.handleSubmit("APPROVED");
                        }}>
                        {APPROVED ? (
                          <React.Fragment>
                            {" "}
                            <i class="fa fa-spinner fa-spin"></i>Please wait...
                          </React.Fragment>
                        ) : (
                          "Accept"
                        )}
                      </Button>
                      {this.props.status != "ONHOLD" && (
                        <Button
                          className="btn-danger"
                          onClick={() => {
                            this.handleSubmit("ONHOLD");
                          }}>
                          {ONHOLD ? (
                            <React.Fragment>
                              {" "}
                              <i class="fa fa-spinner fa-spin"></i>Please
                              wait...
                            </React.Fragment>
                          ) : (
                            "On Hold"
                          )}
                        </Button>
                      )}
                    </React.Fragment>
                  ) : (
                    <>
                      <Button
                        className="btn-success"
                        disabled={errors.mappedDSA}
                        onClick={() => {
                          this.handleSubmit("APPROVED");
                        }}>
                        {APPROVED ? (
                          <React.Fragment>
                            {" "}
                            <i class="fa fa-spinner fa-spin"></i>Please wait...
                          </React.Fragment>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </>
                  )}
                </div>
                <Button className="btn-danger" onClick={this.close}>
                  Cancel
                </Button>
              </Modal.Footer>
            )}
          </Modal>
        </div>
        <CloseSection
          show={this.state.showInner}
          button2={this.close}
          button1={this.handleClose}
          title="Do you want to close ?"
          addDsa={this.props.addDsa}
        />
      </React.Fragment>
    );
  }
}

export default DsaMakerForm;
