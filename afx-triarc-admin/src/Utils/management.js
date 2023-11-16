import { get, post } from "./httpInterceptor";

// add Role API
export const addRole = (data) => {
  return post(`/triarc-admin/access/addRole`, data).then((res) => {
    return res;
  });
};

// getRoleList API
export const MyRoleList = () => {
  return post(`/triarc-admin/access/getAllRoles`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("error is accured", err);
    });
};

// Delete RoleById API
export const deleteRoleById = (data) => {
  return post(`/triarc-admin/access/deleteRoleById?roleId=${data}`).then((res) => {
    return res;
  });
};

// GetRoleById API
export const getRoleById = (data) => {
  return post(`/triarc-admin/access/getRoleById?roleId=${data}`).then((res) => {
    return res;
  });
};

// add User API
export const AddUser = (data) => {
    return post(`/triarc-admin/authentication/addUser`, data).then((res) => {
    return res;
  });
};

// product list API
export const productlist = (data) => {
    return get(`/triarc-admin/common/getSubcategorylist?categoryid=101`).then(
    (res) => {
      return res;
    }
  );
};

//  add employee API
export const AddEmployee = (data) => {
  return post(`/growth-source/user/addEmployee`, data).then((res) => {
    return res;
  });
};

//Get Branch List
export const BranchList = (data) => {
  return get(`/triarc-admin/common/getBranchlist`, data).then((res) => {
    return res;
  });
};

//Logout
export const logout = () => {
  return get(`/triarc-admin/authentication/logout`).then((res) => {
    return res;
  });
};

// Get User List Api
export const getUserList = () => {
  // return post(`/growth-source/user/getuserlist`).then(res => {
  return get(`/triarc-admin/user/getuserlist`).then((res) => {
    return res;
  });
};

// GEt User BY unique ID
export const getUserByID = (data, moduleName) => {
  return post(
    `/triarc-admin/user/getUserByEmployeeId?employeeId=${data}&moduleName=${moduleName}`
  ).then((res) => {
    return res;
  });
};

// get Role By Id
export const getRoleByID = (data) => {
  return post(`/triarc-admin/access/getRoleById?roleId=${data}`).then((res) => {
    return res;
  });
};

// get All pages /growth-source/access/getAllPages
export const getAllPages = () => {
  return post(`/triarc-admin/access/getAllPages`).then((res) => {
    return res;
  });
};

// Add Access  /growth-source/access/addAccess
export const AddAccess = (data) => {
  return post(`/triarc-admin/access/addAccess`, data).then((res) => {
    return res;
  });
};

// get Access by Role Id   http://13.126.20.61:8080/growth-source/access/getAccessByRoleId?roleId=1
export const getAccessByRoleId = (data) => {
  return post(`/triarc-admin/access/getAccessByRoleId?roleId=${data}`).then(
    (res) => {
      return res;
    }
  );
};

// get All module name
export const getAllModule = () => {
  return post(`/triarc-admin/access/getModuleList`).then((res) => {
    return res;
  });
};

export const AddModuleAccess = (data) => {
  return post(`/triarc-admin/access/addrolebasedmoduleaccess`, data).then(
    (res) => {
      return res;
    }
  );
};

export const getModuleAccessByRoleId = (data) => {
  return post(
    `/triarc-admin/access/fetchingrolebasedmoduleaccessbyemployeeid?roleid=${data}`
  ).then((res) => {
    return res;
  });
};
