import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import CloseSchemeModel from "./CloseSchemeModel";
import Select from "react-select";
import {
  saveUpdateSchemeMaster,
  getSchemeSpecificData,
  getTenureMaster,
  getDealerNameMaster,
} from "../../Utils/master";
import { BranchList } from "../../Utils/dsa";
toast.configure();

const statusOption = [
  { id: 1, value: "Active", label: "Active" },
  { id: 2, value: "Inactive", label: "Inactive" },
];

const pfAmountTypeOption = [
  { id: 1, value: "Percent", label: "Percent" },
  { id: 2, value: "Number", label: "Number" },
];

const dealerPoTypeOption = [
  { id: 1, value: "Percent", label: "Percent" },
  { id: 2, value: "Number", label: "Number" },
];

const dealerPoOption = [
  { id: 1, value: "YES", label: "Yes" },
  { id: 2, value: "NO", label: "No" },
];

const managerPoOption = [
  { id: 1, value: "YES", label: "Yes" },
  { id: 2, value: "NO", label: "No" },
];

const tenureInMonthOption = [
  { id: 1, value: "12", label: "12" },
  { id: 2, value: "18", label: "18" },
  { id: 3, value: "24", label: "24" },
  { id: 4, value: "30", label: "30" },
  { id: 5, value: "36", label: "36" },
];

const dropstyle = {
  container: (base) => ({
    ...base,
    flex: 1,
  }),
};
class AddSchemeModel extends Component {
  state = {
    defaultValue: {
      id: 0,
      dealer_name: "ALL",
    },
    location: null,
    schemeCode: null,
    startDate: null,
    endDate: null,
    status: null,
    dealerName: null,
    manufacturer: null,
    roi: null,
    tenureInMonth: null,
    advanceEmi: null,
    pfAmount: null,
    documentCharges: null,
    anyOtherCharges: null,
    preEmiCharges: null,
    bureauCharges: null,
    nachCharges: null,
    ltv: null,
    pdd: null,
    stampDuty: null,
    klpi: null,
    dealerSubvention: null,
    dealerPo: null,
    dealerPoInPercent: null,
    irr: null,
    roiActual: null,
    additionalPayout: null,
    remarks: null,
    invalidRoi: null,
    invalidRoiActual: null,
    schemeName: null,
    pfAmountType: null,
    invalidPfAmount: null,
    dealerPoType: null,
    managerPoType: null,
    dealerPoTypeYN: null,
    invalidDealerPo: null,
    branchListData: [],
    branch: null,
    tenureType: null,
    dealerId: null,
    pfAmountInRs: null,
    dealerPoInRs: null,
    tenureOption: [],
    userBranch: [],
    tenure: null,
    invalidLTV: null,
    pfAmountinPercentError: null,
    pfAmountinRsError: null,
    getDealerName: [],
    errors: {
      schemeCode: null,
      startDate: null,
      endDate: null,
      dealerName: null,
      roi: null,
      // tenureInMonth: null,
      // pfAmount: null,
      documentCharges: null,
      anyOtherCharges: null,
      preEmiCharges: null,
      bureauCharges: null,
      nachCharges: null,
      pdd: null,
      stampDuty: null,
      roiActual: null,
      schemeName: null,
      ltv: null,
      // branch: null,
      // pfAmountInRs: null,
      status: null,
      tenure: null,
    },
  };

  componentDidMount() {
    this.handleShow();
    this.getAllBranchList();
    this.getSchemeSpecificDataFunction();
    this.tenureListData();
    // this.getDealerNameData();
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.state.branch !== prevState.branch) {
      if (this.state.branch) {
        let branch = this.state.branch;
        let branchObj = branch && branch[0] && branch[0].branchName;
        if (branchObj) {
          getDealerNameMaster({ branchName: branchObj }).then((response) => {
            console.log("res", response);
            if (response.data && response.data.error == false) {
              this.setState({
                getDealerName:
                  response.data && response.data.data
                    ? [this.state.defaultValue, ...response.data.data]
                    : [],
              });
            }
          });
        }
      }
    }
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

  //--------------------------getDataFunction----------------------
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

  tenureListData = () => {
    getTenureMaster().then((response) => {
      this.setState({
        tenureOption:
          response.data && response.data.data ? response.data.data : [],
      });
    });
  };

  getDealerNameData = () => {
    let obj = { branchName: this.state.branch };
    getDealerNameMaster(obj).then((response) => {
      console.log("response.data.data", response.data.data);
      if (response.data && response.data.error == false) {
        this.setState({
          getDealerName:
            response.data && response.data.data
              ? [this.state.defaultValue, ...response.data.data]
              : [],
        });
      }
    });
  };

  getSchemeSpecificDataFunction = () => {
    this.setState({ isloading: true });
    let obj = {
      id: this.props.verifyObj,
    };
    getSchemeSpecificData(obj).then((response) => {
      this.setState({ isloading: false });
      this.setState({
        dealerId:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.id,
      });
      this.setState({
        branch: response.data.data.location,
        schemeCode: response.data.data.schemeCode,
        schemeName: response.data.data.schemeName,
        startDate: response.data.data.startDate,
        endDate: response.data.data.endDate,
        dealerName: response.data.data.specificDealer,
        manufacturer: response.data.data.manufacturer,
        roi: response.data.data.roi,
        tenureInMonth: response.data.data.tenure,
        advanceEmi: response.data.data.advanceEmi,
        pfAmount: response.data.data.pfAmount,
        documentCharges: response.data.data.documentationCharges,
        anyOtherCharges: response.data.data.anyOtherCharges,
        preEmiCharges: response.data.data.preEmiChanrges,
        bureauCharges: response.data.data.bureauCharges,
        pdd: response.data.data.pdd,
        stampDuty: response.data.data.stampDuty,
        klpi: response.data.data.klpiBracket,
        dealerSubvention: response.data.data.dealerSubvention,
        // dealerPo: response.data.data.dealerPo,
        dealerPoInRs: response.data.data.dealerPoInRs,
        dealerPoInPercent: response.data.data.dealerPoInPercent,
        irr: response.data.data.irr,
        roiActual: response.data.data.roiActual,
        additionalPayout: response.data.data.additionalPayout,
        remarks: response.data.data.remarks,
        nachCharges: response.data.data.nachCharges,
        ltv: response.data.data.ltv,
        status: response.data.data.schemeStatus,
        pfAmountType: response.data.data.pfAmountType,
        // dealerPoType: response.data.data.dealerPoType,
        managerPoType: response.data.data.managerPo,
        // dealerPoTypeYN: response.data.data.dealerPo,
        // managerPoType: response.data.data.managerPoType,
        dealerPoTypeYN: response.data.data.dealerPoType,
        userBranch: response.data.data.tenure,
        pfAmountInRs: response.data.data.pfAmountInRs,
        dealerPoType: response.data.data.dealerPo,
      });
    });
  };
  //--------------------------getDataFunction-----------------------

  //----------------------------------------all handleOnChanges------------------------------
  handleName = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name]: true } });
    } else {
      this.setState({ errors: { ...errors, [name]: false } });
    }

    if (name === "roi") {
      let roiRegex = /^(100|([0-9][0-9]?(\.[0-9]+)?))$/;
      if (e.target.value && !e.target.value.match(roiRegex)) {
        this.setState({
          invalidRoi: true,
        });
      } else {
        this.setState({
          invalidRoi: false,
        });
      }
    }

    if (name === "roiActual") {
      let roiActualRegex = /^(100|([0-9][0-9]?(\.[0-9]+)?))$/;
      if (e.target.value && !e.target.value.match(roiActualRegex)) {
        this.setState({
          invalidRoiActual: true,
        });
      } else {
        this.setState({
          invalidRoiActual: false,
        });
      }
    }

    if (name === "ltv") {
      let ltvRegex = /^(100|([0-9][0-9]?(\.[0-9]+)?))$/;
      if (e.target.value && !e.target.value.match(ltvRegex)) {
        this.setState({
          invalidLTV: true,
        });
      } else {
        this.setState({
          invalidLTV: false,
        });
      }
    }

    if (name === "pfAmount") {
      let roiRegex = /^(100|([0-9][0-9]?(\.[0-9]+)?))$/;
      if (e.target.value && !e.target.value.match(roiRegex)) {
        this.setState({
          invalidPfAmount: true,
        });
      } else {
        this.setState({
          invalidPfAmount: false,
        });
      }

      if (
        e.target.value === "" ||
        e.target.value === null ||
        e.target.value === undefined
      ) {
        this.setState({ pfAmountinPercentError: true });
      } else {
        this.setState({ pfAmountinPercentError: false });
      }
    }

    if (name === "pfAmountInRs") {
      let roiRegex = /^(100|([0-9][0-9]?(\.[0-9]+)?))$/;
      if (e.target.value && !e.target.value.match(roiRegex)) {
        this.setState({
          invalidPfAmount: true,
        });
      } else {
        this.setState({
          invalidPfAmount: false,
        });
      }
    }

    if (name === "dealerPoInPercent") {
      let roiRegex = /^(100|([0-9][0-9]?(\.[0-9]+)?))$/;
      if (e.target.value && !e.target.value.match(roiRegex)) {
        this.setState({
          invalidDealerPo: true,
        });
      } else {
        this.setState({
          invalidDealerPo: false,
        });
      }
    }
    this.setState({
      [e.target.name]: e.target.value,
    });

    if (name === "dealerPo") {
      let roiRegex = /^(100|([0-9][0-9]?(\.[0-9]+)?))$/;
      if (e.target.value && !e.target.value.match(roiRegex)) {
        this.setState({
          invalidDealerPo: true,
        });
      } else {
        this.setState({
          invalidDealerPo: false,
        });
      }
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handlePF = (e) => {
    // const { errors } = this.state;
    // let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ pfAmountinRsError: true });
    } else {
      this.setState({ pfAmountinRsError: false });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleDealerPoFunction = (e) => {
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

  handleStatus = (status) => {
    const { errors } = this.state;
    if (status === "" || status === null || status === undefined) {
      this.setState({ errors: { ...errors, status: true } });
    } else {
      this.setState({ errors: { ...errors, status: false } });
    }
    this.setState({ status: status && status.value });
  };

  handlePfAmountType = (pfAmountType) => {
    this.setState({ pfAmountType: pfAmountType && pfAmountType.value });
  };

  handleDealerPo = (dealerPoType) => {
    this.setState({ dealerPoType: dealerPoType && dealerPoType.value });
  };

  handleManagerPo = (managerPoType) => {
    this.setState({ managerPoType: managerPoType && managerPoType.value });
  };

  handleDealerPoType = (dealerPoTypeYN) => {
    this.setState({ dealerPoTypeYN: dealerPoTypeYN && dealerPoTypeYN.value });
  };

  handleBranch = (branch) => {
    this.setState({ dealerName: null });
    this.setState({ branch });
    let branchObj = branch.branchName;
    let obj = { branchName: branchObj };
    getDealerNameMaster(obj).then((response) => {
      console.log("res", response);
      if (response.data && response.data.error == false) {
        this.setState({
          getDealerName:
            response.data && response.data.data
              ? [this.state.defaultValue, ...response.data.data]
              : [],
        });
      }
    });
    let { errors } = this.state;
    if (branch === "" || branch === null || branch === undefined) {
      this.setState({ errors: { ...errors, branch: true } });
    } else {
      this.setState({ errors: { ...errors, branch: false } });
    }
    this.setState({ branch });
  };

  handleTenures = (tenure) => {
    let { errors } = this.state;
    if (
      tenure === "" ||
      tenure === null ||
      tenure === undefined ||
      tenure.length === 0
    ) {
      this.setState({ errors: { ...errors, tenure: true } });
    } else {
      this.setState({ errors: { ...errors, tenure: false } });
    }

    let tenureArray = [];
    tenure && tenureArray.push(tenure);
    this.setState({
      userBranch: tenureArray[0],
      tenure,
    });
  };

  handleDealerName = (dealerName) => {
    //  let obj = { branchName: this.state.branch.branchName };
    // getDealerNameMaster(obj).then((response) => {
    //   if (response.data && response.data.error == false) {
    //     this.setState({
    //       getDealerName:
    //         response.data && response.data.data ? response.data.data : [],
    //     });
    //   }
    // });
    const { errors } = this.state;
    if (dealerName === "" || dealerName === null || dealerName === undefined) {
      this.setState({ errors: { ...errors, dealerName: true } });
    } else {
      this.setState({ errors: { ...errors, dealerName: false } });
    }

    this.setState({ dealerName });
  };

  onValidate = (name) => {
    const { branch, errors, userBranch } = this.state;
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

    if (name === "tenuresObj") {
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

  restrictSpecialCharactersNumberWithoutDash = (e) => {
    const regx = "^[a-zA-Z- ]*$";
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
      location,
      schemeCode,
      startDate,
      endDate,
      dealerName,
      manufacturer,
      roi,
      tenureInMonth,
      advanceEmi,
      pfAmount,
      documentCharges,
      anyOtherCharges,
      preEmiCharges,
      bureauCharges,
      pdd,
      stampDuty,
      klpi,
      dealerSubvention,
      dealerPo,
      irr,
      roiActual,
      additionalPayout,
      remarks,
      schemeName,
      nachCharges,
      ltv,
      status,
      pfAmountType,
      dealerPoType,
      managerPoType,
      dealerPoTypeYN,
      branch,
      tenureType,
      dealerId,
      pfAmountInRs,
      dealerPoInPercent,
      dealerPoInRs,
      userBranch,
      pfAmountinPercentError,
      pfAmountinRsError,
      pfAmountTypeObj,
    } = this.state;

    let isAdd = true;
    for (var val in errors) {
      if (this.props.verifyObj) {
        if (errors[val]) {
          errors[val] = true;
          // this.setState({ pfAmountinPercentError: true });
          isAdd = false;
        }
      } else {
        if (errors[val] === null || errors[val]) {
          errors[val] = true;
          // this.setState({ pfAmountinPercentError: true });
          isAdd = false;
        }
      }
    }
    if (pfAmountType === "Percent" && pfAmount === undefined) {
      this.setState({ pfAmountinPercentError: true });
    } else {
      this.setState({ pfAmountinPercentError: false });
    }

    if (pfAmountType === "Number" && pfAmountInRs === undefined) {
      this.setState({ pfAmountinRsError: true });
    } else {
      this.setState({ pfAmountinRsError: false });
    }

    if (pfAmountType === undefined) {
      this.setState({ pfAmountinRsError: true });
    } else {
      this.setState({ pfAmountinRsError: false });
    }

    let userBranchMapping = [];
    userBranch &&
      userBranch.map((val) => {
        userBranchMapping.push({
          tenure: val.tenure,
        });
      });

    let pincodeData = userBranchMapping.map((item, id) => {
      const numbers = userBranchMapping.map((entry) => entry.tenure);
      return numbers;
    });

    let obj = {
      location:
        (branch && branch.branchName) ||
        (branch && branch[0] && branch[0].branchName),
      schemeCode: schemeCode,
      schemeName: schemeName,
      startDate: startDate,
      endDate: endDate,
      specificDealer:
        (dealerName && dealerName.dealer_name) ||
        (dealerName && dealerName[0] && dealerName[0].dealer_name),
      manufacturer: manufacturer,
      roi: roi,
      // tenure: tenureInMonth,
      advanceEmi: advanceEmi,
      pfAmount: pfAmount,
      documentationCharges: documentCharges,
      anyOtherCharges: anyOtherCharges,
      preEmiChanrges: preEmiCharges,
      bureauCharges: bureauCharges,
      pdd: pdd,
      stampDuty: stampDuty,
      klpiBracket: klpi,
      dealerSubvention: dealerSubvention,
      // dealerPo: dealerPo,
      dealerPoInPercent: dealerPoInPercent,
      dealerPoInRs: dealerPoInRs,
      irr: irr,
      roiActual: roiActual,
      additionalPayout: additionalPayout,
      remarks: remarks,
      nachCharges: nachCharges,
      ltv: ltv,
      schemeStatus: status,
      pfAmountType: pfAmountType,
      dealerPo: dealerPoType,
      managerPo: managerPoType,
      dealerPoType: dealerPoTypeYN,
      // tenure: tenureType,
      id: this.props.verifyObj ? dealerId : null,
      pfAmountInRs: pfAmountInRs,
      tenureList: pincodeData && pincodeData[0],
      // hello: "<html><head>hello</head><body>Hi</body></html>"
    };

    if (isAdd) {
      saveUpdateSchemeMaster(obj).then((response) => {
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
      pincodesOptions,
      errors,
      location,
      schemeCode,
      startDate,
      endDate,
      dealerName,
      manufacturer,
      roi,
      tenureInMonth,
      advanceEmi,
      pfAmount,
      documentCharges,
      anyOtherCharges,
      preEmiCharges,
      bureauCharges,
      pdd,
      stampDuty,
      klpi,
      dealerSubvention,
      dealerPo,
      irr,
      roiActual,
      additionalPayout,
      remarks,
      invalidRoi,
      invalidRoiActual,
      invalidLTV,
      schemeName,
      nachCharges,
      ltv,
      invalidPfAmount,
      invalidDealerPo,
      branchListData,
      branch,
      pfAmountInRs,
      dealerPoInPercent,
      dealerPoInRs,
      tenureOption,
      userBranch,
      tenure,
      pfAmountinPercentError,
      getDealerName,
      pfAmountinRsError,
    } = this.state;
    let statusobj = {};
    let pfAmountTypeObj = {};
    let dealerPoObj = {};
    let managerPoObj = {};
    let dealerPoTypeObj = {};
    // let tenuresObj = {};
    statusOption.map((res) => {
      if (res.value == this.state.status) {
        statusobj = res;
      }
    });
    pfAmountTypeOption.map((res) => {
      if (res.value == this.state.pfAmountType) {
        pfAmountTypeObj = res;
      }
    });
    dealerPoOption.map((res) => {
      if (res.value == this.state.dealerPoType) {
        dealerPoObj = res;
      }
    });
    managerPoOption.map((res) => {
      if (res.value == this.state.managerPoType) {
        managerPoObj = res;
      }
    });
    dealerPoTypeOption.map((res) => {
      if (res.value == this.state.dealerPoTypeYN) {
        dealerPoTypeObj = res;
      }
    });
    // tenureInMonthOption.map((res) => {
    //   if (res.value == this.state.tenureType) {
    //     tenureObj = res;
    //   }
    // });

    let tenuresObj = [];
    tenureOption.map((res) => {
      userBranch &&
        userBranch.map((val) => {
          if (res.tenure == val.tenure) {
            tenuresObj.push(res);
          }
        });
    });

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
              <Modal.Title>Scheme Master</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h4 className="text-center">LOADING...</h4>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Location</label>
                      <Select
                        value={branch}
                        onChange={this.handleBranch}
                        onBlur={() => this.onValidate("branch")}
                        // isMulti
                        options={branchListData}
                        name="branch"
                        getOptionLabel={(option) => option["branchName"]}
                        getOptionValue={(option) => option["branchCode"]}
                      />
                      {/* {errors.branch && (
                        <span className="errorMsg">Please enter Location</span>
                      )} */}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Scheme Code*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="schemeCode"
                        value={schemeCode}
                        onChange={this.handleName}
                        onKeyPress={
                          this.restrictSpecialCharactersNumberWithoutSpace
                        }
                      />
                      {errors.schemeCode && (
                        <span className="errorMsg">
                          Please enter Scheme code
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Scheme Name*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="schemeName"
                        value={schemeName}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharactersNumber}
                      />
                      {errors.schemeName && (
                        <span className="errorMsg">
                          Please enter Scheme Name
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Start Date*</label>
                      <input
                        type="date"
                        className="form-input"
                        name="startDate"
                        value={startDate}
                        onChange={this.handleName}
                      />
                      {errors.startDate && (
                        <span className="errorMsg">
                          Please enter Start Date
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>End Date*</label>
                      <input
                        type="date"
                        className="form-input"
                        name="endDate"
                        value={endDate}
                        onChange={this.handleName}
                      />
                      {errors.endDate && (
                        <span className="errorMsg">Please enter End Date</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Status*</label>
                      <Select
                        value={statusobj}
                        name="status"
                        onChange={this.handleStatus}
                        options={statusOption}
                        placeholder="Status"
                        styles={dropstyle}
                      />
                      {errors.status && (
                        <span className="errorMsg">Please enter Status</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Dealer Name*</label>
                      {/* <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="dealerName"
                        value={dealerName}
                        onChange={this.handleName}
                        onKeyPress={
                          this.restrictSpecialCharactersNumberWithoutDash
                        }
                      /> */}
                      <Select
                        name="dealerName"
                        value={dealerName}
                        onChange={this.handleDealerName}
                        options={getDealerName}
                        getOptionLabel={(option) => option["dealer_name"]}
                        getOptionValue={(option) => option["id"]}
                      />
                      {errors.dealerName && (
                        <span className="errorMsg">
                          Please enter Dealer name
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Dealer PO</label>
                      <Select
                        value={dealerPoObj}
                        name="dealerPo"
                        onChange={this.handleDealerPo}
                        options={dealerPoOption}
                        placeholder="Dealer PO"
                        styles={dropstyle}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Manager PO</label>
                      <Select
                        value={managerPoObj}
                        name="managerPo"
                        onChange={this.handleManagerPo}
                        options={managerPoOption}
                        placeholder="Manager PO"
                        styles={dropstyle}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Manufacturer</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="manufacturer"
                        value={manufacturer}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharactersNumber}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>ROI*</label>
                      <input
                        maxLength="5"
                        type="number"
                        className="form-input capLetters"
                        name="roi"
                        value={roi}
                        onChange={this.handleName}
                        // onKeyPress={this.restrictAlphabets}
                        step="0.01"
                      />
                      {errors.roi && (
                        <span className="errorMsg">Please enter ROI</span>
                      )}
                      {invalidRoi && (
                        <span className="errorMsg">Please enter valid ROI</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Tenure in month*</label>
                      <Select
                        id="tenuresObj"
                        name="tenuresObj"
                        value={tenuresObj}
                        isMulti
                        onChange={this.handleTenures}
                        options={tenureOption}
                        onBlur={() => this.onValidate("tenuresObj")}
                        valueKey="tenure"
                        labelKey="id"
                        getOptionLabel={(option) => option["tenure"]}
                        getOptionValue={(option) => option["id"]}
                        styles={dropstyle}
                      />
                      {errors.tenure && (
                        <span className="errorMsg">Please select Tenure</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Advance EMI</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="advanceEmi"
                        value={advanceEmi}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>PF Amount Type</label>
                      <Select
                        value={pfAmountTypeObj}
                        name="pfAmountType"
                        onChange={this.handlePfAmountType}
                        options={pfAmountTypeOption}
                        styles={dropstyle}
                      />
                    </div>
                    {pfAmountTypeObj.value === "Percent" ? (
                      <>
                        <div className="col-md-3  mt-4" lg={12}>
                          <label>PF Amount Type in %*</label>
                          <input
                            maxLength="5"
                            type="number"
                            className="form-input capLetters"
                            name="pfAmount"
                            value={pfAmount}
                            onChange={this.handleName}
                            // onKeyPress={this.restrictAlphabets}
                            step="0.01"
                          />
                          {pfAmountinPercentError && (
                            <span className="errorMsg">
                              Please enter PF Amount
                            </span>
                          )}
                          {invalidPfAmount && (
                            <span className="errorMsg">
                              Please enter valid PF Amount
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-md-3  mt-4" lg={12}>
                          <label>PF Amount Type in Rs*</label>
                          <input
                            maxLength="100"
                            type="text"
                            className="form-input capLetters"
                            name="pfAmountInRs"
                            value={pfAmountInRs}
                            onChange={this.handlePF}
                            onKeyPress={this.restrictAlphabets}
                          />
                          {pfAmountinRsError && (
                            <span className="errorMsg">
                              Please enter PF Amount
                            </span>
                          )}
                        </div>
                      </>
                    )}
                    <div className="col-md-3 mt-4" lg={12}>
                      <label>Document Charges*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="documentCharges"
                        value={documentCharges}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.documentCharges && (
                        <span className="errorMsg">
                          Please enter Document Charges
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Any Other Charges*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="anyOtherCharges"
                        value={anyOtherCharges}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.anyOtherCharges && (
                        <span className="errorMsg">
                          Please enter Any Other Charges
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Pre EMI Charges*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="preEmiCharges"
                        value={preEmiCharges}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.preEmiCharges && (
                        <span className="errorMsg">
                          Please enter Pre Emi Charges
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Bureau Charges*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="bureauCharges"
                        value={bureauCharges}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.bureauCharges && (
                        <span className="errorMsg">
                          Please enter Bureau Charges
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>NACH Charges*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="nachCharges"
                        value={nachCharges}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.nachCharges && (
                        <span className="errorMsg">
                          Please enter NACH Charges
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>LTV*</label>
                      <input
                        maxLength="5"
                        type="number"
                        className="form-input capLetters"
                        name="ltv"
                        value={ltv}
                        onChange={this.handleName}
                        // onKeyPress={this.restrictAlphabets}
                        step="0.01"
                      />
                      {errors.ltv && (
                        <span className="errorMsg">Please enter LTV</span>
                      )}
                      {invalidLTV && (
                        <span className="errorMsg">Please enter valid LTV</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>PDD*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="pdd"
                        value={pdd}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.pdd && (
                        <span className="errorMsg">Please enter PDD</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Stamp Duty*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="stampDuty"
                        value={stampDuty}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.stampDuty && (
                        <span className="errorMsg">
                          Please enter Stamp Duty
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>KLPI</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="klpi"
                        value={klpi}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Dealer Subvention</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="dealerSubvention"
                        value={dealerSubvention}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                    </div>
                    {dealerPoObj.value === "YES" ? (
                      <>
                        <div className="col-md-3  mt-4" lg={12}>
                          <label>Dealer PO Type</label>
                          <Select
                            value={dealerPoTypeObj}
                            name="dealerPoTypeYN"
                            onChange={this.handleDealerPoType}
                            options={dealerPoTypeOption}
                            styles={dropstyle}
                          />
                        </div>
                        {dealerPoTypeObj.value === "Percent" ? (
                          <>
                            <div className="col-md-3  mt-4" lg={12}>
                              <label>Dealer PO %</label>
                              <input
                                maxLength="5"
                                type="number"
                                className="form-input capLetters"
                                name="dealerPoInPercent"
                                value={dealerPoInPercent}
                                onChange={this.handleName}
                                // onKeyPress={this.restrictAlphabets}
                                step="0.01"
                              />
                              {errors.dealerPoInPercent && (
                                <span className="errorMsg">
                                  Please enter Dealer PO
                                </span>
                              )}
                              {invalidDealerPo && (
                                <span className="errorMsg">
                                  Please enter valid Dealer PO
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-md-3  mt-4" lg={12}>
                              <label>Dealer PO</label>
                              <input
                                maxLength="100"
                                type="text"
                                className="form-input capLetters"
                                name="dealerPoInRs"
                                value={dealerPoInRs}
                                onChange={this.handleDealerPoFunction}
                                onKeyPress={this.restrictAlphabets}
                              />
                              {errors.dealerPoInRs && (
                                <span className="errorMsg">
                                  Please enter Dealer PO
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    ) : null}

                    <div className="col-md-3  mt-4" lg={12}>
                      <label>IRR</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="irr"
                        value={irr}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>ROI Actual*</label>
                      <input
                        maxLength="5"
                        type="number"
                        className="form-input capLetters"
                        name="roiActual"
                        value={roiActual}
                        onChange={this.handleName}
                        // onKeyPress={this.restrictAlphabets}
                        step="0.01"
                      />
                      {errors.roiActual && (
                        <span className="errorMsg">
                          Please enter ROI Actual
                        </span>
                      )}
                      {invalidRoiActual && (
                        <span className="errorMsg">
                          Please enter valid ROI Actual
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Additional Payout</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="additionalPayout"
                        value={additionalPayout}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Remarks</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="remarks"
                        value={remarks}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharactersNumber}
                      />
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
          <CloseSchemeModel
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

export default AddSchemeModel;
