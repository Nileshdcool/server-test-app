import axios from 'axios';
import { getToken } from './helper';

// const baseURL = "https://rockett.club:8091";
// const serverURL = "https://cors-anywhere.herokuapp.com/";
// export const frontEndUrl = "https://rockett.club";

const baseURL = 'https://rockett.club';
const serverURL = 'https://cors-anywhere.herokuapp.com/';
export const frontEndUrl = 'https://rockett.club';
export const BASE_URL = `${window.location.protocol}//${
  window.location.hostname == 'localhost'
    ? 'rockett.club'
    : window.location.hostname
}`;

// const baseURL = "https://app.creditwisecapital.in";
// const serverURL = "https://cors-anywhere.herokuapp.com/";
// export const frontEndUrl = "https://app.creditwisecapital.in";

const handleResponse = (response) => {
  return {
    data: response.data,
  };
};

const handleError = (error) => {
  const { response } = error;
  return {
    message: response ? response.data.message : null,
    status: response ? response.status : null,
  };
};

export const get = (
  url,
  isPrivate = true,
  responseType = null,
  customUrl = false,
  headers
) => {
  let apiUrl = baseURL + url;
  if (customUrl) {
    apiUrl = url;
  }
  if (isPrivate && getToken()) {
    const isParam = apiUrl.includes('?');
    if (isParam) apiUrl = `${apiUrl}&&api_token=${getToken()}`;
    else apiUrl = `${apiUrl}?api_token=${getToken()}`;
  }

  headers = {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'Access-Control-Allow-Origin': '*',
  };
  const axiosObj = {
    method: 'get',
    url: apiUrl,
  };
  if (headers) {
    axiosObj.headers = headers;
  }
  if (responseType) axiosObj.responseType = responseType;
  return axios(axiosObj)
    .then((response) => handleResponse(response))
    .catch((error) => handleError(error));
};

export const post = async (
  url,
  bodyObj = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
) => {
  const apiUrl = !uat ? baseURL + url : url;
  if (isPrivate && getToken()) {
    if (bodyObj instanceof FormData) bodyObj.append('api_token', getToken());
    else bodyObj.api_token = getToken();
  }
  if (mediaFile == true) {
    let formData = await new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  //passing accessToken in Headers
  let header = {};
  if (!url.includes('authenticate')) {
    header = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Access-Control-Allow-Origin': '*',
    };
  }
  return axios
    .post(apiUrl, bodyObj, {
      headers: header,
    })
    .then((response) => handleResponse(response))
    .catch((error) => handleError(error));
};

export const postFile = (apiURL, bodyObj = {}, contentType) => {
  return axios({
    method: 'post',
    url: `${serverURL}${baseURL}${apiURL}`,
    data: bodyObj,
    config: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
    .then((response) => handleResponse(response))
    .catch((error) => handleError(error));
};

export const awspost = (
  url,
  bodyObj = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
) => {
  const apiUrl = !uat ? baseURL + url : url;

  if (mediaFile == true) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  return axios
    .post(apiUrl, bodyObj, {
      headers: {
        'x-api-key': 'n16HKWRvRq5ZwHTSrWm1o6BbuCT6PCVR62uotv3m',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then((response) => handleResponse(response))
    .catch((error) => handleError(error));
};

export const postAuth = (
  url,
  bodyObj = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
) => {
  const apiUrl = !uat ? baseURL + url : url;
  if (isPrivate && getToken()) {
    if (bodyObj instanceof FormData) bodyObj.append('api_token', getToken());
    else bodyObj.api_token = getToken();
  }
  if (mediaFile == true) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  //passing accessToken in Headers
  let header = {};
  // if (!url.includes("authenticate")) {
  //   header = {
  //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //     "Access-Control-Allow-Origin": "*",
  //   };
  // }
  return axios
    .post(apiUrl, bodyObj, {
      headers: header,
    })
    .then((response) => handleResponse(response))
    .catch((error) => handleError(error));
};

// export const postImage = async(

export const postImage = (
  url,
  bodyObj = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
) => {
  const apiUrl = !uat ? baseURL + url : url;

  if (isPrivate && getToken()) {
    if (bodyObj instanceof FormData) bodyObj.append('api_token', getToken());
    else bodyObj.api_token = getToken();
  }
  if (mediaFile == true) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  let header = {};
  if (!url.includes('authenticate')) {
    header = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Access-Control-Allow-Origin': '*',
    };
  }
  if (uat) {
    header['x-api-key'] = 'n16HKWRvRq5ZwHTSrWm1o6BbuCT6PCVR62uotv3m';
    header['Access-Control-Allow-Origin'] = '*';
  }
  return axios
    .post(apiUrl, bodyObj, {
      headers: header,
    })
    .then((response) => handleResponse(response))
    .catch((error) => {
      return handleError(error);
    });
};
//   url,
//   bodyObj = {},
//   isPrivate = true,
//   mediaFile = false,
//   uat = false
// ) => {
//   const apiUrl = !uat ? baseURL + url : url;

//   if (isPrivate && getToken()) {
//     if (bodyObj instanceof FormData) bodyObj.append("api_token", getToken());
//     else bodyObj.api_token = getToken();
//   }
//   if (mediaFile == true) {
//     let formData = await new FormData();
//     Object.keys(bodyObj).map((key) => {
//       formData.append(key, bodyObj[key]);
//     });
//     bodyObj = formData;
//   }
//   let header = {};
//   if (!url.includes("authenticate")) {
//     header = {
//       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       "Access-Control-Allow-Origin": "*",
//     };
//   }
//   if (uat) {
//     header["x-api-key"] = "n16HKWRvRq5ZwHTSrWm1o6BbuCT6PCVR62uotv3m";
//     header["Access-Control-Allow-Origin"] = "*";
//   }
//   return axios
//     .post(apiUrl, bodyObj, {
//       headers: header,
//     })
//     .then((response) => handleResponse(response))
//     .catch((error) => {
//       return handleError(error);
//     });
// };
