import React, { Component } from "react";
import { logout } from "../Utils/authentication";
import { toast } from "react-toastify";
import {syncLogout} from "../Utils/Login"
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export class Header extends Component {
  state = {
    isLoading: false
  };
  onLogOut = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      logout().then(response => {
        this.setState({ isLoading: false });
        if (response.data && response.data.error === false) {
          syncLogout(response.data)
          sessionStorage.removeItem("userName");
          sessionStorage.removeItem("HidePages");
          sessionStorage.removeItem("ReadPages");
          this.props.history.push("/");
          toast.success("Logout Successfully", {
            type: toast.TYPE.SUCCESS,
            autoClose: 4000
          });
        }
        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 4000
          });
          return false;
        }
      });
    }
  };

  render() {
    return (
      <header>
        <div
          className="dash_head justify-content-end logout-btn"
          disabled={this.state.isLoading}
        >
          <a
            className="button"
            onClick={this.onLogOut}
            disabled={this.state.isLoading}
          >
            <i
              className="logout-icon fas fa-power-off"
              disabled={this.state.isLoading}
            ></i>
            <div
              className="logout font-weight-bold"
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? (
                <i
                  class="fa fa-spinner fa-spin"
                  style={{ fontSize: "24px" }}
                ></i>
              ) : (
                "Logout"
              )}
            </div>
          </a>
        </div>
      </header>
    );
  }
}

export default Header;
