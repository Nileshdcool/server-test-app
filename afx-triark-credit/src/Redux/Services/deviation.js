import { notification } from "antd";
import { post } from "../Utils/httpInterceptor";

export const getDeviationDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getDeviationDetails`,
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
