import { get, post, postFile, awspost } from "./httpInterceptor";

export const PanDetails = (objBody) => {
  return awspost(
    "https://uc9q5045lj.execute-api.us-east-2.amazonaws.com/Test/pan-auth",
    objBody,
    false,
    false,
    true
  ).then((res) => {
    return res;
  });
};

export const GstNumber = (objBody) => {
  return awspost(
    "https://uc9q5045lj.execute-api.us-east-2.amazonaws.com/Test/gst-by-pan",
    objBody,
    false,
    false,
    true
  ).then((res) => {
    return res;
  });
};

// GST Address Details
// export const Gstaddress = data => {
//   return post(`/triarc-admin/api/getGSTAddressDetails`, data).then(res => {
//     return res;
//   });
// };

export const Gstaddress = (objBody) => {
  return awspost(
    "https://uc9q5045lj.execute-api.us-east-2.amazonaws.com/Test/gst-authentication",
    objBody,
    false,
    false,
    true
  ).then((res) => {
    return res;
  });
};

// get All Cities
export const getAllState = () => {
    return get(`/triarc-admin/common/getAllStates`).then(res => {
    return res;
  });
};

export const getAllCities = data => {
      return get(`/triarc-admin/common/getCity?state=${data}`).then(res => {
    return res;
  });
};

// add DSA API
export const AddDSA = data => {
  return post(`/triarc-admin/dsa/addDsa`, data).then(res => {
    return res;
  });
};

// getCompanytypeList Api
export const getCompanytypeList = data => {
    return get(`/triarc-admin/common/getSubcategorylist?categoryid=${101}`).then(
    res => {
      return res;
    }
  );
};

//Get all Dsa List for checker
export const getAllDSA = data => {
  return post(`/triarc-admin/dsa/getdsalist?status=${data}`).then(res => {
    return res;
  });
};

// Get DsaByUniqueId
export const getDsaByUniqueId = data => {
    return post(`/triarc-admin/dsa/getDsaByUniqueId?applicationNumber=${data}`).then(
    res => {
      return res;
    }
  );
};

export const uploadDoc = (data, zip) => {
  return post(
    `/triarc-admin/dsa/uploadDoc?dsaDocs=${encodeURIComponent(
      JSON.stringify(data)
    )}
    `,
    zip,
    "multipart/form-data"
  ).then(res => {
    return res;
  });
};

//Is mobile number present  http://13.126.20.61:8080/growth-source/user/isMobileNumberPresent?mobileNumber=8888620092
export const postIsMobileNumberPresent = mobileNumber => {
  return post(
    `/triarc-admin/user/isMobileNumberPresent?mobileNumber=${mobileNumber}`
  ).then(res => {
    return res;
  });
};

//Is email is already exist  http://13.126.20.61:8080/growth-source/user/isemailIdPresent?emailId=vivekpatil119@gmail.com
export const postIsEmailExist = email_address => {
  return post(
    `/triarc-admin/user/isemailIdPresent?emailId=${email_address}`
  ).then(res => {
    return res;
  });
};

//Get Branch List
export const BranchList = data => {
  return get(`/triarc-admin/common/getBranchlist`, data).then(res => {
    return res;
  });
};
