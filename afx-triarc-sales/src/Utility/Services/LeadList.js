import { get, post } from "../../Utility/httpInterceptor";

export const getLeadListCounts = (objBody = {}) => async () => {
  try {
    const response = await post(
      `/triarc-sales/lead/getLeadList`,
      objBody,
      false
    ).then((res) => {
      return res.data;
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getLeadByLeadCode = (id) => {
  return get(`/triarc-sales/lead/getLeadDetails?id=${id}`).then((res) => {
    console.log("getLeadByLeadCode", res, id);
    return res;
  });
};

export const getReasonList =
  // (objBody = {}) =>
  async () => {
    // dispatch(loading(true));
    try {
      const response = await get("/triarc-sales/master/getReasonMasterList");

      console.log("res...",response)
      // if (!response.data.error) {
      //   // dispatch(getLoanSummarySuccess(response.data));
      //   return response?.data
      // } else {
      // dispatch(getLoanSummaryFailure(response.data));
      return response?.data;
      // }
    } catch (err) {
    } finally {
      // dispatch(loading(false));
    }
  };