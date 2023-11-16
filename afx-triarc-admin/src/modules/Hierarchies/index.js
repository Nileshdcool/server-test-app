import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState, useRef } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "react-toastify/dist/ReactToastify.css";
import {
  getSalesHigherHierarchyData,
  getSalesMappedData,
  getSalesUnmappedData,
  SaveSalesHierarchyMapping,

  getCreditHigherHierarchyData,
  getCreditMappedData,
  getCreditUnMappedData,
  SaveCreditHierarchyMapping,

  getDisbursementHigherHierarchyData,
  getDisbursementMappedData,
  getDisbursementUnMappedData,
  SaveDisbursementHierarchyMapping,
} from "../../Utils/mapping";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Hierarchies(props) {
  const [senior, setSenior] = useState([]);
  const [junior, setjunior] = useState([]);
  const [mapped, setMapped] = useState(false);
  const [seniorData, setSeniorData] = useState([]);
  const [juniorData, setJuniorData] = useState([]);
  const [seniorSearched, setSeniorSearched] = useState({
    search: null,
    selected: {},
  });
  const [loadings, setLoadings] = useState(false);
  const [mappingList, setMappingList] = useState([]);
  const [loading, setLoading] =useState(true)
  const [actions, setActions] = useState(false);
  const searchRef = useRef()
  const textRef = useRef()

  const mapping1 = props.location.pathname.split("/")[3];
  const mapping2 = props.location.pathname.split("/")[4];
  const hierarchy = props.location.pathname.split("/")[2];
  const action = props.location.pathname.split("/")[5];

  useEffect(() => {
    const getData = async () => {
      setSenior(mapping1.split(","));
      setjunior(mapping2.split(","));
      const seniorData = await getSalesHigherHierarchyData(mapping1);
      if (seniorData.data && !seniorData.data.error) {
        setSeniorData(seniorData.data.data);
        setLoading(false);
      } else if (seniorData.data.error) {
        setSeniorData(null);
        setLoading(false);
      }
    };
    getData();
    window.scroll(0, 0);
  }, [mapping1, mapping2]);

  useEffect(() => {
    if (!isEmpty(seniorSearched.selected)) {
      getJuniorData(seniorSearched.selected);
    }
    setMappingList([]);
  }, [mapped]);

  // useEffect(() =>{
  //   window.scroll(0, 0);
  // })

    useEffect(() => {
      setSeniorSearched({
        selected: {},
        search: null,
      });

      if (searchRef.current){
        setSeniorSearched({ selected: null, search: null });
        searchRef.current.reset();
        if(textRef.current){
          textRef.current.value = ""
          setSeniorSearched({ selected: "hell", search: "" });
        }
      } 
    }, [junior, senior]);

  const getJuniorData = (async (seniorSelected) => {
    try {
      let juniorData;
      const payload = {
        roleNames: junior.join(","),
        reporterEmployeeId: seniorSelected.employeeId,
      };
      if (!mapped) 
      {
        if (hierarchy === "sales") {
          juniorData = await getSalesUnmappedData(payload);
        } else if (hierarchy === "credit") {
          juniorData = await getCreditUnMappedData(payload);
        } else if (hierarchy === "disbursement") {
          juniorData = await getDisbursementUnMappedData(payload);
        }
      } 
      else {
        if (hierarchy === "sales") {
          juniorData = await getSalesMappedData(payload);
        } else if (hierarchy === "credit") {
          juniorData = await getCreditMappedData(payload);
        }else if (hierarchy === "disbursement") {
          juniorData = await getDisbursementMappedData(payload);
        }
      }
      if (juniorData.data && !juniorData.data.error) {
        setSeniorSearched({ ...seniorSearched, selected: seniorSelected });
        setJuniorData(juniorData.data.data);
      }
    } catch (err) {
    }
    return;
  });

  const addToMappingList = (checked, data) => {
    if ((!mapped && checked) || (mapped && !checked)) {
      setMappingList([...mappingList, data]);
      return;
    } else if (mappingList.includes(data)) {
      const newList = filter(
        mappingList,
        (item) => item.employeeName !== data.employeeName
      );
      setMappingList(newList);
    }
  };
   
  const onSeniorSearched = (e) => {
      setSeniorSearched({
        selected: {},
        search: e.target.value,
      });
    setJuniorData([]);
  };

  const saveSalesHierarchy = async (e) => {
    if (!loadings) {
      setLoadings(true)
      const list = cloneDeep(mappingList).map((item) => {
        item.mappingFlag = !mapped;
        return item;
      });
      const mappedType = mapped ? "M" : "U";
      if (hierarchy === "sales") {
        const response = await SaveSalesHierarchyMapping(list, mappedType);
        if (response.data && !response.data.error) {
          setLoadings(false);
          getJuniorData(seniorSearched.selected);
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 4000,
          });
        }
      } else if (hierarchy === "credit") {
        const response = await SaveCreditHierarchyMapping(list, mappedType);
        setLoadings(false);
        if (response.data && !response.data.error) {
          getJuniorData(seniorSearched.selected);
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 4000,
          });
        }
      } else if (hierarchy === "disbursement") {
        const response = await SaveDisbursementHierarchyMapping(
          list,
          mappedType
        );
        setLoadings(false);
        if (response.data && !response.data.error) {
          getJuniorData(seniorSearched.selected);
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 4000,
          });
        }
      }
    }
  };

  let seniorDropdown = [];
  if (seniorSearched.search) {
    try {
      seniorData.filter((item) => {
        Object.keys(item).filter((keyItem) => {
          if (
            item[keyItem]
              .toString()
              .toLowerCase()
              .includes(seniorSearched.search.toLowerCase())
          ) {
            if (!seniorDropdown.includes(item)) {
              seniorDropdown.push(item);
            }
          }
        });
      });
    } catch (err) {
    }
  }

  const columns = [
    {
      Header: "Employee ID",
      Cell: ({ original }) => {
        if (textRef.current.value === ""){
          return original.reporteeEmployeeId = ""
        } 
        else{
          return original.reporteeEmployeeId;
        }
      },
    },
    {
      Header: "Email Id",
      Cell: ({ original }) => {
        if (textRef.current.value === "") {
          return (original.emailId = "");
        } else {
          return original.emailId;
        }
      },
    },
    {
      Header: "Employee Name",
      Cell: ({ original }) => {
        if (textRef.current.value === "") {
          return (original.employeeName = "");
        } else {
          return original.employeeName;
        }
      },
    },
    {
      Header: "Contact Number",
      Cell: ({ original }) => {
        if (textRef.current.value === "") {
          return (original.mobileNumber = "");
        } else {
          return original.mobileNumber;
              }
    }
  },
    {
      Header: "Action",
      accessor: "edit",
      width: 140,
      Cell: ({ original, index }) => {
        if (textRef.current.value === "") {
          return null
        } else {;
        return (
          <div className="custom-control custom-checkbox text-center ml-5">
            <input
              type="checkbox"
              className="custom-control-input"
              id={original.reporteeEmployeeId}
              onClick={(e) => addToMappingList(e.target.checked, original)}
              checked={
                (!mapped && mappingList.includes(original)) ||
                (mapped && !mappingList.includes(original))
              }
              disabled={action === "view"}
            />
            <label
              className="custom-control-label"
              htmlFor={original.reporteeEmployeeId}
            />
          </div>
        );
            }
      },
    },
  ];

  const selectedSenior = {};
  if (!isEmpty(seniorSearched.selected)) {
    selectedSenior.value = seniorSearched.selected.employeeName;
  }

  return (
    <section className="container-fluid mb-5">
      {loading ? (
        <h4 className="text-center mt-5">LOADING...</h4>
      ) : (
        <>
          <h5 className="text-center mt-5 mx-auto user-box">
            {senior.join("/").toUpperCase()}&nbsp;-&nbsp;
            {junior.join("/").toUpperCase()}
          </h5>
          <div className="text-center">
            <div className="d-flex align-items-center mt-5">
              <div className="col-md-3">
                {" "}
                <h5 className="mr-3">Select {senior.join("/")}</h5>
              </div>

              <div className="form-group m-0 search-input">
                <div className="inner-addon right-addon">
                  <i className="glyphicon glyphicon-search mt-1 font-size-20"></i>
                  <form ref={searchRef}>
                    <input
                      autoComplete={false}
                      {...selectedSenior}
                      type="text"
                      className="form-input active-cyan-4"
                      name="search"
                      placeholder="Search By  Employee Id,  Name,  Email Id,  Contact Number"
                      onChange={onSeniorSearched}
                      ref={textRef}
                    />
                  </form>
                </div>
                <div>
                  <div className="contain">
                    {seniorDropdown.length &&
                    isEmpty(seniorSearched.selected) ? (
                      <div
                        className="dropdown"
                        style={{
                          overflowY: "scroll",
                          width: "100%",
                          zindex: "-1",
                          margin: "0 auto",
                        }}>
                        {seniorDropdown.map((item) => (
                          <li
                            className="list-group-item d-flex justify-content-start"
                            onClick={(e) => {
                              getJuniorData(item);
                            }}
                            key={item.employeeId}
                            style={{
                              cursor: "pointer",
                            }}>
                            {item.employeeId.toUpperCase()} -{" "}
                            {item.employeeName.toUpperCase()} - {item.emailId} -{" "}
                            {item.mobileNumber}
                          </li>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5" style={{ display: "flex" }}>
            <div>
              <button
                onClick={(e) => setMapped(true)}
                type="button"
                className={`btn btn-info btn-lg mr-3 ${
                  mapped && "title-orange"
                }`}>
                {`Mapped ${junior.join("/")}`}
              </button>
              <button
                onClick={(e) => setMapped(false)}
                type="button"
                className={`btn btn-info btn-lg mr-3 ${
                  !mapped && "title-orange"
                }`}>
                {`UnMapped ${junior.join("/")}`}
              </button>
            </div>
            <div
              className="form-group m-0 search-input"
              style={{
                width: 250,
                position: "absolute",
                right: 20,
              }}>
              <div className="inner-addon right-addon">
                <i className="glyphicon glyphicon-search mt-1 font-size-20"></i>
                <input
                  type="text"
                  className="form-input"
                  name="search"
                  placeholder="Search.."
                  //   onChange={this.ASMSMsearch}
                />
              </div>
            </div>
          </div>
          <React.Fragment>
            <div className={`mt-4 react-table ${juniorData.length > 1}`}>
              <ReactTable
                scroll={{ x: "max-content", y: 350 }}
                data={juniorData}
                columns={columns}
                defaultPageSize={5}
                className="-striped -highlight"
              />
            </div>
            <div style={{ position: "absolute", right: 10 }} className="mt-2">
              <button
                onClick={saveSalesHierarchy}
                type="button"
                className="btn btn-info btn-lg mr-1"
                style={{ width: 200 }}
                // disabled={mappingList.length <= 0}
                disabled={(action === "view") || (mappingList.length <= 0)}>
                {loadings ? (
                  <i
                    class="fa fa-spinner fa-spin"
                    style={{ fontSize: "24px" }}></i>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </React.Fragment>
        </>
      )}
    </section>
  );
}

export default Hierarchies;
