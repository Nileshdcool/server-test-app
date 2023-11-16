//Get Case List
import { notification } from "antd";
import { post } from "../Utils/httpInterceptor";

export const getCaseSummaryDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/casesummary/getcasesummarydetails`,
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

export const getDisbursmentAmount = async (data) => {
  const response = await post(
    `/triarc-disbursement/disbursementDetails/getDisbursementAmount`,
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

export const saveDisbursmentAmount = async (data) => {
  const response = await post(
    `/triarc-disbursement/disbursementDetails/saveDisbursementAmount`,
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

export const getPreDisbrsalData = async (data) => {
  const response = await post(
    `/triarc-disbursement/document/getPreDocument`,
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

export const savePredusbursalData = async (data) => {
  const response = await post(
    `/triarc-disbursement/document/savePreDocument`,
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

export const getPostDisbursal = async (data) => {
  const response = await post(
    `/triarc-disbursement/document/getPostDocument`,
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

export const postDisbursal = async (data) => {
  const response = await post(
    `/triarc-disbursement/document/savePostDocument`,
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
