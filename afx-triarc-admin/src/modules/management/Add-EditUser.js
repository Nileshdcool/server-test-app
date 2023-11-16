import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import Closemodal from "./Closemodal";
import {
  MyRoleList,
  productlist,
  AddEmployee,
  AddUser,
  BranchList,
  getUserByID,
  DeleteProductByID,
  // isMobileNumberPresent
} from "../../Utils/management";
import { truncate, uniq } from "lodash";
import { isSmDsaBranchMapped } from "../../Utils/mapping";
import _ from "lodash";
// import { addUser } from "../../Utils/management";
// import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// toast.configure();

const statusOption = [
  { id: 1, value: "ACTIVE", label: "Active" },
  { id: 2, value: "INACTIVE", label: "Inactive" },
];

const dropstyle = {
  container: (base) => ({
    ...base,
    flex: 1,
  }),
};

class EditUser extends Component {
  state = {
    show: false,
    role: null,
    statu: null,
    product: null,
    branch: null,
    result: [],
    userName: "",
    filter: "",
    employeeName: "",
    employeeId: null,
    mobileNo: "",
    userStatus: "",
    otherArray: "",
    roleOption: [],
    productOption: [],
    branchOption: [],
    employeeData: [],
    userBranch: [],
    userProduct: [],
    productmap: [],
    branchmap: [],
    selectedproduct: [],
    branchmap: [],
    loading: false,
    invalidusername: false,
    invalidEmployeeId: false,
    invalidmobileNo: false,
    isloading: false,
    disble: false,
    showInner: false,
    view: false,
    mapMessage: "",
    product: "",
    branchName: "",
    btnLoading: false,
    errors: {
      userNameError: null,
      employeeNameError: null,
      employeeIdError: null,
      mobileNoError: null,
      branchError: null,
      roleError: null,
      productError: null,
      mappedDSA: false,
    },
    defaultValue: {
      id: 0,
      branchCode: "ALL",
      branchName: "ALL",
    },
  };

  componentWillMount() {
    if (this.props.location && this.props.location.pathname.includes("view")) {
      this.setState({ view: true });
    }
    window.scroll(0, 0);
  }

  componentDidMount() {
    this.handleShow();
    // this.handleStatus();
    this.onValidate();
    this.RoleList();
    this.productlistData();
    this.branchListData();
    if (this.props.verifyObj) {
      this.getUserByUniqueId();
    }
  }

  RoleList = () => {
    MyRoleList().then((response) => {
      this.setState({
        roleOption:
          response.data && response.data.data ? response.data.data : [],
      });
    });
  };

  productlistData = () => {
    let categoryid = 1;
    productlist(categoryid).then((response) => {
      this.setState({
        productOption:
          response.data && response.data.data ? response.data.data : [],
      });
    });
  };

  branchListData = () => {
    BranchList().then((response) => {
      this.setState({
        branchOption:
          response.data && response.data.data
            ? [this.state.defaultValue, ...response.data.data]
            : [],
      });
    });
  };

  getUserByUniqueId = () => {
    this.setState({ isloading: true });
    getUserByID(this.props.verifyObj && this.props.verifyObj, "Admin").then(
      (response) => {
        this.setState({ isloading: false });
        let Data = response.data.data && response.data.data.user;
        let employeeData = response.data.data && response.data.data.employee;
        this.setState(Data);

        this.setState({
          employeeData: employeeData,
          statu: response.data.data.user && response.data.data.user.status,
          userBranch: employeeData && employeeData.userBranchMapping,
          userProduct: employeeData && employeeData.userProductMapping,
          productmap: employeeData && employeeData.userProductMapping,
          branchmap: employeeData && employeeData.userBranchMapping,

          // selectedproduct: employeeData.userProductMapping
          // branchmap: employeeData.userProductMapping
        });
      }
    );
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  close = (close) => {
    this.setState({ showInner: !this.state.showInner });
  };

  handleClose = (modclose) => {
    if (!modclose) this.modclose();
    this.setState({ show: false });
    this.props.addUser();
  };

  modclose = (modclose) => {
    this.setState({ showInner: !this.state.showInner });
  };

  handleChange = (e) => {
    let name = e.target.name;
    const { errors } = this.state;
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }
    if (name === "userName") {
      let usernameRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (e.target.value && !e.target.value.match(usernameRegx)) {
        this.setState({
          invalidusername: true,
        });
      } else {
        this.setState({
          invalidusername: false,
        });
      }
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleName = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }
    this.setState({
      employeeName: e.target.value,
    });
  };

  handleEmployee = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleRole = (role) => {
    let { errors } = this.state;
    if (role === "" || role === null || role === undefined) {
      this.setState({ errors: { ...errors, roleError: true } });
    } else {
      this.setState({ errors: { ...errors, roleError: false } });
    }
    this.setState({ role });
  };

  handleStatus = (statu) => {
    this.setState({ statu: statu && statu.value });
  };

  handleMobile = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    const { errors } = this.state;
    if (
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }
    let indianMobile = /^[6789]\d{9}$/;
    if (name === "mobileNo") {
      if (value && !value.match(indianMobile)) {
        this.setState({
          invalidmobileNo: true,
        });
      } else {
        this.setState({
          invalidmobileNo: false,
        });
      }
    }
    this.setState({
      mobileNo: e.target.value,
    });
  };

  handleProduct = (product) => {
    let { errors } = this.state;
    if (
      product === "" ||
      product === null ||
      product === undefined ||
      product.length === 0
    ) {
      this.setState({ errors: { ...errors, productError: true } });
    } else {
      this.setState({ errors: { ...errors, productError: false } });
    }

    let productarray = [];
    product && productarray.push(product);
    this.setState({
      userProduct: productarray[0],
      product,
    });
  };

  handlebranch = (branch) => {
    let { errors } = this.state;
    if (
      branch === "" ||
      branch === null ||
      branch === undefined ||
      branch.length === 0
    ) {
      this.setState({ errors: { ...errors, branchError: true } });
    } else {
      this.setState({ errors: { ...errors, branchError: false } });
    }

    let brancharray = [];
    branch && brancharray.push(branch);
    this.setState({
      userBranch: brancharray[0],
      branch,
    });
  };

  restrictAlphabets = (e) => {
    const regx = "^[0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictSpecialCharacters = (e) => {
    const regx = "^[a-zA-Z0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictSpecialCharactersNumber = (e) => {
    const regx = "^[a-zA-Z ]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictBlankSpace = (e) => {
    const regx = /^\S*$/;
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  handleValidate = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    console.log("name--->", name);
    console.log("value--->", value);
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + "Error"]: true } });
    } else {
      this.setState({ errors: { ...errors, [name + "Error"]: false } });
    }
    if (name === "userName") {
      let usernameRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value && !value.match(usernameRegx)) {
        this.setState({
          invalidusername: true,
        });
      } else {
        this.setState({
          invalidusername: false,
        });
      }
    }

    let indianMobile = /^[6789]\d{9}$/;
    if (name === "mobileNo") {
      if (value && !value.match(indianMobile)) {
        this.setState({
          invalidmobileNo: true,
        });
      } else {
        this.setState({
          invalidmobileNo: false,
        });
      }
    }
  };

  onValidate = (name) => {
    const { role, branch, product, errors, userBranch, userProduct } =
      this.state;
    if (name === "role") {
      if (
        role === "" ||
        //   role === null ||
        role === undefined
      ) {
        this.setState({ errors: { ...errors, roleError: true } });
      } else {
        this.setState({ errors: { ...errors, roleError: false } });
      }
    }
    if (name === "branch") {
      if (
        branch === "" ||
        // branch === null ||
        branch === undefined ||
        (branch && branch.length === 0)
      ) {
        this.setState({ errors: { ...errors, branchError: true } });
      } else {
        this.setState({ errors: { ...errors, branchError: false } });
      }
    }
    if (name === "product") {
      if (
        product === "" ||
        // product === null ||
        product === undefined ||
        (product && product.length === 0)
      ) {
        this.setState({ errors: { ...errors, productError: true } });
      } else {
        this.setState({ errors: { ...errors, productError: false } });
      }
    }
    if (name === "productobj") {
      if (
        // product === "" ||
        // product === null ||
        // product === undefined ||
        (userProduct && userProduct.length === 0) ||
        (product && product.length === 0)
      ) {
        this.setState({ errors: { ...errors, productError: true } });
      } else {
        this.setState({ errors: { ...errors, productError: false } });
      }
    }
    if (name === "branchobj") {
      if (
        // branch === "" ||
        // branch === null ||
        // branch === undefined ||
        (userBranch && userBranch.length === 0) ||
        (branch && branch.length === 0)
      ) {
        this.setState({ errors: { ...errors, branchError: true } });
      } else {
        this.setState({ errors: { ...errors, branchError: false } });
      }
    }
  };

  handleSubmit = () => {
    const {
      errors,
      userName,
      employeeName,
      mobileNo,
      role,
      product,
      branch,
      passWord,
      branchError,
      productError,
      createdDate,
      updatedDate,
      employeeId,
      ipaddress,
      otp,
      employeeData,
      token,
      id,
      statu,
      userBranch,
      branchOption,
      userProduct,
      productOption,
      loading,
      productmap,
      branchmap,
      roleId,
    } = this.state;

    let isAdd = true;
    if (this.props.verifyObj) {
      for (var val in errors) {
        if (errors[val]) {
          errors[val] = true;
          isAdd = false;
        }
      }
    } else {
      for (var val in errors) {
        if (errors[val] === null || errors[val]) {
          errors[val] = true;
          isAdd = false;
        }
      }
    }

    let createdBy = null;
    let updatedBy = null;

    let status = statu && statu;

    let userBranchMapping = [];
    userBranch &&
      userBranch.map((val) => {
        userBranchMapping.push({
          branchCode: val.branchCode,
        });
      });

    let userProductMapping = [];
    userProduct &&
      userProduct.map((val) => {
        userProductMapping.push({
          productId: val.productId,
        });
      });

    if (role) {
      role.createdDate = +new Date(role.createdDate);
      role.updatedDate = +new Date(role.updatedDate);
    }
    let obj = {
      userName,
      createdBy,
      updatedBy,
      employeeId: employeeId && employeeId.replace(/ /g, ""),
      employeeName,
      mobileNo,
      role,
      passWord,
      status,
      createdDate: +new Date(createdDate),
      updatedDate: +new Date(updatedDate),
      ipaddress,
      otp,
      token,
      id,
      userBranchMapping,
      userProductMapping,
      product,
      roleId: role.roleId,
    };
    if (isAdd) {
      this.setState({ isloading: true });
      AddUser(obj).then((response) => {
        this.setState({ isloading: false });
        if (response.data && response.data.error === false) {
          // this.setState({ loading: false });
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            // autoClose: 2000,
          });
          this.handleClose();
        }
        if (response.data && response.data.error === true) {
          this.setState({ loading: false });
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 2000,
          });

          if (
            response.data &&
            response.data.message === "Mobile number already exists!"
          ) {
            this.setState({
              mobileNo: "",
            });
          }
          if (
            response.data &&
            response.data.message === "Email ID already exists!"
          ) {
            this.setState({
              userName: "",
            });
          }
        }
      });
    } else {
      console.log("else");
      this.setState({ isloading: true });
      AddUser(obj).then((response) => {
        this.setState({ isloading: false });
        if (response.data && response.data.error === false) {
          this.setState({ loading: false });
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 2000,
          });

          let name = employeeName;
          let employeeId = response.data.data && response.data.data.employeeId;
          let emailId = userName;
          let id = employeeData && employeeData.id;

          if (isAdd && isAdd) {
            let objs = {
              name,
              employeeId,
              emailId,
              userBranchMapping: uniq(userBranchMapping),
              userProductMapping: uniq(userProductMapping),
              id,
            };

            AddEmployee(objs).then((response) => {});
          }
          this.handleClose();
        }
        if (response.data && response.data.error === true) {
          this.setState({ loading: false });
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 2000,
          });

          if (
            response.data &&
            response.data.message === "Mobile number already exists!"
          ) {
            this.setState({
              mobileNo: "",
            });
          }
          if (
            response.data &&
            response.data.message === "Email ID already exists!"
          ) {
            this.setState({
              userName: "",
            });
          }
        }
      });
    }
    this.setState({ errors: { ...errors } });
  };

  render() {
    const {
      show,
      userName,
      employeeId,
      employeeName,
      mobileNo,
      role,
      roleOption,
      product,
      productOption,
      branch,
      branchName,
      branchOption,
      employeeData,
      invalidusername,
      invalidEmployeeId,
      invalidmobileNo,
      roleError,
      productError,
      statu,
      userStatus,
      userBranch,
      userProduct,
      errors,
      loading,
      branchError,
      productmap,
      branchmap,
      selectedproduct,
      mappedDSA,
      view,
    } = this.state;

    let statusobj = {};

    const index =
      roleOption && roleOption.map((e) => e.roleName).indexOf("DSA");
    if (index > -1) {
      roleOption && roleOption.splice(index, 1);
    }

    statusOption.map((res) => {
      if (res.value == this.state.statu) {
        statusobj = res;
      }
    });

    let branchobj = [];
    branchOption.map((res) => {
      userBranch &&
        userBranch.map((val) => {
          if (res.branchCode == val.branchCode) {
            branchobj.push(res);
          }
        });
    });

    let productobj = [];
    productOption.map((res) => {
      userProduct &&
        userProduct.map((val) => {
          if (res.productId == val.productId) {
            productobj.push(res);
          }
        });
    });
    console.log("employeeId-->", employeeId && employeeId.replace(/ /g, ""));
    return (
      <React.Fragment>
        <div className="sweet-loading">
          <Modal
            className="add-role"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={() => {
              this.close();
            }}>
            <Modal.Header closeButton>
              <Modal.Title>
                {this.props.verifyObj ? "Edit" : "Add"} User
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h5 className="text-center">LOADING...</h5>
              ) : (
                <div>
                  {this.props.verifyObj ? (
                    <div className="col-md-12">
                      <label>Employee Id</label>
                      <input
                        type="text"
                        className="form-input capLetters"
                        name="employeeId"
                        value={employeeId}
                        onChange={this.handleEmployee}
                        // onBlur={this.handleValidate}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Enter Employee Id"
                        disabled
                        onKeyPress={this.restrictSpecialCharacters}
                      />
                      {errors.employeeIdError && (
                        <span className="errorMsg">
                          Please enter Employee Id
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="col-md-12">
                      <label>Employee Id</label>
                      <input
                        type="text"
                        className="form-input capLetters"
                        name="employeeId"
                        value={employeeId}
                        onChange={this.handleEmployee}
                        // onBlur={this.handleValidate}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Enter Employee Id"
                        onKeyPress={this.restrictSpecialCharacters}
                      />
                      {errors.employeeIdError && (
                        <span className="errorMsg">
                          Please enter Employee Id
                        </span>
                      )}
                    </div>
                  )}
                  <div className="col-md-12">
                    <label>Employee Name</label>
                    <input
                      maxLength="50"
                      type="text"
                      className="form-input capLetters"
                      name="employeeName"
                      value={employeeName}
                      onChange={this.handleName}
                      style={{ textTransform: "uppercase" }}
                      // onBlur={this.handleValidate}
                      placeholder="Enter Employee name"
                      onKeyPress={this.restrictSpecialCharactersNumber}
                    />
                    {errors.employeeNameError && (
                      <span className="errorMsg">
                        Please enter Employee name
                      </span>
                    )}
                  </div>
                  {this.props.verifyObj ? (
                    <div className="col-md-12 mt-3">
                      <label>Email ID</label>
                      <input
                        type="text"
                        className="form-input"
                        name="userName"
                        value={userName}
                        onChange={this.handleChange}
                        // onBlur={this.handleValidate}
                        placeholder="Enter Email ID"
                        disabled
                        onKeyPress={this.restrictBlankSpace}
                      />
                      {errors.userNameError && (
                        <span className="errorMsg">Please enter Email ID</span>
                      )}
                      {invalidusername && (
                        <span className="errorMsg">
                          Please enter valid Email ID
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="col-md-12 mt-3">
                      <label>Email ID</label>
                      <input
                        type="text"
                        className="form-input"
                        name="userName"
                        value={userName}
                        onChange={this.handleChange}
                        // onBlur={this.handleValidate}
                        placeholder="Enter Email ID"
                        onKeyPress={this.restrictBlankSpace}
                      />
                      {errors.userNameError && (
                        <span className="errorMsg">Please enter Email ID</span>
                      )}
                      {invalidusername && (
                        <span className="errorMsg">
                          Please enter valid Email ID
                        </span>
                      )}
                    </div>
                  )}

                  <div className="col-md-12 mt-3">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      pattern="\d*"
                      maxLength="10"
                      className="form-input"
                      name="mobileNo"
                      value={mobileNo}
                      maxlength="10"
                      onChange={this.handleMobile}
                      // onBlur={this.handleValidate}
                      onKeyPress={this.restrictAlphabets}
                      placeholder="Enter Mobile Number"
                    />
                    {errors.mobileNoError && (
                      <span className="errorMsg">
                        Please enter Mobile Number
                      </span>
                    )}
                    {invalidmobileNo && (
                      <span className="errorMsg">
                        Please enter Valid Mobile Number
                      </span>
                    )}
                  </div>
                  <div className="col-md-12 mt-3">
                    <label>Role</label>
                    <Select
                      value={role}
                      onChange={this.handleRole}
                      onBlur={() => this.onValidate("role")}
                      placeholder="Role"
                      options={roleOption}
                      valueKey="roleId"
                      labelKey="roleName"
                      getOptionLabel={(option) => option["roleName"]}
                      getOptionValue={(option) => option["roleId"]}
                      styles={dropstyle}
                    />
                    {errors.roleError && (
                      <span className="errorMsg">Please select role</span>
                    )}
                  </div>
                  {this.props.verifyObj ? (
                    <div className="col-md-12 mt-3">
                      <label>Status</label>
                      <Select
                        value={statusobj}
                        name="statu"
                        onChange={this.handleStatus}
                        options={statusOption}
                        placeholder="Status"
                        styles={dropstyle}
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {/* {this.props.verifyObj ? (
                    <div className="col-md-12 mt-3">
                      <label>Product</label>
                      <Select
                        id="productobj"
                        value={productobj}
                        isMulti
                        onChange={this.handleProduct}
                        name="product"
                        options={productOption}
                        onBlur={() => this.onValidate("productobj")}
                        placeholder="Product"
                        valueKey="productId"
                        labelKey="subcatType"
                        getOptionLabel={(option) => option["subcatType"]}
                        getOptionValue={(option) => option["productId"]}
                        styles={dropstyle}
                      />
                      {errors.productError && (
                        <span className="errorMsg">Please select Product</span>
                      )}
                    </div>
                  ) : (
                    <div className="col-md-12 mt-3">
                      <label>Product</label>
                      <Select
                        id="product"
                        name="product"
                        value={product}
                        isMulti
                        onChange={this.handleProduct}
                        options={productOption}
                        onBlur={() => this.onValidate("product")}
                        placeholder="Product"
                        valueKey="productId"
                        labelKey="subcatType"
                        getOptionLabel={(option) => option["subcatType"]}
                        getOptionValue={(option) => option["productId"]}
                        styles={dropstyle}
                      />
                      {errors.productError && (
                        <span className="errorMsg">Please select Product</span>
                      )}
                    </div>
                  )} */}

                  {this.props.verifyObj ? (
                    <div className="col-md-12 mt-3">
                      <label>Branch</label>
                      <Select
                        id="branchobj"
                        name="branchobj"
                        value={branchobj}
                        isMulti
                        onChange={this.handlebranch}
                        options={branchOption}
                        onBlur={() => this.onValidate("branchobj")}
                        placeholder="Branch"
                        valueKey="branchCode"
                        labelKey="branchName"
                        getOptionLabel={(option) => option["branchName"]}
                        getOptionValue={(option) => option["branchCode"]}
                        styles={dropstyle}
                      />
                      {errors.branchError && (
                        <span className="errorMsg">Please select Branch</span>
                      )}
                    </div>
                  ) : (
                    <div className="col-md-12 mt-3">
                      <label>Branch</label>
                      <Select
                        id="branch"
                        name="branch"
                        value={branch}
                        isMulti
                        onChange={this.handlebranch}
                        options={branchOption}
                        onBlur={() => this.onValidate("branch")}
                        placeholder="Branch"
                        valueKey="branchCode"
                        labelKey="branchName"
                        getOptionLabel={(option) => option["branchName"]}
                        getOptionValue={(option) => option["branchCode"]}
                        styles={dropstyle}
                      />
                      {errors.branchError && (
                        <span className="errorMsg">Please select Branch</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-danger" onClick={this.modclose}>
                Cancel
              </Button>
              <Button
                className="btn-success"
                onClick={this.handleSubmit}
                disabled={
                  !employeeName ||
                  !userName ||
                  invalidusername ||
                  invalidmobileNo ||
                  invalidEmployeeId ||
                  (errors && errors.branchError) ||
                  // (errors && errors.productError) ||
                  (errors && errors.roleError) ||
                  !mobileNo ||
                  this.state.loading ||
                  !role ||
                  role == null ||
                  (role && Object.keys(role).length == 0) ||
                  !userBranch ||
                  // !userProduct ||
                  (userBranch && userBranch.length == 0) ||
                  // (userProduct && userProduct.length == 0) ||
                  errors.mappedDSA ||
                  view
                }>
                {this.state.isloading ? (
                  <i
                    class="fa fa-spinner fa-spin"
                    style={{ fontSize: "24px" }}></i>
                ) : this.props.verifyObj ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
          <Closemodal
            show={this.state.showInner}
            button2={this.modclose}
            button1={this.handleClose}
            title="Do you want to close ?"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default EditUser;
