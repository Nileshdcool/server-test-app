import React, { Component } from "react";
import ReactTable from "react-table";
import AddDealerModel from "./AddDealerModel";
import "react-table/react-table.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getDealerList, deleteUser } from "../../Utils/master";
import { MyRoleList } from "../../Utils/management";
toast.configure();
export class DealerMaster extends Component {
  state = {
    search: "",
    showAddModal: false,
    showEditModal: false,
    roleHide: false,
    editObj: "",
    verifyObj: "",
    userContainer: [],
    userData: [],
    loading: true,
    view: false,
    userPincode: [{}],
    roleId: "",
  };

  componentDidMount() {
    this.GetUserPincodeList();
    this.GetRoleId();
  }

  componentWillMount() {
    //-------------------for View-----------------------
    if (this.props.location.pathname.includes("view")) {
      this.setState({ view: true });
    }
    window.scroll(0, 0);
  }

  //-------------------for not updating on reload-------------------------------
  masterFunction = () => {
    getDealerList().then((response) => {
      this.setState({
        userPincode:
          response.data && response.data.data ? response.data.data : [],
        loading: false,
        userContainer:
          response.data && response.data.data ? response.data.data : [],
      });
    });
  };
  //------------------for not updating on reload-------------------------------

  //------------------for getting user with there pincode api-function---------
  GetUserPincodeList = () => {
    getDealerList().then((response) => {
      this.setState({
        userPincode:
          response.data && response.data.data ? response.data.data : [],
        loading: false,
        userContainer:
          response.data && response.data.data ? response.data.data : [],
      });
    });
  };

  GetRoleId = () => {
    MyRoleList().then((response) => {
      response &&
        response.data &&
        response.data.data.map((item) => {
          if (item.roleName === "FI") {
            this.setState({ roleId: item.roleId });
          }
        });
    });
  };
  //------------------for getting user with there pincode api-function---------

  addUser = (id) => {
    let userListData = this.state.userPincode.find(
      (userListData) => userListData.id === id
    );
    this.setState(
      {
        showAddModal: !this.state.showAddModal,
        verifyObj: userListData ? userListData.id : null,
      },
      () => this.GetUserPincodeList()
    );
  };

  deleteRoleData = (employeeId, userName) => {
    let obj = { employeeId: employeeId, userName: userName };
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes, Delete It!",
          onClick: () => {
            deleteUser(obj).then((response) => {
              if (response.data && response.data.error == false) {
                toast.success(response.data.message, {
                  type: toast.TYPE.SUCCESS,
                  autoClose: 2000,
                });
                this.GetUserPincodeList();
              }
              if (response.data && response.data.error == true) {
                toast.error(response.data.message, {
                  type: toast.TYPE.ERROR,
                  autoClose: 2000,
                });
                this.GetUserPincodeList();
              }
            });
            this.GetUserPincodeList();
          },
        },
        {
          label: "No",
          onClick: () => {
            this.GetUserPincodeList();
          },
        },
      ],
    });
  };

  //------------------------------------searching----------------------------------
  search = (e) => {
    let { userContainer } = this.state;
    let array = [];
    userContainer.map((res) => {
      //for searching by dealer_name
      if (res.dealer_name) {
        if (res.dealer_name.toLowerCase().match(e.target.value.toLowerCase())) {
          return array.push(res);
        }
      }

      //for searching by dealerCode
      if (res.dealerCode) {
        if (res.dealerCode.toLowerCase().match(e.target.value.toLowerCase())) {
          return array.push(res);
        }
      }

      //for searching by dealerType
      if (res.dealerType) {
        if (res.dealerType.toLowerCase().match(e.target.value.toLowerCase())) {
          return array.push(res);
        }
      }

      //for searching by branch
      if (res.branch) {
        if (res.branch.toLowerCase().match(e.target.value.toLowerCase())) {
          return array.push(res);
        }
      }

      //for searching by city
      if (res.city) {
        if (res.city.toLowerCase().match(e.target.value.toLowerCase())) {
          return array.push(res);
        }
      }

      //for searching by state
      if (res.state) {
        if (res.state.toLowerCase().match(e.target.value.toLowerCase())) {
          return array.push(res);
        }
      }
    });
    this.setState({
      search: e.target.value,
      userPincode: e.target.value ? array : userContainer,
    });
  };
  //-----------------------------------searching------------------------------------

  render() {
    const roleId = this.state.roleId;
    const { search, userPincode, verifyObj, view, pincode } = this.state;
    const columns = [
      {
        Header: "Dealer Code",
        Cell: ({ original }) => {
          return original.dealerCode;
        },
      },
      {
        Header: "Dealer Name",
        Cell: ({ original }) => {
          return original.dealer_name;
        },
      },
      {
        Header: "Dealer Type",
        Cell: ({ original }) => {
          return original.dealerType;
        },
      },
      {
        Header: "Branch",
        Cell: ({ original }) => {
          return original.branch;
        },
      },
      {
        Header: "City",
        Cell: ({ original }) => {
          return original.city;
        },
      },
      {
        Header: "State",
        Cell: ({ original }) => {
          return original.state;
        },
      },
      {
        Header: "Action",
        disabled: { view },
        accessor: "edit",
        Cell: ({ original }) => {
          return (
            <div
              disabled={view}
              style={{ display: "flex", justifyContent: "space-around" }}>
              <i
                disabled={view}
                onClick={() => this.addUser(original.id)}
                className="fas fa-user-edit"
                style={{ cursor: "pointer" }}
              />
            </div>
          );
        },
      },
    ];
    return (
      <>
        {this.state.loading ? (
          <h4 className="text-center mt-5">LOADING...</h4>
        ) : (
          <section className="container-fluid">
            <h5 className="text-center mt-5 mx-auto user-box" disabled={view}>
              Dealer Master
            </h5>
            <div className="d-flex align-items-center mt-5">
              <div className="form-group m-0 search-input">
                <div className="inner-addon right-addon">
                  <i className="glyphicon glyphicon-search mt-1 font-size-20"></i>
                  <input
                    type="text"
                    className="form-input"
                    name="search"
                    value={search}
                    onChange={this.search}
                    placeholder="Dealer Name"
                  />
                </div>
              </div>
              <button
                disabled={view}
                onClick={this.addUser}
                className="add-btnMaster ml-auto btn btn-info btn-lg">
                {" "}
                Add Dealer{" "}
              </button>
              {this.state.showAddModal && (
                <AddDealerModel
                  verifyObj={verifyObj}
                  masterFunction={this.masterFunction}
                  addUser={this.addUser}
                  roleId={roleId}
                />
              )}
            </div>
            <div className={`mt-4 react-table ${view && "disable-tab"}`}>
              <ReactTable
                data={userPincode}
                columns={columns}
                defaultPageSize={10}
              />
            </div>
          </section>
        )}
      </>
    );
  }
}

export default DealerMaster;
