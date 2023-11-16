import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import CloseDealerModel from "./CloseDealerModel";
import Select from "react-select";
import {
  getAllState,
  getAllCities,
  BranchList,
} from "../../Utils/dsa";
import {
  saveUpdateDealerMaster,
  getDealerTypeMasterList,
  getManufacturerMasterList,
  getAccountTypeMasterList,
  getDealerSpecificData,
} from "../../Utils/master";
toast.configure();

const dropstyle = {
  container: (base) => ({
    ...base,
    flex: 1,
  }),
};

class AddDealerModel extends Component {
  state = {
    dealerName: null,
    dealerCode: null,
    mobileNo: null,
    managerMobileNo: null,
    emailId: null,
    managerEmailId: null,
    dealerType: null,
    manufacturer: null,
    branch: null,
    address: null,
    area: null,
    city: null,
    nearestLandmark: null,
    state: null,
    pincode: null,
    pos: null,
    panNumber: null,
    gstNumber: null,
    bankName: null,
    bankAccountNumber: null,
    ifscCode: null,
    branchName: null,
    accountType: null,
    invalidmobileNo: false,
    invalidManagerMobileNo: false,
    invalidEmailId: false,
    invalidManagerEmailId: false,
    getState: [],
    getCities: [],
    branchListData: [],
    invalidPanNumber: false,
    getDealers: [],
    leadSourceDetailId: null,
    score: null,
    ranking: null,
    accountHolderName: null,
    getManufacturer: [],
    getAccountType: [],
    branchOption: [],
    userBranch: [],
    errors: {
      dealerName: null,
      dealerCode: null,
      mobileNo: null,
      emailId: null,
      address: null,
      area: null,
      nearestLandmark: null,
      pincode: null,
      gstNumber: null,
      bankName: null,
      bankAccountNumber: null,
      branchName: null,
      statError: null,
      cityError: null,
      branchError: null,
      panNumberError: null,
      ifscCodeError: null,
      invalidifscCode: null,
      dealerType: null,
      leadSourceDetailId: null,
      score: null,
      ranking: null,
      accountHolderName: null,
      manufacturer: null,
      accountType: null,
    },
  };

  componentDidMount() {
    let { errors } = this.state;
    this.handleShow();
    this.GetallStateData();
    this.branchListData();
    this.handlestateName();
    this.setState({ errors: { ...errors, cityError: false } });
    this.getDealerTypeList();
    this.getManufacturerList();
    this.getAccountTypeList();
    this.GetDealerSpecificDataFunction();
  }

  //----------------------------------modal----------------------------------
  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = (modclose) => {
    if (!modclose) this.modclose();
    this.setState({ show: false });
    this.props.addUser();
  };

  modclose = (modclose) => {
    this.setState({ showInner: !this.state.showInner });
  };

  close = (close) => {
    this.setState({ showInner: !this.state.showInner });
  };
  //---------------------------------modal------------------------------------

  //-------------------------------getDataFunction-----------------------------
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

  // getAllBranchList = () => {
  //   BranchList().then((response) => {
  //     if (response.data && response.data.error == false) {
  //       this.setState({
  //         branchListData:
  //           response.data && response.data.data ? response.data.data : [],
  //       });
  //     }
  //   });
  // };

  branchListData = () => {
    BranchList().then((response) => {
      this.setState({
        branchOption:
          response.data && response.data.data ? response.data.data : [],
      });
    });
  };

  getDealerTypeList = () => {
    getDealerTypeMasterList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          getDealers:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  getManufacturerList = () => {
    getManufacturerMasterList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          getManufacturer:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  getAccountTypeList = () => {
    getAccountTypeMasterList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          getAccountType:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  GetDealerSpecificDataFunction = () => {
    this.setState({ isloading: true });
    let obj = {
      id: this.props.verifyObj,
    };
    getDealerSpecificData(obj).then((response) => {
      this.setState({ isloading: false });
      this.setState({
        dealerId:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.id,
      });
      this.setState({
        dealerName:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.dealer_name,
        dealerCode:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.dealerCode,
        mobileNo:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.mobileNumber,
        emailId:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.email,
        managerMobileNo:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.managerMobileNumber,
        managerEmailId:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.managerEmail,
        dealerType:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.dealerType,
        manufacturer:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.manufacturer,
        branch:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.branch,
        address:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.address,
        area:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.area,
        city:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.city,
        nearestLandmark:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.nearestLandmark,
        stat:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.state,
        pincode:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.pinCode,
        pos:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.pointOfContactPerson,
        panNumber:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.panNumber,
        gstNumber:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.gstNumber,
        bankName:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.bankName,
        bankAccountNumber:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.accountNumber,
        ifscCode:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.ifscCode,
        branchName:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.bankBranch,
        accountType:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.accountType,
        leadSourceDetailId:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.leadSourceDetailId,
        accountHolderName:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.accountHolderName,
          score:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.score,
          ranking:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.ranking,
      });
    });
  };
  //----------------------------------------getDataFunction-----------------------------------

  //----------------------------------------all handleOnChanges------------------------------
  handlePincode = (pincode) => {
    this.setState({ pincode });
  };

  handleName = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name]: true } });
    } else {
      this.setState({ errors: { ...errors, [name]: false } });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handlePan = (e) => {
    let { errors } = this.state;
    if (
      e.target.value == "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      errors = { ...errors, panNumberError: true };
    } else {
      errors = { ...errors, panNumberError: false };
    }
    this.setState({
      panNumber: e.target.value.toUpperCase(),
      panStatus: null,
      errors,
    });
  };

  handleMobile = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    const { errors } = this.state;
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      this.setState({ errors: { ...errors, [name]: true } });
    } else {
      this.setState({ errors: { ...errors, [name]: false } });
    }
    let indianMobile = /^[6789]\d{9}$/;
    if (name === "mobileNo") {
      if (value && !value.match(indianMobile)) {
        this.setState({
          invalidmobileNo: true,
        });
      } else {
        this.setState({
          invalidmobileNo: false,
        });
      }
    }
    this.setState({
      mobileNo: e.target.value,
    });
  };

  handleManagerMobile = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    const { errors } = this.state;
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      this.setState({ errors: { ...errors, [name]: true } });
    } else {
      this.setState({ errors: { ...errors, [name]: false } });
    }
    let indianMobile = /^[6789]\d{9}$/;
    if (name === "managerMobileNo") {
      if (value && !value.match(indianMobile)) {
        this.setState({
          invalidManagerMobileNo: true,
        });
      } else {
        this.setState({
          invalidManagerMobileNo: false,
        });
      }
    }
    this.setState({
      managerMobileNo: e.target.value,
    });
  };

  handleChange = (e) => {
    let name = e.target.name;
    const { errors } = this.state;
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      this.setState({ errors: { ...errors, [name]: true } });
    } else {
      this.setState({ errors: { ...errors, [name]: false } });
    }
    if (name === "emailId") {
      let usernameRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (e.target.value && !e.target.value.match(usernameRegx)) {
        this.setState({
          invalidEmailId: true,
        });
      } else {
        this.setState({
          invalidEmailId: false,
        });
      }
    }
    if (name === "managerEmailId") {
      let usernameRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (e.target.value && !e.target.value.match(usernameRegx)) {
        this.setState({
          invalidManagerEmailId: true,
        });
      } else {
        this.setState({
          invalidManagerEmailId: false,
        });
      }
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handlebranch = (branch) => {
    let { errors } = this.state;
    if (
      branch === "" ||
      branch === null ||
      branch === undefined ||
      branch.length === 0
    ) {
      this.setState({ errors: { ...errors, branchError: true } });
    } else {
      this.setState({ errors: { ...errors, branchError: false } });
    }

    let brancharray = [];
    branch && brancharray.push(branch);
    this.setState({
      userBranch: brancharray[0],
      branch,
    });
  };

  handlestateName = (stat) => {
    let { errors } = this.state;
    if (stat === "" || stat === null || stat === undefined) {
      this.setState({ errors: { ...errors, statError: true } });
    } else {
      this.setState({
        errors: { ...errors, statError: false, cityError: false },
      });
    }
    this.setState(
      { stat, city: "", errors: { ...errors, cityError: true } },
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

  handleBranch = (branch) => {
    let { errors } = this.state;
    if (branch === "" || branch === null || branch === undefined) {
      this.setState({ errors: { ...errors, branch: true } });
    } else {
      this.setState({ errors: { ...errors, branch: false } });
    }
    // this.setState({ branch });
    let brancharray = [];
    branch && brancharray.push(branch);
    this.setState({
      userBranch: brancharray[0],
      branch,
    });
  };

  onValidate = (name) => {
    const { DOB, branch, gst, errors, company, stat, city, userBranch } =
      this.state;
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

    if (name === "panNumber") {
      if (name && name.length != 10) {
        this.setState({
          invalidPanNumber: true,
        });
      } else {
        this.setState({
          invalidPanNumber: false,
        });
      }
    }

    if (name === "branchobj") {
      if (
        // branch === "" ||
        // branch === null ||
        // branch === undefined ||
        (userBranch && userBranch.length === 0) ||
        (branch && branch.length === 0)
      ) {
        this.setState({ errors: { ...errors, branchError: true } });
      } else {
        this.setState({ errors: { ...errors, branchError: false } });
      }
    }
  };

  handleValidate = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
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

    if (name === "ifscCode") {
      if (value.trim() == "") {
        this.setState({ errors: { ...errors, ifscCodeError: true } });
      } else {
        this.setState({ errors: { ...errors, ifscCodeError: false } });
      }
    }
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

  handleDealerType = (dealerType) => {
    const { errors } = this.state;
    if (dealerType === "" || dealerType === null || dealerType === undefined) {
      this.setState({ errors: { ...errors, dealerType: true } });
    } else {
      this.setState({ errors: { ...errors, dealerType: false } });
    }
    this.setState({ dealerType });
  };

  handleManufacturer = (manufacturer) => {
    const { errors } = this.state;
    if (
      manufacturer === "" ||
      manufacturer === null ||
      manufacturer === undefined
    ) {
      this.setState({ errors: { ...errors, manufacturer: true } });
    } else {
      this.setState({ errors: { ...errors, manufacturer: false } });
    }
    this.setState({ manufacturer });
  };

  handleAccountType = (accountType) => {
    const { errors } = this.state;
    if (
      accountType === "" ||
      accountType === null ||
      accountType === undefined
    ) {
      this.setState({ errors: { ...errors, accountType: true } });
    } else {
      this.setState({ errors: { ...errors, accountType: false } });
    }
    this.setState({ accountType });
  };
  //--------------------------------all handleOnChanges---------------------------

  //------------------------------all keyPress events---------------------------
  restrictSpecialCharactersNumber = (e) => {
    const regx = "^[a-zA-Z ]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictSpecialCharactersNumberWithoutSpace = (e) => {
     const regx = "^[a-zA-Z0-9 ]*$";
     if (e.key.match(regx)) {
       return true;
     } else {
       e.preventDefault();
     }
  };

  restrictSpecialCharactersNumberWithoutDash = (e) => {
    const regx = "^[a-zA-Z- ]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictSpecialCharacters = (e) => {
    const regx = "^[a-zA-Z0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictAlphabets = (e) => {
    const regx = "^[0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictBlankSpace = (e) => {
    const regx = /^\S*$/;
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };
  //-----------------------------all keyPress events--------------------------

  //--------------------------------submitButton onChange--------------------------
  handleSubmit = () => {
    const {
      errors,
      dealerName,
      dealerCode,
      mobileNo,
      managerMobileNo,
      emailId,
      managerEmailId,
      dealerType,
      manufacturer,
      branch,
      address,
      area,
      city,
      nearestLandmark,
      pincode,
      pos,
      panNumber,
      gstNumber,
      bankName,
      bankAccountNumber,
      ifscCode,
      branchName,
      accountType,
      stat,
      leadSourceDetailId,
      score,
      ranking,
      accountHolderName,
      dealerId,
      userBranch,
    } = this.state;

    let isAdd = true;
    for (var val in errors) {
      if (this.props.verifyObj) {
        if (errors[val]) {
          errors[val] = true;
          isAdd = false;
        }
      } else {
        if (errors[val] === null || errors[val]) {
          errors[val] = true;
          isAdd = false;
        }
      }
    }

    // let userBranchMapping = [];
    // userBranch &&
    //   userBranch.map((val) => {
    //     userBranchMapping.push({
    //       branchCode: val.branchCode,
    //     });
    //   });

    let obj = {
      dealer_name: dealerName,
      dealerCode: dealerCode,
      mobileNumber: mobileNo,
      email: emailId,
      managerMobileNumber: managerMobileNo,
      managerEmail: managerEmailId,
      dealerType:
        (dealerType && dealerType[0] && dealerType[0].dealerType) ||
        (dealerType && dealerType.dealerType),
      manufacturer:
        (manufacturer && manufacturer[0] && manufacturer[0].manufacturer) ||
        (manufacturer && manufacturer.manufacturer),
      address: address,
      area: area,
      city: (city && city.cityName) || (city && city[0] && city[0].cityName),
      nearestLandmark: nearestLandmark,
      state: (stat && stat.stateName) || (stat && stat[0] && stat[0].stateName),
      pinCode: pincode,
      pointOfContactPerson: pos,
      panNumber: panNumber,
      gstNumber: gstNumber,
      bankName: bankName,
      accountNumber: bankAccountNumber,
      ifscCode: ifscCode,
      bankBranch: branchName,
      accountType:
        (accountType && accountType[0] && accountType[0].accountMaster) ||
        (accountType && accountType.accountMaster),
      leadSourceDetailId: leadSourceDetailId,
      score: score,
      ranking: ranking,
      accountHolderName: accountHolderName,
      type: "Dealer",
      id: this.props.verifyObj ? dealerId : null,
      branch:
        // (userBranchMapping &&
        //   userBranchMapping[0] &&
        //   userBranchMapping[0].branchCode) ||
        // userBranchMapping.branchCode,
        (branch && branch.branchName) ||
        (branch && branch[0] && branch[0].branchName),
    };

    if (isAdd) {
      saveUpdateDealerMaster(obj).then((response) => {
        if (response.data && response.data.error === false) {
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
          });
          this.handleClose();
        }
        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
          });
          this.setState({
            dealerName: "",
          });
          this.handleClose();
        }
      });
    }
    this.setState({ errors: { ...errors } });
  };
  //---------------------------------Submit Button onChange---------------------

  render() {
    const {
      show,
      pincode,
      pincodesOptions,
      dealerName,
      dealerCode,
      mobileNo,
      emailId,
      managerMobileNo,
      managerEmailId,
      dealerType,
      manufacturer,
      branch,
      address,
      area,
      city,
      nearestLandmark,
      errors,
      pos,
      panNumber,
      gstNumber,
      bankName,
      bankAccountNumber,
      ifscCode,
      branchName,
      accountType,
      invalidmobileNo,
      invalidManagerMobileNo,
      invalidEmailId,
      invalidManagerEmailId,
      getState,
      getCities,
      branchListData,
      invalidPanNumber,
      stat,
      getDealers,
      leadSourceDetailId,
      score,
      ranking,
      accountHolderName,
      getManufacturer,
      getAccountType,
      branchOption,
      userBranch,
    } = this.state;

    // let branchobj = [];
    // branchOption.map((res) => {
    //   userBranch &&
    //     userBranch.map((val) => {
    //       if (res.branchCode == val.branchCode) {
    //         branchobj.push(res);
    //       }
    //     });
    // });

    return (
      <React.Fragment>
        <div>
          <Modal
            className="add-user"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={() => {
              this.close();
            }}>
            <Modal.Header closeButton>
              <Modal.Title>Dealer Master</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h4 className="text-center">LOADING...</h4>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Dealer Name*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="dealerName"
                        value={dealerName}
                        onChange={this.handleName}
                        onKeyPress={
                          this.restrictSpecialCharactersNumberWithoutDash
                        }
                      />
                      {errors.dealerName && (
                        <span className="errorMsg">
                          Please enter Dealer name
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Dealer Code*</label>
                      <input
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="dealerCode"
                        value={dealerCode}
                        onChange={this.handleName}
                        onKeyPress={
                          this.restrictSpecialCharactersNumberWithoutSpace
                        }
                      />
                      {errors.dealerCode && (
                        <span className="errorMsg">
                          Please enter Dealer Code
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Account Holder Name*</label>
                      <input
                        maxLength="50"
                        type="text"
                        className="form-input capLetters"
                        name="accountHolderName"
                        value={accountHolderName}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharactersNumber}
                      />
                      {errors.accountHolderName && (
                        <span className="errorMsg">
                          Please enter Account Holder Name
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Mobile Number*</label>
                      <input
                        type="text"
                        pattern="\d*"
                        maxLength="10"
                        className="form-input"
                        name="mobileNo"
                        value={mobileNo}
                        maxlength="10"
                        onChange={this.handleMobile}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.mobileNo && (
                        <span className="errorMsg">
                          Please enter Mobile Number
                        </span>
                      )}
                      {invalidmobileNo && (
                        <span className="errorMsg">
                          Please enter Valid Mobile Number
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Email Id*</label>
                      <input
                        type="text"
                        className="form-input"
                        name="emailId"
                        value={emailId}
                        onChange={this.handleChange}
                        onKeyPress={this.restrictBlankSpace}
                      />
                      {errors.emailId && (
                        <span className="errorMsg">Please enter Email ID</span>
                      )}
                      {invalidEmailId && (
                        <span className="errorMsg">
                          Please enter valid Email ID
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Manager Mobile Number</label>
                      <input
                        type="text"
                        pattern="\d*"
                        maxLength="10"
                        className="form-input"
                        name="managerMobileNo"
                        value={managerMobileNo}
                        maxlength="10"
                        onChange={this.handleManagerMobile}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {invalidManagerMobileNo && (
                        <span className="errorMsg">
                          Please enter Valid Mobile Number
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Manager Email Id</label>
                      <input
                        type="text"
                        className="form-input"
                        name="managerEmailId"
                        value={managerEmailId}
                        onChange={this.handleChange}
                        onKeyPress={this.restrictBlankSpace}
                      />
                      {invalidManagerEmailId && (
                        <span className="errorMsg">
                          Please enter valid Email ID
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Dealer Type*</label>
                      <Select
                        name="dealerType"
                        value={dealerType}
                        onChange={this.handleDealerType}
                        // isMulti
                        options={getDealers}
                        getOptionLabel={(option) => option["dealerType"]}
                        getOptionValue={(option) => option["id"]}
                      />
                      {errors.dealerType && (
                        <span className="errorMsg">
                          Please enter Dealer Type
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Manufacturer*</label>
                      <Select
                        name="manufacturer"
                        value={manufacturer}
                        onChange={this.handleManufacturer}
                        // isMulti
                        options={getManufacturer}
                        getOptionLabel={(option) => option["manufacturer"]}
                        getOptionValue={(option) => option["id"]}
                      />
                      {errors.manufacturer && (
                        <span className="errorMsg">
                          Please enter Manufacturer
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Address*</label>
                      <textarea
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="address"
                        value={address}
                        onChange={this.handleName}
                      />
                      {errors.address && (
                        <span className="errorMsg">Please enter Address</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Area*</label>
                      <input
                        maxLength="25"
                        type="text"
                        className="form-input capLetters"
                        name="area"
                        value={area}
                        onChange={this.handleName}
                      />
                      {errors.area && (
                        <span className="errorMsg">Please enter Area</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Nearest Landmark*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="nearestLandmark"
                        value={nearestLandmark}
                        onChange={this.handleName}
                      />
                      {errors.nearestLandmark && (
                        <span className="errorMsg">
                          Please enter Nearest Landmark
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>State*</label>
                      <Select
                        value={stat}
                        onChange={this.handlestateName}
                        onBlur={() => this.onValidate("stat")}
                        options={getState}
                        name="stat"
                        valueKey="id"
                        labelKey="stateName"
                        getOptionLabel={(option) => option["stateName"]}
                        getOptionValue={(option) => option["id"]}
                        className={`${
                          errors.statError ? "error-input-border" : ""
                        } `}
                      />
                      {errors.statError && (
                        <span className="errorMsg">Please enter state</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>City*</label>
                      <Select
                        value={city}
                        onChange={this.handleCity}
                        onBlur={() => this.onValidate("city")}
                        options={getCities}
                        name="city"
                        valueKey="cityId"
                        labelKey="cityName"
                        getOptionLabel={(option) => option["cityName"]}
                        getOptionValue={(option) => option["id"]}
                      />
                      {errors.cityError && (
                        <span className="errorMsg">Please enter City</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Branch*</label>
                      <Select
                        name="branch"
                        value={branch}
                        // isMulti
                        onChange={this.handlebranch}
                        options={branchOption}
                        onBlur={() => this.onValidate("branch")}
                        placeholder="Branch"
                        valueKey="branchCode"
                        labelKey="branchName"
                        getOptionLabel={(option) => option["branchName"]}
                        getOptionValue={(option) => option["branchCode"]}
                        styles={dropstyle}
                      />
                      {errors.branchError && (
                        <span className="errorMsg">Please select Branch</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Pincode*</label>
                      <input
                        maxLength="6"
                        type="text"
                        className="form-input capLetters"
                        name="pincode"
                        value={pincode}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.pincode && (
                        <span className="errorMsg">Please enter pincode</span>
                      )}
                      {pincode && pincode.length < 6 && (
                        <span className="errorMsg">Invalid pincode</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>
                        Point of Contact Person/Manager of POS other than dealer
                      </label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="pos"
                        value={pos}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharactersNumber}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>PAN Number*</label>
                      <input
                        maxLength="10"
                        pattern="\d*"
                        type="text"
                        className="form-input capLetters"
                        name="panNumber"
                        value={panNumber}
                        onChange={(e) => {
                          let regex =
                            /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
                          if (e.target.value.match(regex) == null)
                            this.handlePan(e);
                        }}
                        onBlur={this.handleValidate}
                        onKeyPress={this.restrictSpecialCharacters}
                      />
                      {errors.panNumberError && (
                        <span className="errorMsg">
                          Please enter PAN Number
                        </span>
                      )}
                      {invalidPanNumber && (
                        <span className="errorMsg">
                          Please enter valid PAN Number
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>GST Number*</label>
                      <input
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="gstNumber"
                        value={gstNumber}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharacters}
                      />
                      {errors.gstNumber && (
                        <span className="errorMsg">
                          Please enter GST Number
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Account Type*</label>
                      <Select
                        name="accountType"
                        value={accountType}
                        onChange={this.handleAccountType}
                        // isMulti
                        options={getAccountType}
                        getOptionLabel={(option) => option["accountMaster"]}
                        getOptionValue={(option) => option["id"]}
                      />
                      {errors.accountType && (
                        <span className="errorMsg">
                          Please enter Account Type
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Bank Account Number*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="bankAccountNumber"
                        value={bankAccountNumber}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.bankAccountNumber && (
                        <span className="errorMsg">
                          Please enter Bank Account Number
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>IFSC Code*</label>
                      <input
                        type="text"
                        pattern="\d*"
                        maxLength="11"
                      
                        name="ifscCode"
                        value={ifscCode}
                        onChange={(e) => {
                          let regex =
                            /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
                          if (e.target.value.match(regex) == null)
                            this.handleifsc(e);
                        }}
                        onBlur={this.handleValidate}
                        onKeyPress={this.restrictSpecialCharacters}
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
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Bank Name*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="bankName"
                        value={bankName}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharacters}
                      />
                      {errors.bankName && (
                        <span className="errorMsg">Please enter Bank Name</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Branch Name*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="branchName"
                        value={branchName}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharacters}
                      />
                      {errors.branchName && (
                        <span className="errorMsg">
                          Please enter Branch Name
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Lead Source Detail Id*</label>
                      <input
                        maxLength="100"
                        type="number"
                        className="form-input capLetters"
                        name="leadSourceDetailId"
                        value={leadSourceDetailId}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.leadSourceDetailId && (
                        <span className="errorMsg">
                          Please enter Lead Source Detail Id
                        </span>
                      )}
                    </div> 
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Score</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="score"
                        value={score}
                        onChange={this.handleName}
                       
                      />
                      {errors.score && (
                        <span className="errorMsg">
                          Please enter Score
                        </span>
                      )}
                    </div> <div className="col-md-3  mt-4" lg={12}>
                      <label>Rank</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="ranking"
                        value={ranking}
                        onChange={this.handleName}
                     
                      />
                      {errors.ranking && (
                        <span className="errorMsg">
                          Please enter Rank
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer show={this.state.showInner}>
              <Button className="btn-danger" onClick={this.modclose}>
                Cancel
              </Button>
              <Button className="btn-success" onClick={this.handleSubmit}>
                {this.props.verifyObj ? "Update" : "Add"}
              </Button>
            </Modal.Footer>
          </Modal>
          <CloseDealerModel
            show={this.state.showInner}
            button2={this.modclose}
            button1={this.handleClose}
            title="Do you want to close ?"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AddDealerModel;
