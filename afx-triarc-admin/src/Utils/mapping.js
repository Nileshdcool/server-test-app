import { get, post } from "./httpInterceptor";

// Dynamic hierarcy API MAPPING Start

export const getMappedDsa = (data) => {
  return post(`/triarc-admin/salesHierarchy/getMappedDsa`, data).then((res) => {
    return res;
  });
};

export const getUnmappedDsa = (data) => {
  return post(`/triarc-admin/salesHierarchy/getUnMappedDsa`, data).then((res) => {
    return res;
  });
};

//Get SM Employee search by Id
export const getAllSM = (data) => {
  return get(
    `/triarc-admin/salesHierarchy/getEmployeeByRoleName?roleName=${data}`
  ).then((res) => {
    return res;
  });
};

//get mapped RSm  /growth-source/user/getUnMappedEmployees
export const getUnMappedEmployees = (data) => {
  return post(`/triarc-admin/salesHierarchy/getUnMappedEmployees`, data).then(
    (res) => {
      return res;
    }
  );
};

// Get mapped Emplooye  /growth-source/user/getMappedEmployees
export const getMappedEmployees = (data) => {
  return post(`/triarc-admin/user/getMappedEmployees`, data).then((res) => {
    return res;
  });
};


//----------------------------Sales Hierarchy--------------------------------
export const getSalesHigherHierarchyData = (roleName) => {
  return get(
    `/triarc-admin/salesHierarchy/getEmployeeByRoleName?roleName=${roleName}`
  ).then((res) => {
    return res;
  });
};

export const getSalesMappedData = (data) => {
  return post(`/triarc-admin/salesHierarchy/getMappedEmployees`, data).then(
    (res) => {
      return res;
    }
  );
};

export const getSalesUnmappedData = (data) => {
  return post(`/triarc-admin/salesHierarchy/getUnMappedEmployees`, data).then(
    (res) => {
      return res;
    }
  );
};

export const SaveSalesHierarchyMapping = (data = {}, val) => {
  return post(
    `/triarc-admin/salesHierarchy/createOrUpdateSalesHierarchyMapping?flag=${val}`,
    data
  ).then((res) => {
    return res;
  });
};

//----------------------------Credit Hierarchy-------------------------------
export const getCreditHigherHierarchyData = (roleName) => {
  return get(
    `/triarc-admin/creditHierarchy/getEmployeeByRoleName?roleName=${roleName}`
  ).then((res) => {
    return res;
  });
};

export const getCreditMappedData = (data) => {
  return post(`/triarc-admin/creditHierarchy/getMappedEmployees`, data).then(
    (res) => {
      return res;
    }
  );
};

export const getCreditUnMappedData = (data) => {
  return post(`/triarc-admin/creditHierarchy/getUnMappedEmployees`, data).then(
    (res) => {
      return res;
    }
  );
};

export const SaveCreditHierarchyMapping = (data = {}, val) => {
  return post(
    `/triarc-admin/creditHierarchy/createOrUpdateCreditHierarchyMapping?flag=${val}`,
    data
  ).then((res) => {
    return res;
  });
};

//----------------------------Disbursement Hierarchy-------------------------------
export const getDisbursementHigherHierarchyData = (roleName) => {
  return get(
    `/triarc-admin/disbursementHierarchy/getEmployeeByRoleName?roleName=${roleName}`
  ).then((res) => {
    return res;
  });
};

export const getDisbursementMappedData = (data) => {
  return post(`/triarc-admin/disbursementHierarchy/getMappedEmployees`, data).then(
    (res) => {
      return res;
    }
  );
};

export const getDisbursementUnMappedData = (data) => {
  return post(`/triarc-admin/disbursementHierarchy/getUnMappedEmployees`, data).then(
    (res) => {
      return res;
    }
  );
};

export const SaveDisbursementHierarchyMapping = (data = {}, val) => {
  return post(
    `/triarc-admin/disbursementHierarchy/createOrUpdateDisbursementHierarchyMapping?flag=${val}`,
    data
  ).then((res) => {
    return res;
  });
};