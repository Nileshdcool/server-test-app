import React, { Component } from "react";
import DSACheckerForm from "../DSA/DSACheckerForm";
import { getAllDSA } from "../../Utils/dsa";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export class DsaCheker extends Component {
  state = {
    search: "",
    verifyObj: "",
    showModal: false,
    DSAData: [],
    status: "",
    loading: true,
    view: false,
    dsaContainer: []
  };

  componentWillMount() {
    if (this.props.location.pathname.includes("view")) {
      this.setState({ view: true });
    }
  }

  componentDidMount() {
    this.GetAllDsaList();
  }

  GetAllDsaList = () => {
    let UNVERIFY = "APPROVALPENDING";
    getAllDSA(UNVERIFY).then(response => {
      if (response.data && response.data.error === false) {
        this.setState({
          DSAData:
            response.data && response.data.data ? response.data.data : [],
          dsaContainer:
            response.data && response.data.data ? response.data.data : [],
          loading: false
          // showModal: this.state.showModal == true ? false : false
        });
      }
    });
  };

  addDsa = (id, status) => {
    let dsaData = this.state.DSAData.find(
      (dsaData) => dsaData.applicationNumber === id
    );
    this.setState(
      {
        showModal: !this.state.showModal,
        verifyObj: dsaData ? dsaData.applicationNumber : null,
        status: status
      }
      //() => this.GetAllDsaList()
    );
  };

  search = e => {
    let { dsaContainer } = this.state;
    let array = [];
    dsaContainer.map(res => {
      let name = res.companyName;
      if (
        res.companyName &&
        res.companyPan &&
        res.emailId &&
        res.applicationNumber &&
        res.phoneNumber &&
        res.status &&
        res.updatedDate
      )
        if (
          res.companyName.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.companyPan.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.emailId.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.applicationNumber
            .toLowerCase()
            .match(e.target.value.toLowerCase()) ||
          res.phoneNumber.toString().match(e.target.value.toString()) ||
          res.updatedDate.toString().match(e.target.value.toString()) ||
          res.status
            .toString()
            .toLowerCase()
            .match(e.target.value.toString().toLowerCase())
        ) {
          array.push(res);
        }
    });
    this.setState({
      search: e.target.value,
      DSAData: e.target.value ? array : dsaContainer
    });
  };

  render() {
    const {
      search,
      DSAData,
      verifyObj,
      showModal,
      status,
      loading,
      view
    } = this.state;

    const columns = [
      {
        Header: "Application Number",
        Cell: ({ original }) => {
          return original.applicationNumber;
        }
      },
      {
        Header: "Company Name",
        Cell: ({ original }) => {
          return original.companyName;
        }
      },
      {
        Header: "Company Pan",
        Cell: ({ original }) => {
          return original.companyPan;
        }
      },
      {
        Header: "Email Id",
        Cell: ({ original }) => {
          return original.emailId;
        }
      },
      {
        Header: "Mobile Number",
        Cell: ({ original }) => {
          return original.phoneNumber;
        }
      },
      {
        Header: "Status",
        Cell: ({ original }) => {
          // return original.status;
          if (original.status == "APPROVALPENDING") {
            return "PENDING";
          }
          else if (original.status == "ONHOLD") {
            return "ON HOLD";
          } else {
            return original.status;
          }
        }
      },
      {
        Header: "Updated On",
        accessor: "updateOn",
        Cell: ({ original }) => {
          return original.updatedDate;
        }
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
                  onClick={() =>
                    this.addDsa(original.applicationNumber, original.status)
                  }
                  className="fas fa-user-edit"
                />
              )}
            </div>
          );
        }
      }
    ];

    return (
      <section className="container-fluid">
      <h5 className="text-center mt-5 mx-auto user-box">DSA Checker</h5>
      {/* {this.state.loading ? (
        <h4 className="text-center mt-5">LOADING...</h4>
      ):( */}
        <React.Fragment>
          <div className="d-flex align-items-center mt-5">
            <div className="form-group m-0 search-input">
              <div className="inner-addon right-addon">
                <i className="glyphicon glyphicon-search mt-1 font-size-20"></i>
                <input
                  type="text"
                  className="form-input"
                  name="search"
                  placeholder="Search..."
                  onChange={this.search}
                />
              </div>
            </div>
          </div>
          <div className={`mt-4 react-table`}>
            <ReactTable
              scroll={{ x: "max-content", y: 350 }}
              data={DSAData}
              columns={columns}
              defaultPageSize={10}
              className="-striped -highlight"
            />
          </div>
        </React.Fragment>
        {/* )} */}
      {showModal && (
        <DSACheckerForm
          addDsa={this.addDsa}
          verifyObj={verifyObj}
          status={status}
          fetchDsa={this.GetAllDsaList}
          dsaModule={true}
        />
      )}
      </section>
    );
  }
}

export default DsaCheker;
