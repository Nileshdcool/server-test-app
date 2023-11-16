import React from "react";
import logo from "../../assets/Images/logo.png";
import { Col,Button, Row, Table } from "antd";
import { connect } from "react-redux";
import { getGupShupData } from "../../Redux/Services/leads";

const GupShup = (props) => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [gupShupList, setGupShupList] = React.useState({});
   const [spinning, setSpinning] = React.useState(false);
  const [count, setCount] = React.useState(10);

    
  //  component did mount
  React.useEffect(() => {
    getAllLeadsAPI();
  }, []);

  const getAllLeadsAPI = async () => {
    setSpinning(true);
    const response = await props.getGupShupData({
      // searchString: searchLead,
      // employeeId: JSON.parse(localStorage.getItem("UserData"))
      //   ? JSON.parse(localStorage.getItem("UserData")).employeeId
      //   : "",
      // branchName: JSON.parse(localStorage.getItem("UserData"))
      //   ? JSON.parse(localStorage.getItem("UserData")).branchName
      //   : "",
      pageNumber: pageNumber,
      // leadType: leadType,
      pageSize: 10,
      // productId: props.match.params.type,
    });
    //  setGupShupList(response && response.data && response.data.leadlist);
    //  setTotalCount(response && response.data && response.data.totalCount);
    setSpinning(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      align: "center",
    },
    {
      title: "Mobile No.",
      dataIndex: "mobile",
      key: "mobile",
      width: 180,
      align: "center",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      align: "center",
    },

    {
      title: "Date Of Birth",
      dataIndex: "dob",
      key: "dob",
      width: 150,
      align: "center",
    },
    {
      title: "PinCode",
      dataIndex: "pincode",
      key: "pincode",
      width: 150,
      align: "center",
    },
    {
      title: "Pan",
      dataIndex: "pan",
      key: "pan",
      width: 150,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 150,
      align: "center",
    },
    {
      title: "Criff Score",
      dataIndex: "criffScore",
      key: "criffScore",
      width: 150,
      align: "center",
    },
    {
      title: "Criff Response",
      dataIndex: "criffResponse",
      key: "criffResponse",
      width: 150,
      align: "center",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 150,
      align: "center",
    },
    {
      title: "Is Mail Triggered",
      dataIndex: "isMailTrigger",
      key: "isMailTrigger",
      width: 150,
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 150,
      align: "center",
    },
    {
      title: "Down Payment Rate",
      dataIndex: "downPaymentRate",
      key: "downPaymentRate",
      width: 150,
      align: "center",
    },
    {
      title: "Residence Type",
      dataIndex: "residentType",
      key: "residentType",
      width: 150,
      align: "center",
    },
    {
      title: "No. of Years At Residence",
      dataIndex: "noOfYearsAtRes",
      key: "noOfYearsAtRes",
      width: 150,
      align: "center",
    },
    {
      title: "Asset Category",
      dataIndex: "assetCatagory",
      key: "assetCatagory",
      width: 150,
      align: "center",
    },
    {
      title: "Monthly Income",
      dataIndex: "monthlyIncome",
      key: "monthlyIncome",
      width: 150,
      align: "center",
    },
    {
      title: "Asset Cost",
      dataIndex: "assetCost",
      key: "assetCost",
      width: 150,
      align: "center",
    },
    {
      title: "Qualification",
      dataIndex: "qualification",
      key: "qualification",
      width: 150,
      align: "center",
    },
    {
      title: "Occupation Type",
      dataIndex: "occupationType",
      key: "occupationType",
      width: 150,
      align: "center",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: 150,
      align: "center",
    },
    {
      title: "Vehicle Brand",
      dataIndex: "vehicleBrand",
      key: "vehicleBrand",
      width: 150,
      align: "center",
    },
    {
      title: "CC",
      dataIndex: "cc",
      key: "cc",
      width: 150,
      align: "center",
    },
    {
      title: "Total Loan Score",
      dataIndex: "totalLoanScore",
      key: "totalLoanScore",
      width: 150,
      align: "center",
    },
    {
      title: "Risk Category",
      dataIndex: "riskCategory",
      key: "riskCategory",
      width: 150,
      align: "center",
    },
  ];
  return (
    <div>
      <Row>
        <Col span={24}>
          <Table
            loading={{
              spinning: spinning,
              indicator: (
                <img alt="logo" src={logo} className="loader_leadList" />
              ),
              size: "large",
            }}
            scroll={{ y: 300 }}
            size="small"
            className="table-striped-rows"
            bordered
            tableLayout
            pagination={{
              onChange: (page) => {
                setPageNumber(page);
              },
              current: pageNumber,
              // defaultCurrent: 1,
              total: totalCount,
              pageSize: count,
              showSizeChanger: false,
              position: ["bottomLeft"],
            }}
            //  dataSource={leadList}
            columns={columns}
          />
        </Col>
      </Row>
    </div>
  );
};

// export default GupShup;
const mapDispatchToProps = {
  getGupShupData
};

const mapStateToProps = (state) => {
  return {
    userList: state.userList,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GupShup);