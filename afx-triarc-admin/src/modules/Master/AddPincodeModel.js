import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import ClosePincodeModel from "./ClosePincodeModel";
import Select from "react-select";
import {
  getFIUsers,
  saveUpdateUserPincodeMapping,
  getUserPincodeMapping,
  getState,
  getDistrict,
  saveUpdateStateDistrict,
  getUserPincodeList,
} from "../../Utils/master";
// import { MyRoleList } from "../../Utils/management";
toast.configure();

class AddPincodeModel extends Component {
  state = {
    show: false,
    pincode: "",
    userName: null,
    stateName: null,
    districtName: null,
    pincodeList: null,
    state: "",
    district: "",
    pincodeOption: [],
    fiUserOption: [],
    stateOption: [],
    districtOption: [],
    pincodesOptions: [],
    user: null,
    roleId:""
  };

  componentDidMount() {
    this.handleShow();
    this.getFIUsersListData();
    this.StateData();
    if (this.props.verifyObj) {
      this.GetUserPincodeData();
    }
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.state.districtName !== prevState.districtName) {
      if (this.state.districtName === null) {
        this.setState({ pincode: null });
      }
    }
    if (this.state.stateName !== prevState.stateName) {
      if (this.state.stateName) {
        let stateName = this.state.stateName;
        let stateObj = stateName && stateName[0] && stateName[0].stateName;
        if (stateObj) {
          getDistrict({ state: stateObj }).then((response) => {
            if (response.data && response.data.error == false) {
              this.setState({
                districtOption:
                  response.data && response.data.data ? response.data.data : [],
              });
            }
          });
        }
      }
    }
    if (
      this.state.stateName !== prevState.stateName ||
      this.state.districtName !== prevState.districtName
    ) {
      if (this.state.stateName && this.state.districtName) {
        let stateName = this.state.stateName;
        let districtName = this.state.districtName;
        let stateObj = stateName && stateName[0] && stateName[0].stateName;
        let distObj =
          districtName && districtName[0] && districtName[0].districtName;
        if (stateObj && distObj) {
          saveUpdateStateDistrict({ state: stateObj, district: distObj }).then(
            (response) => {
              this.setState({ pincodesOptions: response.data.data });
              if (response.data && response.data.error === false) {
                toast.success(response.data.message, {
                  type: toast.TYPE.SUCCESS,
                });
              }
              if (response.data && response.data.error === true) {
                toast.error(response.data.message, {
                  type: toast.TYPE.ERROR,
                });
              }
            }
          );
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

  //-------------------------------getDataFunction-----------------------------
  GetUserPincodeList = () => {
    getUserPincodeList().then((response) => {
      this.setState({
        userPincode:
          response.data && response.data.data ? response.data.data : [],
        loading: false,
        userContainer:
          response.data && response.data.data ? response.data.data : [],
      });
    });
  };

  GetUserPincodeData = () => {
    this.setState({ isloading: true });
    let obj = {
      userName: this.props.verifyObj,
    };
    getUserPincodeMapping(obj).then((response) => {
      console.log("response.data.data.state", response.data.data.state);
      this.setState({ isloading: false });
      this.setState({
        userName: response.data.data.user,
        pincode: response.data.data.pincodeList,
        stateName: response.data.data.state,
        districtName: response.data.data.district,
      });
    });
  };

   getFIUsersListData = () => {
    let obj = { roleId: this.props.roleId };
    getFIUsers(obj).then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          fiUserOption:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  StateData = () => {
    getState().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          stateOption:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  //----------------------------------------getDataFunction-----------------------------------

  //----------------------------------------all handleOnChanges------------------------------
  handleUserName = (userName) => {
    this.setState({ userName });
  };

  handlePincode = (pincode) => {
    this.setState({ pincode });
  };

  handleState = (stateName) => {
    this.setState({ districtName: null });
    this.setState({ pincodesOptions: [] });
    this.setState({ stateName });
    let stateObj = stateName.stateName;
    let obj = { state: stateObj };
    getDistrict(obj).then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          districtOption:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  handleDistrict = (districtName) => {
    this.setState({ districtName });
    this.setState({ pincode: null });
    this.setState({ districtName: districtName }, function () {
      let stateObj = this.state.stateName;
      let distObj = this.state.districtName;
      let state = stateObj.stateName || stateObj[0].stateName;
      let district = distObj.districtName || distObj[0].districtName;
      let obj = { state, district };
      saveUpdateStateDistrict(obj).then((response) => {
        this.setState({ pincodesOptions: response.data.data });
        if (response.data && response.data.error === false) {
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
          });
        }
        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
          });
        }
      });
    });
  };
  //--------------------------------all handleOnChanges---------------------------

  //--------------------------------submitButton onChange--------------------------
  handleSubmit = () => {
    console.log("this.state.pincode-->", this.state.pincode);
    const { errors, userName } = this.state;
    let pincodeData = this.state.pincode.map((item, id) => {
      const numbers = this.state.pincode.map((entry) => entry.pincode);
      return numbers;
    });
    let stateObj = this.state.stateName;
    let districtObj = this.state.districtName;

    let obj = {
      pincodList: pincodeData[0],
      userName: userName.userName || userName[0].userName,
      employeeId: userName.employeeId || userName[0].employeeId,
      type: this.props.verifyObj ? "update" : "save",
      state: stateObj.stateName || stateObj[0].stateName,
      district: districtObj.districtName || districtObj[0].districtName,
    };
    saveUpdateUserPincodeMapping(obj).then((response) => {
      if (response.data && response.data.error === false) {
        toast.success(response.data.message, {
          type: toast.TYPE.SUCCESS,
        });
        this.handleClose();
        this.modclose();
        this.GetUserPincodeList();
        this.props.masterFunction();
      }
      if (response.data && response.data.error === true) {
        toast.error(response.data.message, {
          type: toast.TYPE.ERROR,
        });
        this.handleClose();
        this.modclose();
        this.GetUserPincodeList();
        this.props.masterFunction();
      }
    });
    this.setState({ errors: { ...errors } });
  };
  //---------------------------------Submit Button onChange---------------------

  render() {
    const {
      show,
      pincode,
      userName,
      fiUserOption,
      stateOption,
      stateName,
      districtName,
      districtOption,
      pincodesOptions,
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
              <Modal.Title>User to Pin code Mapping Master</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h4 className="text-center">LOADING...</h4>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-3" lg={12}>
                      {this.props.verifyObj ? (
                        <Select
                          name="userName"
                          value={userName}
                          onChange={this.handleUserName}
                          placeholder="Select FI Users"
                          options={fiUserOption}
                          valueKey="id"
                          labelKey="userName"
                          getOptionLabel={(option) => option["userName"]}
                          getOptionValue={(option) => option["id"]}
                          isDisabled={true}
                        />
                      ) : (
                        <Select
                          name="userName"
                          value={userName}
                          onChange={this.handleUserName}
                          placeholder="Select FI Users"
                          options={fiUserOption}
                          valueKey="id"
                          labelKey="userName"
                          getOptionLabel={(option) => option["userName"]}
                          getOptionValue={(option) => option["id"]}
                        />
                      )}
                    </div>
                    <div className="col-md-3" lg={12}>
                      <Select
                        value={stateName}
                        onChange={this.handleState}
                        placeholder="States"
                        options={stateOption}
                        getOptionLabel={(option) => option["stateName"]}
                        getOptionValue={(option) => option["id"]}
                      />
                    </div>
                    <div className="col-md-3" lg={12}>
                      <Select
                        value={districtName}
                        onChange={this.handleDistrict}
                        placeholder="District"
                        options={districtOption}
                        getOptionLabel={(option) => option["districtName"]}
                        getOptionValue={(option) => option["id"]}
                      />
                    </div>
                    <div className="col-md-3" lg={12}>
                      <Select
                        name="pincode"
                        value={pincode}
                        onChange={this.handlePincode}
                        placeholder="Pincodes"
                        isMulti
                        options={pincodesOptions}
                        getOptionLabel={(option) => option["pincode"]}
                        getOptionValue={(option) => option["id"]}
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
              <Button
                className="btn-success"
                onClick={this.handleSubmit}
                disabled={!districtName || !stateName || !pincode || !userName}>
                {this.props.verifyObj ? "Update" : "Add"}
              </Button>
            </Modal.Footer>
          </Modal>
          <ClosePincodeModel
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

export default AddPincodeModel;
