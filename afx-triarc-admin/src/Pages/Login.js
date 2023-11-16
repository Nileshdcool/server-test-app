import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { Spinner } from "react-bootstrap";
// import { ClipLoader } from "react-spinners";
import { loginUser } from "../Utils/authentication";
import { getAccessByRoleId } from "../Utils/management";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { syncLogin } from "../Utils/Login";
toast.configure();

export class Login extends Component {
  state = {
    userName: "",
    password: "",
    isLoading: false,
    invaliduserName: false,
    errors: {
      userNameError: null,
      passwordError: null,
    },
    pageId: "",
  };
  handleKeyDown = (e) => {
    if (e.which === 13) {
      this.handleSubmit(e);
    }
  };
  handleValidate = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({
        errors: { ...errors, [name + "Error"]: false },
      });
    }
    if (name === "userName") {
      let userNameRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value && !value.match(userNameRegx)) {
        this.setState({
          invaliduserName: true,
        });
      } else {
        this.setState({
          invaliduserName: false,
        });
      }
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { errors, userName, password } = this.state;
    let isLogin = true;
    for (var val in errors) {
      if (errors[val] === null || errors[val]) {
        errors[val] = true;
        isLogin = false;
      }
    }

    let obj = { userName, password, moduleName: "Admin" };
    if (isLogin) {
      this.setState({ isLoading: true });
      loginUser(obj).then((response) => {
        if (response.data && response.data.error == true) {
          this.setState({ isLoading: false });
          toast.error(response.data && response.data.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 2000,
          });
          this.setState({ password: "" });
          return;
        }

        if (response.data && response.data.error == false) {
          syncLogin(response.data);
          sessionStorage.setItem(
            "userName",
            JSON.stringify(response.data.data)
          );

          let Role = response.data.data && response.data.data.data.roleId;
          getAccessByRoleId(Role).then((response) => {
            this.setState({ isLoading: false });
            let allAccess = response.data && response.data.data;

            // Hide Menu
            let Hidepages =
              allAccess && allAccess.filter((res) => res.accessId == 3);
            let AllHidePages = [];
            Hidepages &&
              Hidepages.map((res) => {
                AllHidePages.push(...res.pageId);
                sessionStorage.setItem(
                  "HidePages",
                  JSON.stringify(AllHidePages)
                );
              });

            // Read menu
            let Readpages =
              allAccess && allAccess.filter((res) => res.accessId == 1);
            let AllReadPages = [];

            // let filterPage =
            //   Readpages && Readpages.filter((res) => res.pageId != 7);

            Readpages &&
              Readpages.map((res) => {
                AllReadPages.push(...res.pageId);
                sessionStorage.setItem(
                  "ReadPages",
                  JSON.stringify(AllReadPages)
                );
              });

            this.props.history.push("/:mode/dashboard");
          });

          setTimeout(() => {
            toast.success(response.data && response.data.data.message, {
              type: toast.TYPE.SUCCESS,
              autoClose: 2000,
            });
          }, 1000);
        }
      });
    }

    this.setState({ errors: { ...errors } });
  };

  handleChange = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({
        errors: { ...errors, [name + "Error"]: false },
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { userName, password, invaliduserName, errors } = this.state;
    return (
      <div>
        <section className="login-section">
          <ToastContainer />
          <div className="page-container">
            <div
              style={{ width: "450px", marginTop: "140px" }}
              className="content">
              <h3 className="text-center title-font mb-3">SIGN IN</h3>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    name="userName"
                    value={userName}
                    onChange={this.handleChange}
                    onBlur={this.handleValidate}
                    onKeyDown={this.handleKeyDown}
                    placeholder="Email ID"
                  />
                  {errors.userNameError && (
                    <span className="errorMsg">Please enter Email ID</span>
                  )}
                  {invaliduserName && (
                    <span className="errorMsg">
                      Please enter valid Email ID
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-input"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    onBlur={this.handleValidate}
                    onKeyDown={this.handleKeyDown}
                    placeholder="Password"
                  />
                  {errors.passwordError && (
                    <span className="errorMsg">Please enter password</span>
                  )}
                </div>
                <div
                  className="form-group"
                  style={{ display: "flex", alignItems: "center" }}>
                  <button
                    type="submit"
                    className="form-submit btn btn-primary"
                    disabled={this.state.isLoading}>
                    {" "}
                    {this.state.isLoading ? (
                      <i
                        class="fa fa-spinner fa-spin"
                        style={{ fontSize: "15px", marginRight: "10px" }}></i>
                    ) : (
                      ""
                    )}
                    {this.state.isLoading ? "Please wait" : "Login"}
                  </button>
                </div>
              </form>
              <div className="form-group m-0">
                <Link
                  to={{
                    pathname: `/forgotpassword`,
                    state: {
                      user: userName,
                    },
                  }}>
                  <i className="fas fa-key mr-2"></i>Forgot password?
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Login;
