//Get Case List
import { notification } from "antd";
import axios from "axios";
import { twin2Post, postGupshup } from "../Utils/httpInterceptor";

export const getCaseListTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/disbursement/getGupshupDashboardData`,
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



export const getLockTwin2 = async (data) => {
  // console.log("de22", data);
  const response = await postGupshup(
    `/afx-Gupshup/disbursement/getLockReleaseCaseStatus`,
    {
      ...data,
    }
  );
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};

export const releaseLockTwin2 = async (data) => {
  // console.log("de22", data);
  const response = await postGupshup(
    `/afx-Gupshup/disbursement/saveLockReleaseCaseStatus`,
    {
      ...data,
    }
  );
  console.log(response, "releaseLock");
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};
