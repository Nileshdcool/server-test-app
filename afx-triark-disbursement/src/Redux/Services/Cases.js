import { notification } from "antd";
import {
  get,
  post,
  getCD,
  postCD,
  postGupshup,
} from "../Utils/httpInterceptor";

//Get Case History
export const getCaseHistory = async (data) => {
  const response = await post(
    `/triarc-disbursement/casesummary/getCaseHistory`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get Case History
export const getLeadDetails = async (data) => {
  const response = await getCD(
    `/triarc-credit/casesummary/getLeadDetails?applicantUniqueId=${data.applicantUniqueId}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
//Get Deviation
export const getDeviation = async (data) => {
  const response = await postCD(`/triarc-admin/common/getBranchlist`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get Case Report
export const getCaseReport = async (data) => {
  const response = await postCD(`/triarc-credit/casesummary/getCaseReports`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get Case Summary
export const getCaseSummaryDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getcasesummarydetails`,
    data
  );
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getQdeDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getqdedetailsbyapplicantuniqid`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveLoanDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/saveLoanDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get decisioning reasons
export const getCaseDecisioningReason = async (data) => {
  const response = await getCD(
    `/triarc-credit/casesummary/getCaseDecisioningReason`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//saveVerify Status
export const saveVerifyStatus = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/saveVerifyStatus`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get DDE Details
export const getDdeDetails = async (data) => {
  const response = await postCD(`/triarc-credit/casesummary/getDdeDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//save decisioning
export const saveDecisioning = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/saveDecisioningDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//getCD decisioning
export const getCaseDecisioning = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getDecisioningDetails`,
    data
  );
  if (!response.data.error) {
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return {};
  }
};

//getCD RCU
export const getRCU = async (data) => {
  const response = await postCD(`/triarc-credit/casesummary/getRcuDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//save RCU
export const saveRCU = async (data) => {
  const response = await postCD(`/triarc-credit/casesummary/saveRcuComment`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// getTvrDetails
export const getTvrDetails = async (data) => {
  const response = await postCD(`/triarc-credit/casesummary/getTvrDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//saveVerify Status
export const saveTvrDetails = async (data) => {
  const response = await postCD(`/triarc-credit/casesummary/saveTvrDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Negative Pincode
export const negativePincode = async (data) => {
  const response = await postCD(`/triarc-credit/casesummary/getPincode`, data);
  http: if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// loan details
export const getLoanDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdeLoanDetailsByApplicantuniqId`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// refernce details
export const getReferenceDetailsFamily = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdeFamilyReferenceDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// refernce non-family details
export const getReferenceDetailsNonFamily = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdeNonFamilyReferenceDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// utility details
export const getUltilityDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdeUtilityBillDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// business details
export const getBusinessDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdeBusinessDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// personal details
export const getPersonalDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdePersonalDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// personal details
export const getAdditionalDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdeAdditionalDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// PanGst details
export const getPanGstDetails = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdePanGstDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// IndSelfSole details
export const getIndSoleFlag = async (data) => {
  const response = await postCD(
    `/triarc-credit/casesummary/getQdeIndSelfSoleFlagProductId`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// payment status details
export const getPaymentStatus = async (data) => {
  const response = await post(
    `/triarc-disbursement/paymentStatus/getPaymentStatus`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
// payment status details
export const saveOrUpdatePaymentStatus = async (data) => {
  const response = await post(
    `/triarc-disbursement/paymentStatus/saveOrUpdatePaymentStatus`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// twin2--------------------------------->

// payment status details
export const getDisbursementPaymentStatus = async (data) => {
  const response = await postGupshup(
    `/afx-Gupshup/twin2/getDisbursementPaymentStatus`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
// payment status details
export const saveDisbursementPaymentStatus = async (data) => {
  const response = await postGupshup(
    `/afx-Gupshup/twin2/saveDisbursementPaymentStatus`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
