import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import CloseVehicleModel from "./CloseVehicleModel";
import Select from "react-select";
import {
  saveUpdateVehicleMaster,
  getManufacturerMasterList,
  getVehicleTypeMasterList,
  getVehicleSpecificData,
} from "../../Utils/master";
import { BranchList } from "../../Utils/dsa";
toast.configure();

class AddVehicleModel extends Component {
  state = {
    subModel: null,
    location: null,
    vehicleType: null,
    vehicleBrand: null,
    model: null,
    manufacturer: null,
    cc: null,
    onRoadPrice: null,
    maxAmount: null,
    vehicleTypeId: null,
    vehicleMakeId: null,
    vehicleClassVariantId: null,
    vehicleClassId: null,
    branchListData: [],
    getManufacturer: [],
    vehicleTypeData: [],
    branch: null,
    dealerId: null,
    errors: {
      subModel: null,
      model: null,
      cc: null,
      onRoadPrice: null,
      maxAmount: null,
      vehicleTypeId: null,
      vehicleMakeId: null,
      vehicleClassVariantId: null,
      manufacturer: null,
      vehicleType: null,
      branch: null,
      vehicleClassId: null,
    },
  };

  componentDidMount() {
    this.handleShow();
    this.getAllBranchList();
    this.getManufacturerList();
    this.getVehicleTypeList();
    this.getVehicleSpecificDataFunction();
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

  getVehicleTypeList = () => {
    getVehicleTypeMasterList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          vehicleTypeData:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  getVehicleSpecificDataFunction = () => {
    this.setState({ isloading: true });
    let obj = {
      id: this.props.verifyObj,
    };
    getVehicleSpecificData(obj).then((response) => {
      this.setState({ isloading: false });
      this.setState({
        dealerId:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.id,
      });
      this.setState({
        subModel: response.data.data.submodel,
        branch: response.data.data.location,
        vehicleType: response.data.data.vehicletype,
        model: response.data.data.model,
        manufacturer: response.data.data.vehiclebrand,
        maxAmount: response.data.data.maxamt,
        vehicleTypeId: response.data.data.vehicleTypeId,
        vehicleMakeId: response.data.data.vehicleMakeId,
        vehicleClassVariantId: response.data.data.vehicleClassVariantId,
        cc: response.data.data.cc,
        onRoadPrice: response.data.data.onRoadPrice,
        vehicleClassId: response.data.data.vehicleClassId,
      });
    });
  };
  //--------------------------getDataFunction----------------------

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
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleBranch = (branch) => {
    let { errors } = this.state;
    if (branch === "" || branch === null || branch === undefined) {
      this.setState({ errors: { ...errors, branch: true } });
    } else {
      this.setState({ errors: { ...errors, branch: false } });
    }
    this.setState({ branch });
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

  handleVehicleType = (vehicleType) => {
    const { errors } = this.state;
    if (
      vehicleType === "" ||
      vehicleType === null ||
      vehicleType === undefined
    ) {
      this.setState({ errors: { ...errors, vehicleType: true } });
    } else {
      this.setState({ errors: { ...errors, vehicleType: false } });
    }
    this.setState({ vehicleType });
  };

  onValidate = (name) => {
    const { branch, errors } = this.state;
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

  restrictSpecialCharacters = (e) => {
    const regx = "^[a-zA-Z0-9]*$";
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
      subModel,
      location,
      vehicleType,
      model,
      manufacturer,
      cc,
      onRoadPrice,
      maxAmount,
      vehicleBrand,
      vehicleTypeId,
      vehicleMakeId,
      vehicleClassVariantId,
      vehicleClassId,
      branch,
      dealerId,
    } = this.state;

    let isAdd = true;
    for (var val in errors) {
      if (this.props.verifyObj) {
        console.log("ifff");
        if (errors[val]) {
          errors[val] = true;
          isAdd = false;
        }
      } else {
        console.log("Else");
        if (errors[val] === null || errors[val]) {
          errors[val] = true;
          isAdd = false;
        }
      }
    }

    let obj = {
      submodel: subModel,
      location:
        (branch && branch.branchName) ||
        (branch && branch[0] && branch[0].branchName),
      vehicletype:
        (vehicleType && vehicleType.vehicleMaster) ||
        (vehicleType &&
          vehicleType[0] &&
          vehicleType &&
          vehicleType[0].vehicleMaster),
      model: model,
      vehiclebrand:
        (manufacturer && manufacturer.manufacturer) ||
        (manufacturer && manufacturer[0] && manufacturer[0].manufacturer),
      maxamt: parseInt(maxAmount),
      vehicleTypeId: vehicleTypeId,
      vehicleMakeId: parseInt(vehicleMakeId),
      vehicleClassVariantId: parseInt(vehicleClassVariantId),
      mfgYear: 2020,
      cc: parseInt(cc),
      onRoadPrice: parseInt(onRoadPrice),
      vehicleClassId: parseInt(vehicleClassId),
      id: this.props.verifyObj ? dealerId : null,
    };

    if (isAdd) {
      saveUpdateVehicleMaster(obj).then((response) => {
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
      subModel,
      errors,
      location,
      vehicleType,
      manufacturer,
      model,
      cc,
      onRoadPrice,
      maxAmount,
      vehicleBrand,
      vehicleTypeId,
      vehicleMakeId,
      vehicleClassVariantId,
      branchListData,
      branch,
      getManufacturer,
      vehicleTypeData,
      vehicleClassId,
    } = this.state;
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
              <Modal.Title>Vehicle Master</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h4 className="text-center">LOADING...</h4>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Location*</label>
                      <Select
                        value={branch}
                        onChange={this.handleBranch}
                        onBlur={() => this.onValidate("branch")}
                        // isMulti
                        options={branchListData}
                        name="branch"
                        valueKey="branchCode"
                        labelKey="branchName"
                        getOptionLabel={(option) => option["branchName"]}
                        getOptionValue={(option) => option["branchCode"]}
                      />
                      {errors.branch && (
                        <span className="errorMsg">Please enter Location</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Vehicle Type*</label>
                      <Select
                        name="vehicleType"
                        value={vehicleType}
                        onChange={this.handleVehicleType}
                        // isMulti
                        options={vehicleTypeData}
                        getOptionLabel={(option) => option["vehicleMaster"]}
                        getOptionValue={(option) => option["id"]}
                      />
                      {errors.vehicleType && (
                        <span className="errorMsg">
                          Please enter Vehicle Type
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
                      <label>Model*</label>
                      <input
                        maxLength="100"
                        type="text"
                        className="form-input capLetters"
                        name="model"
                        value={model}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharactersNumberWithoutSpace}
                      />
                      {errors.model && (
                        <span className="errorMsg">Please enter Model</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>SubModel*</label>
                      <input
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="subModel"
                        value={subModel}
                        onChange={this.handleName}
                        onKeyPress={this.restrictSpecialCharactersNumberWithoutSpace}
                      />
                      {errors.subModel && (
                        <span className="errorMsg">Please enter Submodel</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>CC*</label>
                      <input
                        min="1"
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="cc"
                        value={cc}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.cc && (
                        <span className="errorMsg">Please enter CC</span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>On Road Price*</label>
                      <input
                        min="1"
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="onRoadPrice"
                        value={onRoadPrice}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.onRoadPrice && (
                        <span className="errorMsg">
                          Please enter On Road Price
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Max Amount*</label>
                      <input
                        min="1"
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="maxAmount"
                        value={maxAmount}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.maxAmount && (
                        <span className="errorMsg">
                          Please enter Max Amount
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Vehicle Type Id*</label>
                      <input
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="vehicleTypeId"
                        value={vehicleTypeId}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.vehicleTypeId && (
                        <span className="errorMsg">
                          Please enter Vehicle Type Id
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Vehicle Make Id*</label>
                      <input
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="vehicleMakeId"
                        value={vehicleMakeId}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.vehicleMakeId && (
                        <span className="errorMsg">
                          Please enter Vehicle Make Id
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Vehicle Class Variant Id*</label>
                      <input
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="vehicleClassVariantId"
                        value={vehicleClassVariantId}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.vehicleClassVariantId && (
                        <span className="errorMsg">
                          Please enter Vehicle Class Variant Id
                        </span>
                      )}
                    </div>
                    <div className="col-md-3  mt-4" lg={12}>
                      <label>Vehicle Class Id*</label>
                      <input
                        maxLength="15"
                        type="text"
                        className="form-input capLetters"
                        name="vehicleClassId"
                        value={vehicleClassId}
                        onChange={this.handleName}
                        onKeyPress={this.restrictAlphabets}
                      />
                      {errors.vehicleClassId && (
                        <span className="errorMsg">
                          Please enter Vehicle Class Id
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
          <CloseVehicleModel
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

export default AddVehicleModel;
