import { notification } from "antd";
import { post, get } from "../Utils/httpInterceptor";

export const getFIDetails = async (data) => {
    const response = await post(
      `/triarc-credit/casesummary/getFiFormDetails`,
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

//for getting address data
export const getTriggerFI = async (data) => {
  const response = await post(`/triarc-credit/casesummary/triggerFi`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//for getting formDetail
export const getFormDetails = async (data) => {
  const response = await post(`/triarc-credit/casesummary/getFiFormDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//for getting all FI Active users
export const getActiveUsers = async (data) => {
  const response = await get(`/triarc-credit/casesummary/getFiActiveUsers`);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//for submitting Fi
export const submitData = async (data) => {
  const response = await post(`/triarc-credit/casesummary/submitToFi`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//for getting images
export const getDocumentsData = async (data) => {
  const response = await post(`/triarc-credit/casesummary/getDocuments`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};