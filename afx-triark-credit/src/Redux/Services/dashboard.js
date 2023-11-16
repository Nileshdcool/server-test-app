//Get Case List
import { notification } from "antd";
import { post } from "../Utils/httpInterceptor";
import moment from "moment";

const start = moment().format("YYYY-MM-01");
const current = moment().format("YYYY-MM-DD");

export const getCaseList = async (data) => {
  const response = await post(`/triarc-credit/dashboard/getCaseListing`, {
    ...data,
    toDate: data?.toDate == "" ? "2090-01-01" : data?.toDate,
    fromDate: data?.fromDate == "" ? "1900-01-01" : data?.fromDate,
  });
  if (!response.data.error) {
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get Case counts
export const getCaseCounts = async (data) => {
  const response = await post(`/triarc-credit/dashboard/getTilesCount`, {
    ...data,
    toDate: data?.toDate == "" ? current : data?.toDate,
    fromDate: data?.fromDate == "" ? start : data?.fromDate,
  });
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// get lock validation
export const getLock = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getLockReleaseCaseStatus`,
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

export const releaseLock = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/saveLockReleaseCaseStatus`,
    {
      ...data,
    }
  );
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data;
  } else {
    // notification.error({ message: response.data.message });
    return response.data;
  }
};

// get listing data
export const getDocData = async (data) => {
  const response = await post(`/triarc-credit/document/getDocument`, {
    ...data,
    toDate: data?.toDate == "" ? "2090-01-01" : data?.toDate,
    fromDate: data?.fromDate == "" ? "1900-01-01" : data?.fromDate,
  });
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response?.data?.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};

//get detailed case list - view only

export const getCaseListingDetails = async (data) => {
  const response = await post(
    `/triarc-credit/dashboard/getCaseListingForApproveRejectCases`,
    {
      ...data,
      toDate: data?.toDate == "" ? "2090-01-01" : data?.toDate,
      fromDate: data?.fromDate == "" ? "1900-01-01" : data?.fromDate,
    }
  );
  if (!response.data.error) {
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
