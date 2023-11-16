//Get Case List
import { notification } from "antd";
import { post, postExcelDownload, postGupshup } from "../Utils/httpInterceptor";
import moment from "moment";

const start = moment().format("YYYY-MM-01");
const current = moment().format("YYYY-MM-DD");

export const getCaseList = async (data) => {
  const response = await post(`/triarc-disbursement/dashboard/getCaseListing`, {
    ...data,
    toDate: data?.toDate == "" ? "2090-01-01" : data?.toDate,
    fromDate: data?.fromDate == "" ? "1900-01-01" : data?.fromDate,
  });
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
// update payment status listing
export const getPaymentStatusCaseListing = async (data) => {
  const response = await post(
    `/triarc-disbursement/dashboard/getPaymentStatusCaseListing`,
    {
      ...data,
      toDate: data?.toDate == "" ? "2090-01-01" : data?.toDate,
      fromDate: data?.fromDate == "" ? "1900-01-01" : data?.fromDate,
    }
  );
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// update payment status listing
export const getGupshupDashboardDataByPaymentStatus = async (data) => {
  const response = await postGupshup(
    `/afx-Gupshup/disbursement/getGupshupDashboardDataByPaymentStatus`,
    {
      ...data,
      toDate: null,
      fromDate: null,
    }
  );
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get Case counts
export const getCaseCounts = async (data) => {
  const response = await post(`/triarc-disbursement/dashboard/getTilesCount`, {
    ...data,
    toDate: data?.toDate == "" ? current : data?.toDate,
    fromDate: data?.fromDate == "" ? start : data?.fromDate,
  });
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    let res = {
      "Disbursement Query Resolved":
        response?.data?.data?.disbursementQueryResolved,
      Sanctioned: response?.data?.data?.sanctioned,
      "Submit to LMS": response?.data?.data?.submitToLms,
      "Post Disbursal Upload Done":
        response?.data?.data?.postDisbursalUploadDone,
    };
    return res;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//get detailed case list - view only

export const getCaseListingDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/dashboard/getViewCaseListing`,
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

export const exportDump = async (data) => {
  await postExcelDownload(
    `/triarc-disbursement/dashboard/getViewCaseListingExport`,
    {
      ...data,
    }
  ).then((response) => {
    const today = moment(new Date()).format("DD-MM-YYYY");
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `DumpReport-${today}.xlsx`);
    document.body.appendChild(link);
    link.click();
  });
};

export const getLock = async (data) => {
  //
  const response = await post(
    `/triarc-disbursement/casesummary/getLockReleaseCaseStatus`,
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
  //
  const response = await post(
    `/triarc-disbursement/casesummary/saveLockReleaseCaseStatus`,
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
