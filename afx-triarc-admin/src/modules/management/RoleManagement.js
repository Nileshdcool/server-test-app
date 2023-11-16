
import React, { Component } from "react";
import AddRole from "./AddRole";
import { MyRoleList, deleteRoleById } from "../../Utils/management";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
toast.configure();

export class RoleManagement extends Component {
  state = {
    search: "",
    showAddModal: false,
    showEditModal: false,
    roleHide: false,
    editObj: "",
    verifyObj: "",
    roleContainer: [],
    roleData: [],
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
    this.RoleList();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  RoleList = () => {
    MyRoleList().then((response) => {
      this.setState({
        roleData:
          response.data && response.data.data
            ? response.data.data.reverse()
            : [],

        roleContainer:
          response.data && response.data.data ? response.data.data : [],
        loading: false,
      });
    });
  };

  addRole = (id) => {
    let roleListData = this.state.roleData.find(
      (roleListData) => roleListData.roleId === id
    );
    this.setState(
      {
        showAddModal: !this.state.showAddModal,
        verifyObj: roleListData ? roleListData.roleId : null,
      },
      () => this.RoleList()
    );
  };

  editRoleData = (val) => {
    let obj = this.state.roleData.find((obj) => obj.roleId === val);
    this.setState(
      {
        showEditModal: !this.state.showEditModal,
        editObj: obj ? obj.uniqueId : null,
      },
      () => this.RoleList()
    );
  };

  deleteRoleData = (obj) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes, Delete It!",
          onClick: () => {
            deleteRoleById(obj).then((response) => {
              if (response.data && response.data.error == false) {
                toast.success(response.data.message, {
                  type: toast.TYPE.SUCCESS,
                  autoClose: 2000,
                });
                this.RoleList();
              }
              // if status is true
              if (response.data && response.data.error == true) {
                toast.error(response.data.message, {
                  type: toast.TYPE.ERROR,
                  autoClose: 2000,
                });
                // this.RoleList();
              }
            });
            // this.RoleList();
          },
        },
        {
          label: "No",
          onClick: () => {
            // toast.error("Role Can Not be Deleted", {
            //   type: toast.TYPE.ERROR,
            //   autoClose: 2000

            // });
            this.RoleList();
          },
        },
      ],
    });
  };

  search = (e) => {
    let { roleContainer } = this.state;
    let array = [];
    roleContainer.map((res) => {
      let roleName = res.roleName;
      if (roleName)
        if (res.roleName.match(e.target.value.toUpperCase())) {
          array.push(res);
        }
    });
    this.setState({
      search: e.target.value,
      roleData: e.target.value ? array : roleContainer,
    });
  };

  render() {
    const { search, roleData, editObj, verifyObj, loading, roleHide, view } =
      this.state;

    const columns = [
      {
        Header: "Role Name",
        width: 250,
        Cell: ({ original }) => {
          return original.roleName.toUpperCase();
        },
      },
      {
        Header: "Description",
        Cell: ({ original }) => {
          return original.description;
        },
      },
      {
        Header: "Action",
        width: 200,
        disabled: { view },
        accessor: "delete",
        accessor: "edit",

        Cell: ({ original }) => {
          return (
            <div
              disabled={view}
              style={{ display: "flex", justifyContent: "space-around" }}>
              <i
                disabled={view}
                onClick={() => this.deleteRoleData(original.roleId)}
                className="fa fa-trash"
                style={{ cursor: "pointer" }}
              />
              <i
                disabled={view}
                onClick={() => this.addRole(original.roleId)}
                className="fas fa-user-edit"
                style={{ cursor: "pointer" }}
              />
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
          <section className="container-fluid">
            <h5 className="text-center mt-5 mx-auto user-box" disabled={view}>
              Role Management
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
                    placeholder="Search..."
                  />
                </div>
              </div>
              <button
                disabled={view}
                onClick={this.addRole}
                className="add-btn ml-auto btn btn-info btn-lg">
                {" "}
                Add Role{" "}
              </button>
              {this.state.showAddModal && (
                <AddRole verifyObj={verifyObj} addRole={this.addRole} />
              )}
            </div>
            <div className={`mt-4 react-table ${view && "disable-tab"}`}>
              <ReactTable
                data={roleData}
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

export default RoleManagement;

