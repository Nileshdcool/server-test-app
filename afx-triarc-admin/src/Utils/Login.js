//Sync action for storing accessToken, employeeId, id
export const syncLogin = obj => {
    if (obj && obj.data.token) 
    {
      localStorage.setItem("accessToken", obj.data && obj.data.token);
    }
    localStorage.setItem("employeeId", obj.data && obj.data.data.employeeId);
    localStorage.setItem("id", obj.data && obj.data.data.id);
    localStorage.setItem("roleId", obj.data && obj.data.data.roleId);
    delete obj.error
    delete obj.statusCode
    // obj.userData = userData
    return { type: "login", payload: obj };
  };
  
export const syncLogout = obj => {
  localStorage.setItem("accessToken", "");
  localStorage.setItem("employeeId", "");
  localStorage.setItem("id", "");
  localStorage.setItem("roleId", "");
  return { type: "logout", payload: {} };
};

  