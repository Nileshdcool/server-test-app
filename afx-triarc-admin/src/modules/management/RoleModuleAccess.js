import React, { useEffect, useState } from "react";
import Select from "react-select";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  MyRoleList,
  getAllModule,
  AddModuleAccess,
  getModuleAccessByRoleId,
} from "../../Utils/management";
import find from "lodash/find";
import filter from "lodash/filter";
import { toast } from "react-toastify";
toast.configure();

function RoleModuleAccessNew(props) {
  const [roleList, setRoleList] = useState([]);
  const [moduleList, setModuleList] = useState({list:[], initial:[]});
  const [hell, setHell] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const role = await MyRoleList();
      const modules = await getAllModule();
      if (!role.data.error) {
        setRoleList(role.data.data);
      }
      if (!modules.data.error) {
        const payload = modules.data.data.map((item) => {
          return { ...item, read: false, write: false, hide: false, id: null };
        });
        setModuleList({list:payload, initial:payload});
        toast.error(modules.data.message, {
          type: toast.TYPE.SUCCESS,
          autoClose: 4000,
        });
      }
    };
    getData();
    window.scroll(0, 0);
  }, []);

  const onChanged = (original, action) => {
    const newList = moduleList.list.map((item) => {
      if (item.moduleId === original.moduleId) {
        return { ...original, ...action };
      } else {
        return item;
      }
    });
    setModuleList({...moduleList, list: newList});
  };

  const columns = [
    {
      Header: "Module Name",
      Cell: ({ original }) => {
        return original.moduleName ? original.moduleName : null;
      },
    },
    {
      Header: "Read",
      Cell: ({ original }) =>
        hell ? (
          <input
            disabled={
              original.moduleName === "Admin" ||
              original.moduleName === "Sales" ||
              original.moduleName === "Credit" ||
              original.moduleName === "Disbursement"
            }
            type="radio"
            name={original.moduleId}
            value="1"
            checked={original.read}
            onChange={(e) =>
              onChanged(original, { read: true, write: false, hide: false })
            }
          />
        ) : (
          <input
            disabled={false}
            type="radio"
            name={original.moduleId}
            value="1"
            checked={original.read}
            onChange={(e) =>
              onChanged(original, { read: true, write: false, hide: false })
            }
          />
        ),
    },
    {
      Header: "Write",
      Cell: ({ original }) =>
        hell ? (
          <input
            disabled={
              original.moduleName === "Admin" ||
              original.moduleName === "Sales" ||
              original.moduleName === "Credit" ||
              original.moduleName === "Disbursement"
            }
            type="radio"
            name={original.moduleId}
            value="2"
            checked={original.write}
            onChange={(e) =>
              onChanged(original, { read: false, write: true, hide: false })
            }
          />
        ) : (
          <input
            disabled={false}
            type="radio"
            name={original.moduleId}
            value="2"
            checked={original.write}
            onChange={(e) =>
              onChanged(original, { read: false, write: true, hide: false })
            }
          />
        ),
    },
    {
      Header: "Hide",
      Cell: ({ original }) =>
        hell ? (
          <input
            disabled={
              original.moduleName === "Admin" ||
              original.moduleName === "Sales" ||
              original.moduleName === "Credit" ||
              original.moduleName === "Disbursement"
            }
            type="radio"
            name={original.moduleId}
            value="3"
            checked={original.hide}
            onChange={(e) =>
              onChanged(original, { read: false, write: false, hide: true })
            }
          />
        ) : (
          <input
            disabled={false}
            type="radio"
            name={original.moduleId}
            value="3"
            checked={original.hide}
            onChange={(e) =>
              onChanged(original, { read: false, write: false, hide: true })
            }
          />
        ),
    },
  ];

  const handleRole = async (e) => {
    // console.log("e", e)
    if(e.roleName === "FI")
    {
      setHell(true)
    }
    else{
      setHell(false)
    }
    const getRoleId = await getModuleAccessByRoleId(e.roleId);
    if (!getRoleId.data.error) {
      const newModuleList = moduleList.initial.map((item) => {
        const getRole = find(getRoleId.data.data, {
          moduleId: item.moduleId,
        });
        let newData = { ...item, roleId: e.roleId };
        if (getRole) {
          newData = { ...item, ...getRole };
        }
        return newData;
      });
      setModuleList({...moduleList, list:newModuleList});
      toast.error(getRoleId.data.message, {
        type: toast.TYPE.SUCCESS,
        autoClose: 4000,
      });
    }
  };

  const handleSubmit = (e) => {
    const actions = filter(moduleList.list, (item) => {
      if (item.read || item.write || item.hide) {
        return item;
      }
    });
    AddModuleAccess({ moduleAccess: actions }).then((response) => {
      if (response.data && response.data.error === false) {
        toast.success("The Access Mapping is done successfully !!!", {
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
        });
      }
      if (response.data && response.data.error === true) {
        toast.error(response.data.message, {
          type: toast.TYPE.ERROR,
          autoClose: 2000,
        });
      }
    });
  };

  return (
    <React.Fragment>
      <section className="container-fluid mr-5">
        <h5 className="text-center mt-5 mx-auto user-box">
          Rolewise Module Access Management
        </h5>
        <div className="row mt-4">
          <div className="col-md-4">
            <Select
              className="m-0"
              onChange={handleRole}
              options={roleList}
              valueKey="roleId"
              labelKey="roleName"
              getOptionLabel={(option) => option["roleName"]}
              getOptionValue={(option) => option["roleId"]}
              placeholder="Select Role"
            />
          </div>
          <div className="d-flex col-md-8">
            <button
              disabled={props.location.pathname.includes("view")}
              onClick={handleSubmit}
              className="add-btn btn btn-info btn-lg ml-auto">
              {" "}
              Save{" "}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <ReactTable data={moduleList.list} columns={columns} defaultPageSize={12} />
        </div>
      </section>
    </React.Fragment>
  );
}

export default RoleModuleAccessNew;