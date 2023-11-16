import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {getAccessByRoleId} from "../../Utils/management"
import "react-toastify/dist/ReactToastify.css";
// import { Item } from "react-bootstrap/lib/carousel";
toast.configure();

export class DashBoard extends Component {
  state = {
    roleData: null,
    pageIdData: false,
    pageDa: false,
  };

  componentDidMount() {
    let roleId = localStorage.getItem("roleId");
    getAccessByRoleId(roleId).then((response) => {
      this.setState({ roleData: response.data.data });
      let role = response.data.data.map((item) => {
        this.setState({ pageIdData: item.pageId });
      });
    });
  }

  componentWillMount() {
    window.scroll(0, 0);
  }

  render() {
    return (
      <div className="dashz_grid">
        <main>
          <section className="container-fluid dash_space admin-dashboard">
            <div className="row mt-2">
              <div className="col-md-4">
                <div className="card2 bg-white">
                  <div className="card-body">
                    <div className="text-center">
                      <div className="d-flex justify-content-center">
                        <i className="fas fa-users bg1 fa-3x m-0"></i>
                      </div>
                      <p className="font-weight-normal mt-3">Role</p>
                      <p className="font-weight-normal fs-24">
                        <Link
                          className="title-blue"
                          to="/:modeName/role-management">
                          Role Management
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card2 bg-white">
                  <div className="card-body">
                    <div className="text-center">
                      <div className="d-flex justify-content-center">
                        <i className="fas fa-user-plus fa-3x bg2 m-0"></i>
                      </div>
                      <p className="font-weight-normal mt-3">Users</p>
                      <p className="font-weight-normal fs-24">
                        <Link
                          className="title-blue"
                          to="/:modeName/user-management">
                          Users
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-md-4">
                <div className="card2 bg-white">
                  <div className="card-body">
                    <div className="text-center">
                      <div className="d-flex justify-content-center">
                        <i className="fas fa-money-check-alt fa-3x bg3 m-0"></i>
                      </div>
                      <p className="font-weight-normal mt-3">DSA</p>
                      <p className="font-weight-normal fs-24">
                        <Link className="title-blue" to="/:modeName/dsa-maker">
                          DSA
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default DashBoard;
