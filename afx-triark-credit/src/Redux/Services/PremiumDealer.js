import { notification } from "antd";
import { post } from "../Utils/httpInterceptor";
import moment from "moment";

const start = moment().format("YYYY-MM-01");
const current = moment().format("YYYY-MM-DD");

//Get Premium dealer Case List
export const getPremiumCaseListing = async (data) => {
  const response = await post(`/triarc-credit/dashboard/getPremiumCaseListing`, {
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
