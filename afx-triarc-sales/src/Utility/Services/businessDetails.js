import { get } from "../../Utility/httpInterceptor";
import { post } from "../httpInterceptor";

// fetch/get sectors
export const fetchSectors = (objBody = {}) => {
  return get(`/triarc-sales/qde/getsectormaster`, objBody).then((res) => {
    return res;
  });
};

// fetch/get industry
export const fetchIndustries = (objBody = {}) => {
  return get(`/triarc-sales/qde/getindustrylist`, objBody).then((res) => {
    return res;
  });
};
         
// fetch/get subIndustry
export const fetchSubIndustries = (sectorcode) => {
  return get(`/triarc-sales/qde/getsubindustrylist?sectorcode=${sectorcode}`).then(
    (res) => {
      return res;
    }
  );
};

// fetch segments
export const fetchSegments = (objBody = {}) => {
  return get(`/triarc-sales/qde/getsegmentlist`, objBody).then((res) => {
    return res;
  });
};

export const getBusinessDetails = (objBody = {}) => {

  return post(`/triarc-sales/qde/getqdeseciondetails`, {
    lead_code: objBody.lead_code,
    applicant_uniqueid: objBody.applicant_uniqueid,
  }).then((res) => {
    // objBody.callbackgetreff(res);
    return res;
  });
};
