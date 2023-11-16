import { REACT_APP_SALES_MODULE_PORT } from '@env';
import axios from 'axios';
import { notification } from 'antd';

const PORT = '8093';
const PORT2 = '8087';
const PORT_SALES = '8087';
const PORT_TWIN = '9000';
const PORT_CKYC = '9023';

// export const BASE = 'http://15.207.163.154';
export const BASE = 'https://rockett.club';
// process.env.REACT_APP_ENV == "devlopment"
//   ? "http://15.207.163.154"
//   : "https://app.creditwisecapital.in";
const baseURL =
  process.env.REACT_APP_ENV == 'devlopment' ? `${BASE}` : `${BASE}`;
const baseURL2 =
  process.env.REACT_APP_ENV == 'devlopment' ? `${BASE}` : `${BASE}`;
const baseURLSales =
  process.env.REACT_APP_ENV == 'devlopment' ? `${BASE}:` : `${BASE}`;
const baseURLTwin =
  process.env.REACT_APP_ENV == 'devlopment' ? `${BASE}` : `${BASE}`;
const baseURLCkyc =
  process.env.REACT_APP_ENV == 'devlopment' ? `${BASE}` : `${BASE}`;

const handleError = (err) => {
  const errorResponse = {
    data: { message: 'Something went wrong.', error: true },
  };

  if (err.message === 'Network Error') {
    errorResponse.data.message = err.message;
    return errorResponse;
  }
  const { response } = err;
  if (response.status === 500) {
    try {
      const res = JSON.parse(response.data.split('}')[1] + '}');
      if (res.statusCode === '401') {
        // window.location.href = REDIRECT_URL;
        errorResponse.data.message = res.message;
        return errorResponse;
      }
    } catch (err) {}
  }
  return errorResponse;
};

export const getFilePath = (filePath) =>
  filePath?.replace('/var/www/html', BASE);

export const get = async (url) => {
  let apiUrl = baseURL + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  const axiosObj = {
    method: 'get',
    url: apiUrl,
    headers,
  };
  try {
    return await axios(axiosObj);
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};

export const getDownloadZipFiles = async (url) => {
  let apiUrl = baseURL + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  const axiosObj = {
    method: 'get',
    url: apiUrl,
    headers,
    responseType: 'blob',
  };
  try {
    return await axios(axiosObj);
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};

export const getLoanDetail = async (url) => {
  let apiUrl = baseURL2 + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  const axiosObj = {
    method: 'get',
    url: apiUrl,
    headers,
  };
  try {
    return await axios(axiosObj);
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};

export const post = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURL + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  if (mediaFile) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;

    header['Content-Type'] = 'multipart/form-data';
  }

  try {
    return await axios.post(apiUrl, bodyObj, {
      headers: header,
    });
  } catch (err) {
    return handleError(err);
  }
};

export const tvrReferencePost = async (
  url,
  bodyObj = {},
  mediaFile = false
) => {
  let apiUrl = baseURL + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data',
  };
  if (mediaFile) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }

  try {
    return await axios.post(apiUrl, bodyObj, {
      headers: header,
    });
  } catch (err) {
    return handleError(err);
  }
};
export const postLoanDet = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURL2 + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  if (mediaFile) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;

    header['Content-Type'] = 'multipart/form-data';
  }

  try {
    return await axios.post(apiUrl, bodyObj, {
      headers: header,
    });
  } catch (err) {
    return handleError(err);
  }
};
export const postSales = async (
  url,
  bodyObj = {},
  mediaFile = false,
  isPrivate = false
) => {
  if (isPrivate) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-api-key': 'WEhMRi7Mvl1A0695pxEcN7kpmPzIE7ot5D9Xj6A0',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...bodyObj,
      }),
    }).catch((re) => {
      notification.error({ message: 'Something Went Wrong' });
    });
    if (response?.ok) {
      // if HTTP-status is 200-299
      // get the response body (the method explained below)
      let json = await response.json();
      return json;
    }
  } else {
    let apiUrl = baseURLSales + url;
    let header = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Access-Control-Allow-Origin': '*',
    };
    if (mediaFile) {
      let formData = new FormData();
      Object.keys(bodyObj).map((key) => {
        formData.append(key, bodyObj[key]);
      });
      bodyObj = formData;

      header['Content-Type'] = 'multipart/form-data';
    }

    try {
      return await axios.post(apiUrl, bodyObj, {
        headers: header,
      });
    } catch (err) {
      return handleError(err);
    }
  }
};

export const getSales = async (url) => {
  let apiUrl = baseURLSales + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  const axiosObj = {
    method: 'get',
    url: apiUrl,
    headers,
  };
  try {
    return await axios(axiosObj);
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};

export const postTwin = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURLTwin + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  if (mediaFile) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;

    header['Content-Type'] = 'multipart/form-data';
  }

  try {
    return await axios.post(apiUrl, bodyObj, {
      headers: header,
    });
  } catch (err) {
    return handleError(err);
  }
};

export const postckyc = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURLCkyc + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Origin': '*',
  };
  if (mediaFile) {
    let formData = new FormData();
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;

    header['Content-Type'] = 'multipart/form-data';
  }

  try {
    return await axios.post(apiUrl, bodyObj, {
      headers: header,
    });
  } catch (err) {
    return handleError(err);
  }
};
