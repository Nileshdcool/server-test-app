//Sit server
// export const API_URL = "http://35.154.202.170/";
//stage server
//3.6.147.9

export const BASE_URL = `${window.location.protocol}//${
  window.location.hostname == 'localhost'
    ? 'rockett.club'
    : window.location.hostname
}`;

// export const API_URL = `${BASE_URL}:8087`;
export const API_URL = `${BASE_URL}`;

// export const NACH_URL = `${BASE_URL}:8095`;
export const NACH_URL = `${BASE_URL};`;

// export const CAMS_URL = `${BASE_URL}:9007`;
export const CAMS_URL = `${BASE_URL}`;

//export const API_URL = `http://f123115413e5.ngrok.io`;

export const FrontendURL = `${window.location.protocol}//${window.location.hostname}:5000`;

export const FileUrl = `${window.location.protocol}//${window.location.hostname}/`;
