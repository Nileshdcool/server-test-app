import React, { Component } from "react";
import ReactTable from "react-table";
import AddCaraouselMaster from "./AddCaraouselModel";
import "react-table/react-table.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getVehicleList, deleteUser } from "../../Utils/master";
import { MyRoleList } from "../../Utils/management";
toast.configure();
export class CaraouselMaster extends Component {
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
    getVehicleList().then((response) => {
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
    getVehicleList().then((response) => {
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

  addUser = (name) => {
    this.setState(
      {
        showAddModal: !this.state.showAddModal,
        verifyObj: name,
      },
      () => this.GetUserPincodeList()
    )
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
      //for searching by vehicletype
      if (res.vehicletype.toLowerCase().match(e.target.value.toLowerCase())) {
        return array.push(res);
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
        Header: "Id",
        Cell: ({ original }) => {
          return original.id;
        },
      },
      {
        Header: "Section",
        Cell: ({ original }) => {
          return original.name;
        },
      },
      {
        Header: "Action",
        disabled: { view },
        // accessor: "delete",
        accessor: "edit",

        Cell: ({ original }) => {
          return (
            <div
              disabled={view}
              onClick={() => this.addUser(original.name)}
              style={{ cursor: "pointer" }}>
              <i
                disabled={view}
                onClick={() => this.addUser(original.name)}
                className="fa fa-pencil-square-o "
                style={{ cursor: "pointer" }}
              />
            </div>
          );
        },
      },
    ];

    const carsousel = [
      {
        id: 1,
        name: "Home",
      },
      {
        id: 2,
        name: "Explore",
      },
    ];

    return (
      <>
        {this.state.loading ? (
          <h4 className="text-center mt-5">LOADING...</h4>
        ) : (
          <section className="container-fluid">
            <h5 className="text-center mt-5 mx-auto user-box" disabled={view}>
              Caraousel Master
            </h5>
            <div className="d-flex align-items-center mt-5">
              {/* <div className="form-group m-0 search-input">
                <div className="inner-addon right-addon">
                  <i className="glyphicon glyphicon-search mt-1 font-size-20"></i>
                  <input
                    type="text"
                    className="form-input"
                    name="search"
                    value={search}
                    onChange={this.search}
                    placeholder="Caraousel Name"
                  />
                </div>
              </div>
              <button
                disabled={view}
                onClick={this.addUser}
                className="add-btnMaster ml-auto btn btn-info btn-lg">
                {" "}
                Add Caraousel{" "}
              </button> */}
              {this.state.showAddModal && (
                <AddCaraouselMaster
                  verifyObj={verifyObj}
                  masterFunction={this.masterFunction}
                  addUser={this.addUser}
                  roleId={roleId}
                />
              )}
            </div>
            <div className={`mt-4 react-table ${view && "disable-tab"}`}>
              <ReactTable
                data={carsousel}
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

export default CaraouselMaster;
