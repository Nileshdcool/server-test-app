import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getAllPages, getAccessByRoleId } from "../Utils/management";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";

export class LeftMenu extends Component {
  state = {
    leftMenu: [],
    admin: {},
  };

  salesHierarchy = [
    {
      label: "CEO - Business Head",
      pathName: "/hierarchy/sales/CEO/Business Head/edit",
      pathNames: "/hierarchy/sales/CEO/Business Head/view",
    },
    {
      label: "Business Head - Regional Head",
      pathName: "/hierarchy/sales/Business Head/Regional Head/edit",
      pathNames: "/hierarchy/sales/Business Head/Regional Head/view",
    },
    {
      label: "Regional Head - State Head",
      pathName: "/hierarchy/sales/Regional Head/State Head/edit",
      pathNames: "/hierarchy/sales/Regional Head/State Head/view",
    },
    {
      label: "State Head - Sales Manager",
      pathName: "/hierarchy/sales/State Head/Sales Manager/edit",
      pathNames: "/hierarchy/sales/State Head/Sales Manager/view",
    },
    {
      label: "Sales Manager - Team Leader",
      pathName: "/hierarchy/sales/Sales Manager/Team Leader/edit",
      pathNames: "/hierarchy/sales/Sales Manager/Team Leader/view",
    },
    {
      label: "Team Leader - Sales Executive",
      pathName: "/hierarchy/sales/Team Leader/Sales Executive/edit",
      pathNames: "/hierarchy/sales/Team Leader/Sales Executive/view",
    },
  ];

  creditHierarchy1 = [
    {
      label: "CEO - Head Credit(UW & RCU)",
      pathName: "/hierarchy/credit/CEO/Head Credit(UW & RCU)/edit",
      pathNames: "/hierarchy/credit/CEO/Head Credit(UW & RCU)/view",
    },
    {
      label: "Head Credit(UW&RCU) - Regional/Zonal Credit Manager",
      pathName:
        "/hierarchy/credit/Head Credit(UW&RCU)/Regional,Zonal Credit Manager/edit",
      pathNames:
        "/hierarchy/credit/Head Credit(UW&RCU)/Regional,Zonal Credit Manager/view",
    },
    {
      label: "Regional/Zonal Credit Manager - Credit Manager",
      pathName:
        "/hierarchy/credit/Regional,Zonal Credit Manager/Credit Manager/edit",
      pathNames:
        "/hierarchy/credit/Regional,Zonal Credit Manager/Credit Manager/view",
    },
    {
      label: "Credit Manager - Credit Executive",
      pathName: "/hierarchy/credit/Credit Manager/Credit Executive/edit",
      pathNames: "/hierarchy/credit/Credit Manager/Credit Executive/view",
    },
  ];

  creditHierarchy2 = [
    {
      label: "CEO - Head Credit(UW & RCU)",
      pathName: "/hierarchy/credit/CEO/Head Credit(UW & RCU)/edit",
      pathNames: "/hierarchy/credit/CEO/Head Credit(UW & RCU)/view",
    },
    {
      label: "Head Credit(UW & RCU) - Regional/Zonal RCU Manager",
      pathName:
        "/hierarchy/credit/Head Credit(UW & RCU)/Regional,Zonal RCU Manager/edit",
      pathNames:
        "/hierarchy/credit/Head Credit(UW & RCU)/Regional,Zonal RCU Manager/view",
    },
    {
      label: "Regional/Zonal RCU Manager - RCU Manager",
      pathName: "/hierarchy/credit/Regional,Zonal RCU Manager/RCU Manager/edit",
      pathNames:
        "/hierarchy/credit/Regional,Zonal RCU Manager/RCU Manager/view",
    },
    {
      label: "RCU Manager - RCU Executive",
      pathName: "/hierarchy/credit/RCU Manager/RCU Executive/edit",
      pathNames: "/hierarchy/credit/RCU Manager/RCU Executive/view",
    },
  ];

  disbursementHierarchy1 = [
    {
      label: "CEO / ED - Head Operations",
      pathName: "/hierarchy/disbursement/CEO,ED/Head Operations/edit",
      pathNames: "/hierarchy/disbursement/CEO,ED/Head Operations/view",
    },
    {
      label: "Head Operations - Banking and Repayment Manager",
      pathName:
        "/hierarchy/disbursement/Head Operations/Banking and Repayment Manager/edit",
      pathNames:
        "/hierarchy/disbursement/Head Operations/Banking and Repayment Manager/view",
    },
    {
      label: "Banking and Repayment Manager - Operations Executives",
      pathName:
        "/hierarchy/disbursement/Banking and Repayment Manager/Operations Executives/edit",
      pathNames:
        "/hierarchy/disbursement/Banking and Repayment Manager/Operations Executives/view",
    },
  ];

  disbursementHierarchy2 = [
    {
      label: "CEO / ED - Head Operations",
      pathName: "/hierarchy/disbursement/CEO,ED/Head Operations/edit",
      pathNames: "/hierarchy/disbursement/CEO,ED/Head Operations/view",
    },
    {
      label: "Head Operations - Disbursement Manager",
      pathName:
        "/hierarchy/disbursement/Head Operations/Disbursement Manager/edit",
      pathNames:
        "/hierarchy/disbursement/Head Operations/Disbursement Manager/view",
    },
    {
      label: "Disbursement Manager - Disbursement Executives",
      pathName:
        "/hierarchy/disbursement/Disbursement Manager/Disbursement Executives/edit",
      pathNames:
        "/hierarchy/disbursement/Disbursement Manager/Disbursement Executives/view",
    },
  ];

  creditHierarchy2 = [
    {
      label: "CEO / ED - Head Underwriter",
      pathName: "/hierarchy/credit/CEO,ED/Head Underwriter/edit",
      pathNames: "/hierarchy/credit/CEO,ED/Head Underwriter/view",
    },
    {
      label: "Head Underwriter - RCU Manager",
      pathName: "/hierarchy/credit/Head Underwriter/RCU Manager/edit",
      pathNames: "/hierarchy/credit/Head Underwriter/RCU Manager/view",
    },
    {
      label: "RCU Manager - RCU Executives",
      pathName: "/hierarchy/credit/RCU Manager/RCU Executives/edit",
      pathNames: "/hierarchy/credit/RCU Manager/RCU Executives/view",
    },
  ];

  master = [
    {
      label: "User to Pin code mapping Master",
      pathName: "/edit/master",
      pathNames: "/view/master",
    },
    {
      label: "Dealer Master",
      pathName: "/edit/dealerMaster",
      pathNames: "/view/dealerMaster",
    },
    {
      label: "Vehicle Master",
      pathName: "/edit/vehicleMaster",
      pathNames: "/view/vehicleMaster",
    },
    {
      label: "Scheme Master",
      pathName: "/edit/schemeMaster",
      pathNames: "/view/schemeMaster",
    },
    {
      label: "FAQ Master",
      pathName: "/edit/faqMaster",
      pathNames: "/view/faqMaster",
    },
    {
      label: "Caraousel Master",
      pathName: "/edit/caraouselMaster",
      pathNames: "/view/caraouselMaster",
    },
  ];

  async componentDidMount() {
    const pageResponse = await getAllPages();
    const listResponse = await getAccessByRoleId(
      localStorage.getItem("roleId")
    );
    let name = JSON.parse(sessionStorage.getItem("userName"));
    this.setState({
      admin: name,
    });

    const accessData = listResponse.data.data;
    const action = [];
    pageResponse.data.data.filter((item) => {
      const data = find(accessData, { pageId: `${item.pageId}` });
      if (data && !isEmpty(data)) {
        action.push({ ...data, ...item });
      }
    });
    this.setState({ leftMenu: action });
  }

  editFunction = (item) => {
    return (
      <li>
        <NavLink to={item.pathName} activeClassName="active">
          <i class="fa fa-arrows-h"></i>
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  };

  viewFunction = (item) => {
    return (
      <li>
        <NavLink to={item.pathNames} activeClassName="active">
          <i class="fa fa-arrows-h"></i>
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  };

  render() {
    return (
      <aside
        className="LeftMenu"
        style={{ height: "859px", overflowY: "auto" }}>
        <div className="logo-image"></div>
        <ul className="dash_ul">
          <div
            style={{ background: "#fff" }}
            className="row px-3 d-flex justify-content-center">
            <div>
              <img
                alt="logo"
                src="./assets/images/triarc-logo.png"
                style={{
                  height: "3rem",
                  width: "auto",
                  margin: "10px 0 10px 0",
                }}
              />
            </div>
          </div>
          <div className="text-center p-2 mt-4">
            <h6 style={{ color: "#129ce0" }}>
              Welcome{" "}
              <span
                style={{ overflowWrap: "break-word" }}
                className="text-white">
                {this.state.admin
                  ? this.state.admin &&
                    this.state.admin.data &&
                    this.state.admin.data.userName.toUpperCase()
                  : "User"}
              </span>
            </h6>
          </div>
          <div className="custom-hr">
            <hr />
          </div>

          {this.state.leftMenu.map((item) => {
            if (item.pageName.toLowerCase() == "sales hierarchy") {
              if (item.read === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseOne"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.salesHierarchy.map((item) => {
                          return this.viewFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              } else if (item.hide === false || item.write === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseOne"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.salesHierarchy.map((item) => {
                          return this.editFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              }
            } else if (item.pageName.toLowerCase() == "credit hierarchy (1)") {
              if (item.read === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="true"
                      aria-controls="collapseTwo"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseTwo"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.creditHierarchy1.map((item) => {
                          return this.viewFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              } else if (item.hide === false || item.write === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="true"
                      aria-controls="collapseTwo"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseTwo"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.creditHierarchy1.map((item) => {
                          return this.editFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              }
            } else if (item.pageName.toLowerCase() == "credit hierarchy (2)") {
              if (item.read === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseThree"
                      aria-expanded="true"
                      aria-controls="collapseThree"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseThree"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.creditHierarchy2.map((item) => {
                          return this.viewFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              } else if (item.hide === false || item.write === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseThree"
                      aria-expanded="true"
                      aria-controls="collapseThree"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseThree"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.creditHierarchy2.map((item) => {
                          return this.editFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              }
            } else if (
              item.pageName.toLowerCase() == "disbursement hierarchy (2)"
            ) {
              if (item.read === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseFour"
                      aria-expanded="true"
                      aria-controls="collapseFour"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseFour"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.disbursementHierarchy2.map((item) => {
                          return this.viewFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              } else if (item.hide === false || item.write === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseFour"
                      aria-expanded="true"
                      aria-controls="collapseFour"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseFour"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.disbursementHierarchy2.map((item) => {
                          return this.editFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              }
            } else if (
              item.pageName.toLowerCase() == "disbursement hierarchy (1)"
            ) {
              if (item.read === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseFive"
                      aria-expanded="true"
                      aria-controls="collapseFive"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseFive"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.disbursementHierarchy1.map((item) => {
                          return this.viewFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              } else if (item.hide === false || item.write === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseFive"
                      aria-expanded="true"
                      aria-controls="collapseFive"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseFive"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.disbursementHierarchy1.map((item) => {
                          return this.editFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              }
            } else if (item.pageName === "Master") {
              // console.
              if (item.read === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseSix"
                      aria-expanded="true"
                      aria-controls="collapseSix"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseSix"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.master.map((item) => {
                          return this.viewFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              } else if (item.hide === false || item.write === true) {
                return (
                  <li>
                    <NavLink
                      to=""
                      activeClassName="active"
                      data-toggle="collapse"
                      data-target="#collapseSix"
                      aria-expanded="true"
                      aria-controls="collapseSix"
                      id="menu-toggle">
                      <i className="fas fa-sitemap"></i>
                      <span>{item.pageName}</span> &nbsp; &nbsp;
                      <i className="fa fa-chevron-down"></i>
                    </NavLink>
                    <div
                      id="collapseSix"
                      class="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion">
                      <div class="card-body">
                        {this.master.map((item) => {
                          return this.editFunction(item);
                        })}
                      </div>
                    </div>
                  </li>
                );
              }
            } else {
              if (!item.hide) {
                return (
                  <li>
                    <NavLink
                      to={`/${item.read ? "view" : "edit"}/${item.pageUrl}`}
                      activeClassName="active">
                      <i className="fa fa-tachometer fa-lg"></i>
                      <span>{item.pageName}</span>
                    </NavLink>
                  </li>
                );
              }
            }
          })}
        </ul>
      </aside>
    );
  }
}

export default LeftMenu;