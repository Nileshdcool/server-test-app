//Get Case List
import { notification } from "antd";
import axios from "axios";
import { twin2Post, twin2Put } from "../Utils/httpInterceptor";

// // get disbs details olldport 9000 FOR PROD
export const getDisbursementDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/gupshupapi/getQdeBankDetails`,
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

// get disbs amt details oldport 9000 FOR PROD
export const getDisbursementAmountDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/gupshupapi/getQdeDisbursementAmount`,
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

// save disbs details
export const saveDisbursementDetailsTwin2 = async (data) => {
  const response = await twin2Put(
    `/afx-Gupshup/disbursement/saveDisbursementDetails`,
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

// save disbs amt details
export const saveDisbursementAmountDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/disbursement/updateDisbursementAmount`,
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
