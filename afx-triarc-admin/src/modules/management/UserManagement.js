import React, { Component } from "react";
import EditUser from "./Add-EditUser";
import { getUserList } from "../../Utils/management";
import ReactTable from "react-table";
import { ClipLoader } from "react-spinners";
import "react-table/react-table.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export class UserManagement extends Component {
  state = {
    search: "",
    showAddModal: false,
    showEditModal: false,
    verifyObj: "",
    matchRole: "",
    DSAData: [],
    userData: [{}],
    dsaContainer: [],
    filtered: [],
    loading: true,
    view: false,
  };

  componentWillMount() {
    if (this.props.location.pathname.includes("view")) {
      this.setState({ view: true });
    }
    window.scroll(0, 0);
  }

  componentDidMount() {
    this.UserList();
  }

  handleChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => this.searchList()
    );
  };

  UserList = () => {
    getUserList().then((response) => {
      this.setState({
        userData: response.data && response.data.data ? response.data.data : [],

        dsaContainer:
          response.data && response.data.data ? response.data.data : [],
        loading: false,
      });
    });
  };

  // searchList = () => {
  //   const { search } = this.state;
  //   getSearchUser(search).then(response => {
  //     this.setState({
  //       filtered: response.data && response.data.data ? response.data.data : []
  //     });
  //   });
  // };

  search = (e) => {
    let { dsaContainer } = this.state;
    let array = [];
    dsaContainer.map((res) => {
      let name = res.employeeName;
      if (
        res.employeeName &&
        res.role &&
        res.role.roleName &&
        res.employeeId &&
        res.status &&
        res.mobileNo
      )
        if (
          res.employeeName.toLowerCase().match(e.target.value.toLowerCase()) ||
          (res.role &&
            res.role.roleName
              .toLowerCase()
              .match(e.target.value.toLowerCase())) ||
          res.employeeId.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.status.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.mobileNo.toString().match(e.target.value.toString())
        ) {
          return array.push(res);
        }
    });
    this.setState({
      search: e.target.value,
      userData: e.target.value ? array : dsaContainer,
    });
  };

  addUser = (id) => {
    let userListData = this.state.userData.find(
      (userListData) => userListData.employeeId === id
    );
    this.setState(
      {
        showAddModal: !this.state.showAddModal,
        verifyObj: userListData ? userListData.employeeId : null,
        matchRole: userListData ? userListData.role : null,
      },
      () => this.UserList()
    );
  };

  render() {
    const {
      search,
      userData,
      verifyObj,
      matchRole,
      filtered,
      loading,
      DSAData,
      view,
    } = this.state;
    const columns = [
      {
        Header: "User Id",
        Cell: ({ original }) => {
          return original.employeeId;
        },
      },
      {
        Header: "Employee Name",
        Cell: ({ original }) => {
          return original.employeeName.toUpperCase();;
        },
      },
      {
        Header: "Mobile No",
        Cell: ({ original }) => {
          return original.mobileNo;
        },
      },
      {
        Header: "Role",
        Cell: ({ original }) => {
          return original.role && original.role.roleName;
        },
      },
      {
        Header: "Status",
        Cell: ({ original }) => {
          return original.status;
        },
      },
      {
        Header: "Action",
        accessor: "edit",
        Cell: ({ original }) => {
          return (
            <div disabled={view}>
              {view ? (
                <i className="fas fa-user-edit" />
              ) : (
                <i
                  onClick={() => this.addUser(original.employeeId)}
                  className="fas fa-user-edit"
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          );
        },
      },
    ];

    return (
      <React.Fragment>
        {this.state.loading ? (
          <h4 className="text-center mt-5">LOADING...</h4>
        ) : (
          <section className="container-fluid mr-5">
            <h5 className="text-center mt-5 mx-auto user-box">
              User Management
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
                    onBlur={this.handleValidate}
                    placeholder="Search..."
                  />
                </div>
              </div>
              <button
                disabled={view}
                onClick={this.addUser}
                className="add-btn ml-auto btn btn-info btn-lg">
                {" "}
                Add User{" "}
              </button>
              {this.state.showAddModal && (
                <EditUser
                  verifyObj={verifyObj}
                  addUser={this.addUser}
                  matchRole={matchRole}
                />
              )}
            </div>
            <div className={`mt-4`}>
              <ReactTable
                data={userData}
                columns={columns}
                defaultPageSize={10}
              />
            </div>
          </section>
        )}
      </React.Fragment>
    );
  }
}

export default UserManagement;
