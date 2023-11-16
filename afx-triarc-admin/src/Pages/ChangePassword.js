import React, { Component } from "react";
import { updatePassword } from "../Utils/authentication";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class UpdatePassword extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      newpassword: "",
      oldpassword: "",
      confpassword: "",
      invalidPassword: false,
      invalidNewPassword: false,
      invalidconfpassword: false,
      isLoading: false,
      view: false,
      errors: {
        oldpasswordError: null,
        newpasswordError: null,
        confpasswordError: null
      }
    };
  }

  componentWillMount() {
    let data = JSON.parse(sessionStorage.getItem("userName"));
    this.setState({
      userName: data && data.data.userName
    });
    if (this.props.location.pathname.includes("view")) {
      this.setState({ view: true });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleValidate = e => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;

    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }

    if (name === "newpassword") {
      let passwordRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[a-z]).{8,}$/;
      if (value && value == this.state.oldpassword && this.state.oldpassword) {
        this.setState({
          invalidNewPassword: true
        });
      } else {
        this.setState({
          invalidNewPassword: false
        });
      }
      if (value && !value.match(passwordRegx)) {
        this.setState({
          invalidPassword: true
        });
      } else {
        this.setState({
          invalidPassword: false
        });
      }
    }
    if (name === "confpassword") {
      if (value && value !== this.state.newpassword) {
        this.setState({
          invalidconfpassword: true
        });
      } else {
        this.setState({
          invalidconfpassword: false
        });
      }
    }
  };

  handleSubmit = e => {
    const {
      errors,
      userName,
      invalidPassword,
      invalidconfpassword,

      oldpassword,
      newpassword,
      confpassword
    } = this.state;
    // debugger;
    let isSuccess = true;
    for (var val in errors) {
      if (errors[val] === null || errors[val]) {
        errors[val] = true;
        isSuccess = false;
      }
    }

    // let data = JSON.parse(sessionStorage.getItem("userName"));
    let username = userName;
    // let username = data.userName;

    let obj = { newpassword, oldpassword, username:this.state.userName, password:this.state.newpassword };
    if (isSuccess && isSuccess) {
      this.setState({ isLoading: true });
      updatePassword(obj).then(response => {
        this.setState({ isLoading: false });
        if (response.data && response.data.error === false) {
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 2000
          });
        }
        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 2000
          });
          return false;
        }
      });
    }

    this.setState({ errors: { ...errors } });
    e.preventDefault();
    this.setState({
      newpassword: "",
      oldpassword: "",
      confpassword: ""
    });
  };

  render() {
    const {
      newpassword,
      oldpassword,
      confpassword,
      invalidPassword,
      invalidNewPassword,
      invalidconfpassword,
      errors,
      view,
    } = this.state;

    return (
      <section className="tab-body">
        <h5 className="text-center mt-3 mb-5 mx-auto user-box">
          Change Password
        </h5>
        <div className={`row ${view && "disable-tab"}`}>
          <div style={{ width: "400px" }} className="content col-md-5">
            <div className="form-group">
              <input
                type="password"
                pattern="\d*"
                maxLength="50"
                className="form-input"
                name="oldpassword"
                value={oldpassword}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
                placeholder="Old password"
              />
              {errors.oldpasswordError && (
                <span className="errorMsg">Please enter old password</span>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                pattern="\d*"
                maxLength="50"
                className="form-input"
                name="newpassword"
                value={newpassword}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
                placeholder="New password"
              />
              {errors.newpasswordError && (
                <span className="errorMsg">Please enter new password</span>
              )}
              {invalidNewPassword && (
                <span className="errorMsg">
                  Old Password And New password Can Not be Same.
                </span>
              )}
              <br />
              {invalidPassword && (
                <span className="errorMsg">
                  Password must contain at least 8 characters, including
                  uppercase, lowercase and numbers
                </span>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                pattern="\d*"
                maxLength="50"
                className="form-input"
                name="confpassword"
                value={confpassword}
                onChange={this.handleChange}
                onBlur={this.handleValidate}
                placeholder="Confirm password"
              />
              {errors.confpasswordError && (
                <span className="errorMsg">
                  Please enter confirm password
                </span>
              )}
              {invalidconfpassword && (
                <span className="errorMsg">
                  Confirm password does not match
                </span>
              )}
            </div>
            <div className="form-group">
              <button
                onClick={this.handleSubmit}
                disabled={
                  invalidconfpassword ||
                  invalidNewPassword ||
                  invalidPassword ||
                  view
                }
                className="form-submit"
                // disabled={this.state.isLoading}
              >
                Update Password
                {this.state.isLoading ? (
                  <i
                    class="fa fa-spinner fa-spin"
                    style={{ fontSize: "24px" }}
                  ></i>
                ) : (
                  ""
                )}
              </button>
            </div>
          </div>
          <div className="col-md-7">
            <img
              className="px-5"
              src="./assets/images/update-password.jpg"
            />
          </div>
        </div>
      </section>
    );
  }
}

export default UpdatePassword;
