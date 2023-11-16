import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import CloseFaqModel from "./CloseFaqModel";
import {
  saveUpdateFaqMaster,
  getManufacturerMasterList,
  getVehicleTypeMasterList,
  getFaqSpecificData,
} from "../../Utils/master";
import { BranchList } from "../../Utils/dsa";
import Select from "react-select";
toast.configure();

const statusOption = [
  { id: 1, value: "Active", label: "Active" },
  { id: 2, value: "Inactive", label: "Inactive" },
];

class AddFaqModel extends Component {
  state = {
    answer: null,
    question: null,
    status: null,
    errors: {
      answer: null,
      question: null,
      status: null
    },
  };

  componentDidMount() {
    this.handleShow();
    this.getAllBranchList();
    this.getManufacturerList();
    this.getVehicleTypeList();
    this.getFaqSpecificDataFunction();
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.state.bikeImageData !== prevState.bikeImageData) {
      if (this.state.bikeImageData.length >= 2) {
        this.setState({ bikeError: false });
      } else {
        this.setState({ bikeError: true });
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

  getFaqSpecificDataFunction = () => {
    this.setState({ isloading: true });
    let obj = {
      id: this.props.verifyObj,
    };
    getFaqSpecificData(obj).then((response) => {
      this.setState({ isloading: false });
      this.setState({
        answer:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.answer,
        question:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.question,
        status:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.status,
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

  handleStatus = (status) => {
    this.setState({ status: status && status.value });
  };

  //-----------------------------all keyPress events--------------------------

  //--------------------------------submitButton onChange--------------------------
  handleSubmit = (e) => {
    const { errors, answer, question, status } = this.state;

    let isAdd = true;
    // for (var val in errors) {
    //   if (this.props.verifyObj) {
    //     if (errors[val]) {
    //       errors[val] = true;
    //       isAdd = false;
    //     }
    //   } else {
    //     if (errors[val] === null || errors[val]) {
    //       errors[val] = true;
    //       isAdd = false;
    //     }
    //   }
    // }

    let obj = {
      question: question,
      answer: answer,
      status: status,
      id: this.props.verifyObj ? (this.props.verifyObj) : null
    };

    if (isAdd) {
      saveUpdateFaqMaster(obj).then((response) => {
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

  addToMappingList = (e, imageName) => {
    const temp = this.state.bikeImageData.map((items, index) => {
      if (items.documentType === imageName) {
        items.isdisplay = !items.isdisplay;
      } else {
        items.isdisplay = false;
      }
      return items;
    });
    this.setState({ bikeImageData: temp });
  };

  //---------------------------------Submit Button onChange---------------------

  render() {
    const { show, answer, errors, question, status } = this.state;

    let statusObj = {};

    statusOption.map((res) => {
      if (res.value == this.state.status) {
        statusObj = res;
      }
    });

    const dropstyle = {
      container: (base) => ({
        ...base,
        flex: 1,
      }),
    };

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
              <Modal.Title>FAQ Master</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h4 className="text-center">LOADING...</h4>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-12  mt-4" lg={12}>
                      <label>Question*</label>
                      <input
                        type="text"
                        className="form-input capLetters"
                        name="question"
                        value={question}
                        onChange={this.handleName}
                      />
                      {errors.question && (
                        <span className="errorMsg">Please enter Question</span>
                      )}
                    </div>
                    <div className="col-md-12  mt-4" lg={12}>
                      <label>Answer*</label>
                      <input
                        type="text"
                        className="form-input capLetters"
                        name="answer"
                        value={answer}
                        onChange={this.handleName}
                      />
                      {errors.answer && (
                        <span className="errorMsg">Please enter Answer</span>
                      )}
                    </div>
                    <div className="col-md-12  mt-4" lg={12}>
                      <label>Status</label>
                      <Select
                        value={statusObj}
                        name="status"
                        onChange={this.handleStatus}
                        options={statusOption}
                        placeholder="Status"
                        styles={dropstyle}
                      />
                    </div>
                    <br />
                  </div>
                  <br />
                </>
                
              )}
            </Modal.Body>
            <Modal.Footer show={this.state.showInner}>
              <Button className="btn-danger" onClick={this.modclose}>
                Cancel
              </Button>
              <Button
                className="btn-success"
                onClick={(e) => {
                  this.handleSubmit();
                }}
                disabled={!(answer && question)}>
                {this.props.verifyObj ? "Update" : "Add"}
              </Button>
            </Modal.Footer>
          </Modal>
          <CloseFaqModel
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

export default AddFaqModel;