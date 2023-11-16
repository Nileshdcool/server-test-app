//Get Case List
import { notification } from "antd";
import { post, postExcelDownload, postGupshup } from "../Utils/httpInterceptor";
import moment from "moment";

const start = moment().format("YYYY-MM-01");
const current = moment().format("YYYY-MM-DD");

export const saveDeferralDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/deferral/saveDeferralDetails`,
    {
      ...data
    }
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};

export const getDeferralDetails = async (data) => {
  const response = await post(`/triarc-disbursement/deferral/getDeferralDetails`, {
    ...data,
  });
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};

export const getDeferralEmployee = async (data) => {
  const response = await post(
    `/triarc-disbursement/deferral/getDeferralEmployee`,
    {
      ...data,
    }
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};

export const submitToDeferral = async (data) => {
  const response = await post(`/triarc-disbursement/deferral/submitToDeferral`, {
    ...data,
  });
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};