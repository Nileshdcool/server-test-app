//Get Case List
import { notification } from "antd";
import axios from "axios";
import { twin2Post } from "../Utils/httpInterceptor";

export const getCaseSummaryDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/disbursement/getGupshupCaseSummary`,
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

export const getKYCDocDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/qdeDisbursement/getKYCDocDetails`,
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

export const getUtilityDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/qdeDisbursement/getUtilityBillDetails`,
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

export const getCurResidenceDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/qdeDisbursement/getCurResidenceDetails`,
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

export const getPersonalDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/qdeDisbursement/getPersonalDetails`,
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

export const getPANDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/qdeDisbursement/getPanDetails`,
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

export const getLoanDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/gupshupapi/getQdeLoanDetails`,
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

export const getPreDocumentsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/disbursement/getPreDocument`,
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
