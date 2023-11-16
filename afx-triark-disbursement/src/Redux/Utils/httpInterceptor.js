import { REACT_APP_SALES_MODULE_PORT } from '@env';
import axios from 'axios';

const PORT = '8096';
const PORT_Case_DETAILS = '8093';
const PORT_CAMS = '9005';
const PORT_SALES = '8087';
const PORT_TWIN2 = '9015';
const PORT_GUPSHUP = '9000';

export const BASE = 'https://rockett.club';
const baseURL = `${BASE}`;
const baseURLCD = `${BASE}`;
const baseURLTwin = `${BASE}`;
const baseURLGupshup = `${BASE}`;

const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
const REDIRECT_URL = `${FrontendURL}:${REACT_APP_SALES_MODULE_PORT}`;

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
        // errorResponse.data.message = res.message;
        // return errorResponse;
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
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

export const postGupshup = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURLGupshup + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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
export const enachPost = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = `https://rockett.club` + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

export const nachGet = async (url) => {
  let apiUrl = `https://rockett.club` + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

// ----------Case Deatils------------

export const getFilePathCD = (filePath) =>
  filePath?.replace('/var/www/html', BASE);

export const getCD = async (url) => {
  let apiUrl = baseURLCD + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

export const postCD = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURLCD + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

// -----------------------------------------------
export const camsGet = async (url) => {
  let apiUrl = `https://rockett.club` + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

export const salesGet = async (url) => {
  let apiUrl = `https://rockett.club` + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

export const twin2Get = async (url, bodyObj = {}) => {
  let apiUrl = baseURLTwin + url;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
    'Access-Control-Allow-Origin': '*',
  };
  const axiosObj = {
    method: 'get',
    url: apiUrl,
    params: bodyObj,
    headers,
  };
  try {
    return await axios(axiosObj);
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};

export const twin2Post = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURLTwin + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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

export const twin2Put = async (url, bodyObj = {}, mediaFile = false) => {
  let apiUrl = baseURLTwin + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
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
    return await axios.put(apiUrl, bodyObj, {
      headers: header,
    });
  } catch (err) {
    return handleError(err);
  }
};

export const postExcelDownload = async (url, bodyObj = {}) => {
  let apiUrl = baseURL + url;
  let header = {
    Authorization: `Bearer ${localStorage.getItem('disbstoken')}`,
    'Access-Control-Allow-Origin': '*',
  };

  try {
    return await axios.post(apiUrl, bodyObj, {
      headers: header,
      responseType: 'arraybuffer',
    });
  } catch (err) {
    return handleError(err);
  }
};
