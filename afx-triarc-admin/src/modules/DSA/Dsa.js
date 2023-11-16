import React, { Component } from "react";
import { getAllDSA } from "../../Utils/dsa";
import ReactTable from "react-table";
import "react-table/react-table.css";
import DSACheckerForm from "./DSACheckerForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
export class Dsa extends Component {
  state = {
    search: "",
    dsaData: "",
    showModal: false,
    DSAData: [],
    loading: true,
    view: false,
    dsaContainer: [],
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
    let UNVERIFY = "APPROVED";
    getAllDSA(UNVERIFY).then((response) => {
      if (response.data && response.data.error === false) {
        this.setState({
          DSAData:
            response.data && response.data.data ? response.data.data : [],
          dsaContainer:
            response.data && response.data.data ? response.data.data : [],
          loading: false,
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
        status: status,
      },
      // () => this.GetAllDsaList()
    );
  };
  
  search = (e) => {
    let { dsaContainer } = this.state;
    let array = [];
    dsaContainer.map((res) => {
      let name = res.companyname;
      if (
        res.companyname &&
        res.companypan &&
        res.emailId &&
        res.applicationNumber &&
        res.phoneNumber &&
        res.status &&
        res.dsacode
      )
        if (
          res.companyname.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.companypan.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.emailId.toLowerCase().match(e.target.value.toLowerCase()) ||
          res.applicationNumber
            .toLowerCase()
            .match(e.target.value.toLowerCase()) ||
          res.phoneNumber.toString().match(e.target.value.toString()) ||
          res.status
            .toString()
            .toLowerCase()
            .match(e.target.value.toString().toLowerCase()) ||
          res.dsacode
            .toString()
            .toLowerCase()
            .match(e.target.value.toString().toLowerCase())
        ) {
          array.push(res);
        } 
    });
    this.setState({
      search: e.target.value,
      DSAData: e.target.value ? array : dsaContainer,
    });
  };
  render() {
    const {
      search,
      dsaData,
      DSAData,
      showModal,
      verifyObj,
      status,
      loading,
      view,
    } = this.state;
    const columns = [
      {
        Header: "Company Name",
        Cell: ({ original }) => {
          return original.companyName;
        },
      },
      {
        Header: "Company Pan",
        Cell: ({ original }) => {
          return original.companyPan;
        },
      },
      {
        Header: "DSA code",
        Cell: ({ original }) => {
          return original.dsaCode;
        },
      },
      {
        Header: "Email Id",
        Cell: ({ original }) => {
          return original.emailId;
        },
      },
      {
        Header: "Phone Number",
        Cell: ({ original }) => {
          return original.phoneNumber;
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
                  onClick={() =>
                    this.addDsa(original.applicationNumber, original.status)
                  }
                  className="fas fa-user-edit"
                />
              )}
            </div>
          );
        },
      },
    ];
    return (
      <section className="container-fluid">
        <h5 className="text-center mt-5 mx-auto user-box">DSA</h5>
        {this.state.loading ? (
          <h4 className="text-center mt-5">LOADING...</h4>
        ) : (
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
                data={DSAData}
                columns={columns}
                defaultPageSize={10}
              />
            </div>
          </React.Fragment>
        )}
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

export default Dsa;
