import React, { useEffect, useState } from "react";
import Select from "react-select";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  getAllPages,
  MyRoleList,
  getAccessByRoleId,
  AddAccess,
} from "../../Utils/management";
import find from "lodash/find";
import filter from "lodash/filter";
import { toast } from "react-toastify";
toast.configure();

function AccessNew(props) {
  const [roleList, setRoleList] = useState([]);
  const [pageList, setPageList] = useState({ list: [], initial: [] });

  useEffect(() => {
    const getData = async () => {
      const role = await MyRoleList();
      const pages = await getAllPages();
      if (!role.data.error) {
        setRoleList(role.data.data);
      }
      if (!pages.data.error) {
        const payload = pages.data.data.map((item) => {
          return { ...item, read: false, write: false, hide: false, id: null };
        });
        setPageList({ list: payload, initial: payload });
        toast.error(pages.data.message, {
          type: toast.TYPE.SUCCESS,
          autoClose: 4000,
        });
      }
    };
    getData();
    window.scroll(0, 0)
  }, []);

  const onChanged = (original, action) => {
    const newList = pageList.list.map((item) => {
      if (item.pageId === original.pageId) {
        return { ...original, ...action };
      } else {
        return item;
      }
    });
    setPageList({ ...pageList, list: newList });
  };

  const columns = [
    {
      Header: "Page Name",
      Cell: ({ original }) => {
        return original.pageName ? original.pageName : null;
      },
    },
    {
      Header: "Read",
      Cell: ({ original }) => (
        <input
          type="radio"
          name={original.pageId}
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
      Cell: ({ original }) => {
        return (
          <input
            type="radio"
            name={original.pageId}
            value="2"
            checked={original.write}
            onChange={(e) =>
              onChanged(original, { read: false, write: true, hide: false })
            }
          />
        );
      },
    },
    {
      Header: "Hide",
      Cell: ({ original }) => {
        return (
          <input
            type="radio"
            name={original.pageId}
            value="3"
            checked={original.hide}
            onChange={(e) =>
              onChanged(original, { read: false, write: false, hide: true })
            }
          />
        );
      },
    },
  ];

  const handleRole = async (e) => {
    const getRoleId = await getAccessByRoleId(e.roleId);
    if (!getRoleId.data.error) {
      console.log("pageList.initial-->", pageList.initial);
      const newPageList = pageList.initial.map((item) => {
        const getRole = find(getRoleId.data.data, {
          pageId: `${item.pageId}`,
        });
        let newData = { ...item, roleId: e.roleId };
        if (getRole) {
          getRole.pageId = parseInt(getRole.pageId);
          newData = { ...item, ...getRole };
        }
        return newData;
      });
      setPageList({ ...pageList, list: newPageList });
      toast.error(getRoleId.data.message, {
        type: toast.TYPE.SUCCESS,
        autoClose: 4000,
      });
    }
  };

  const handleSubmit = (e) => {
    const actions = filter(pageList.list, (item) => {
      if (item.read || item.write || item.hide) {
        return item;
      }
    });
    AddAccess({ accessMappingList: actions }).then((response) => {
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
          Admin Module Access Management
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
          <ReactTable
            data={pageList.list}
            columns={columns}
            defaultPageSize={12}
          />
        </div>
      </section>
    </React.Fragment>
  );
}

export default AccessNew;
