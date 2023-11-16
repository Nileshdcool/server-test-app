import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { addRole, getRoleByID, MyRoleList } from "../../Utils/management";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Closemodal from "./Closemodal";
import {Link} from "react-router-dom"
// toast.configure();

class AddRole extends Component {
  state = {
    show: false,
    roleName: "",
    description: "",
    isloading: false,
    showInner: false,
    roleId: 0,
    roleCode: "",
    levelling: "",
    rank: "",
    errors: {
      roleNameError: null,
      descriptionError: null,
    },
  };

  componentDidMount() {
    this.handleShow();
    if (this.props.verifyObj) {
      this.getRoleByUniqueId();
    }
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = (modclose) => {
    if (!modclose) this.modclose();
    this.setState({ show: false });
    this.props.addRole();
  };

  // close = () => {
  //   confirmAlert({
  //     title: "Confirm to Cancel",
  //     message: "Are you sure to do this?",
  //     buttons: [
  //       {
  //         label: "Yes, Cancel It!",
  //         onClick: () => ""
  //       },
  //       {
  //         label: "No",
  //         onClick: () => ""
  //       }
  //     ]
  //   });

  // };

  modclose = (modclose) => {
    this.setState({ showInner: !this.state.showInner });
  };

  handleChange = (e) => {
     const { errors } = this.state;
     let name = e.target.name;
     let value = e.target.value;
     if (value === "" || value === null || value === undefined) {
       this.setState({ errors: { ...errors, [name + "Error"]: true } });
     } else {
       this.setState({ errors: { ...errors, [name + "Error"]: false } });
     }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };


  handleName = (e) => {
     const { errors } = this.state;
     let name = e.target.name;
     let value = e.target.value;
     if (value === "" || value === null || value === undefined) {
       this.setState({ errors: { ...errors, [name + "Error"]: true } });
     } else {
       this.setState({ errors: { ...errors, [name + "Error"]: false } });
     }
      this.setState({
        // roleName: e.target.value,
        roleName: e.target.value,
      });
  };

  close = (close) => {
    this.setState({ showInner: !this.state.showInner });
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
  };

  getRoleByUniqueId = () => {
    this.setState({ isloading: true });
    getRoleByID(this.props.verifyObj && this.props.verifyObj).then(
      (response) => {
        this.setState({ isloading: false });
        let Data = response.data.data && response.data.data;
        this.setState(Data);
      }
    );
  };

  handleSubmit = () => {
    const {
      errors,
      roleName,
      description,
      ipaddress,
      createdDate,
      updatedDate,
      roleId,
      roleCode,
      levelling,
      rank,
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
    let createdBy = null;
    let updatedBy = null;

    let obj = {
      roleName,
      description,
      ipaddress,
      createdDate: +new Date(createdDate),
      updatedDate: +new Date(updatedDate),
      roleId,
      roleCode,
      levelling,
      rank,
    };

    if (isAdd) {
      addRole(obj).then((response) => {
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
            roleName: "",
          });
          this.handleClose();
        }
      });
    }
    this.setState({ errors: { ...errors } });
  };

  render() {
    const {
      show,
      roleName,
      description,
      errors,
      roleId,
      roleCode,
    } = this.state;
    return (
      <React.Fragment>
        <div>
          <Modal
            className="add-role"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={() => {
              this.close();
            }}>
            <Modal.Header closeButton>
              <Modal.Title>
                {this.props.verifyObj ? "Edit" : "Add"} Role
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h4 className="text-center">LOADING...</h4>
              ) : (
                <div>
                  <div className="col-md-12">
                    <label>Role Name</label>
                    <input
                      type="text"
                      pattern="\d*"
                      // maxLength="30"
                      className="form-input capLetters"
                      name="roleName"
                      value={roleName}
                      onChange={this.handleName}
                      style={{ textTransform: "uppercase" }}
                      // onBlur={this.handleValidate}
                      placeholder="Enter Role name"
                      // onInput={(e)=>{e.target.value.toUpperCase()}}
                      //    onInput={(e) => {
                      //     e.target.value = e.target.value.toUpperCase()
                      // }}
                    />
                    {errors.roleNameError && (
                      <span className="errorMsg">Please Enter Role Name</span>
                    )}
                  </div>
                  <div className="form-group mt-2 col-md-12">
                    <label>Description</label>
                    <textarea
                      type="text"
                      pattern="\d*"
                      maxLength="100"
                      className="form-input"
                      name="description"
                      value={description}
                      onChange={this.handleChange}
                      // onBlur={this.handleValidate}
                      placeholder="Enter description"
                    />
                    {errors.descriptionError && (
                      <span className="errorMsg">Please enter description</span>
                    )}
                  </div>
                </div>
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
          <Closemodal
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

export default AddRole;
