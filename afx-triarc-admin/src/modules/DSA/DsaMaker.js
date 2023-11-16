import React, { Component } from "react";
import Header from "../../Components/Header";
import DsaMakerForm from "../DSA/DsaMakerForm";

export class DsaMaker extends Component {
  state = {
    search: "",
    dsaData: "",
    showModal: false
  };

  addDsa = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  render() {
    const { search, dsaData } = this.state;
    const columns = [
      {
        Header: "Company Name",
        Cell: ({ original }) => {
          return original.companyName;
        }
      },
      {
        Header: "Type Of Company",
        Cell: ({ original }) => {
          return original.TypeOfCompany;
        }
      },
      {
        Header: "Branch",
        Cell: ({ original }) => {
          return original.branch;
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
          return original.mobileNo;
        }
      },
      {
        Header: "Status",
        Cell: ({ original }) => {
          return original.Status;
        }
      }
    ];
    return (
      <div className="dash_grid">
        <main className="bg-white">
          <Header {...this.props} />
          <section className="container-fluid">
            <div className="d-flex align-items-center mt-5">
              <DsaMakerForm addDsa={this.addDsa} />
              {this.state.showModal && <DsaMakerForm addDsa={this.addDsa} />}
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default DsaMaker;
