//Get Case List
import { notification } from "antd";
import { post,get } from "../Utils/httpInterceptor";

// get disbs details
export const getDisbursementDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/disbursementDetails/getDisbursementMode`,
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
export const saveDisbursementDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/disbursementDetails/saveDisbursementMode`,
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

// partner bank dropdown
export const getPartnerBank = async () => {
  const response = await get(
    `/triarc-disbursement/disbursementDetails/getPartnerBank`
    );
    if (!response.data.error) {
      return response.data.data;
    } else {
      notification.error({ message: response.data.message });
      return [];
  }
};

// disbs type dropdown
export const getDisbursementType = async () => {
  const response = await get(
    `/triarc-disbursement/disbursementDetails/getDisbursementType`
  );
  if (!response.data.error) {
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

