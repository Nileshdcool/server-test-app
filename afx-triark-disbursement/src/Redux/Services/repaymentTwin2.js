//Get Repayment details
import { notification } from "antd";
import axios from "axios";
import {
  post,
  get,
  enachPost,
  nachGet,
  camsGet,
  salesGet,
  twin2Post,
  twin2Get,
} from "../Utils/httpInterceptor";

export const camsDataTwin2 = async (data) => {
  const response = await twin2Get(
    `/afx-Gupshup/enach/getRepaymentMode?gupshupApiRequestId=${data?.gupdhupId}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    // notification.error({ message: response.data.message });
    return response.data;
  }
};

export const getBankDetailsTwin2 = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/disbursement/getBankAccountDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    // notification.error({ message: response.data.message });
    return response.data;
  }
};

export const getDecisioningDetails = async (data) => {
  const response = await twin2Get(
    `/afx-Gupshup/disbursement/getDecisioningDetails?gupshupId=${data?.gupshupId}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const updateDecisioningDetails = async (data) => {
  const response = await twin2Get(
    `/afx-Gupshup/disbursement/updateDecisioningDetails?gupshupId=${data?.gupshupId}&engineNumber=${data?.engineNumber}&chassisNumber=${data?.chasisNumber}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveDecisioningDetailsLMS = async (data) => {
  const response = await twin2Post(
    `/afx-Gupshup/disbursement/saveDecisioningDetails`,
    data
  );
  if (!response.data.error) {
    if (response.data.lmsResponse) {
      const msg = response.data.lmsResponse.map((item) => {
        if (item.error) {
          notification.error({ message: item.message });
        } else {
          notification.success({ message: item.message });
        }
        return item;
      });
    } else {
      notification.success({ message: response.data.message });
    }
    return response.data.data;
  } else {
    if (response.data.lmsResponse) {
      const msg = response.data.lmsResponse.map((item) => {
        if (item.error) {
          notification.error({ message: item.message });
        } else {
          notification.success({ message: item.message });
        }
        return item;
      });
    } else {
      notification.error({ message: response.data.message });
    }
    return [];
  }
};
