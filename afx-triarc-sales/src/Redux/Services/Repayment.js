import {
  post,
  nachGet,
  enachPost,
  enachNewLinkPost,
  camsGet,
  get,
} from "../../Utility/httpInterceptor";
import { te, ts } from "../../Utility/ReduxToaster";
import { loading } from "../Action/App";
import {
  saveRepaymentSuccess,
  saveRepaymentFailure,
  saveCommentSuccess,
  saveCommentFailure,
  getRepaymentSuccess,
  getRepaymentFailure,
  getCommentSuccess,
  getCommentFailure,
  saveEnachSuccess,
  saveEnachFailure,
} from "../Action/Repayment";

//------------------------------------------PDA----------------------
export const saveUpdateRepayment =
  (objBody = {}) =>
  async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await post("/triarc-sales/repayment/save", objBody, false);
      if (!response.data.error) {
        ts(response.data.message);
        return dispatch(saveRepaymentSuccess(response.data));
      } else {
        te(response.data.message);
        dispatch(saveRepaymentFailure(response.data));
      }
    } catch (err) {
      dispatch(saveRepaymentFailure());
    } finally {
      dispatch(loading(false));
    }
  };

export const saveUpdateComment =
  (objBody = {}) =>
  async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await post(
        "/triarc-sales/repayment/submit",
        objBody,
        false
      );
      if (!response.data.error) {
        ts(response.data.message);
        return dispatch(saveCommentSuccess(response.data));
      } else {
        te(response.data.message);
        dispatch(saveCommentFailure(response.data));
      }
    } catch (err) {
      dispatch(saveCommentFailure());
    } finally {
      dispatch(loading(false));
    }
  };

export const getRepaymentData =
  (objBody = {}) =>
  async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await post("/triarc-sales/repayment/get", objBody, false);
      if (!response.data.error) {
        ts(response.data.message);
        return dispatch(getRepaymentSuccess(response.data));
      } else {
        te(response.data.message);
        dispatch(getRepaymentFailure(response.data));
      }
    } catch (err) {
      dispatch(getRepaymentFailure());
    } finally {
      dispatch(loading(false));
    }
  };

export const getCommentData =
  (objBody = {}) =>
  async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await post(
        "/triarc-sales/repayment/getdisbursement",
        objBody,
        false
      );
      if (!response.data.error) {
        ts(response.data.message);
        return dispatch(getCommentSuccess(response.data));
      } else {
        te(response.data.message);
        dispatch(getCommentFailure(response.data));
      }
    } catch (err) {
      dispatch(getCommentFailure());
    } finally {
      dispatch(loading(false));
    }
  };

export const getEnach =
  (objBody = {}) =>
  async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await enachPost(
        "/paynimoenach/enach/getEnachResponseData",
        objBody,
        false
      );
      if (!response.data.error) {
        // ts(response.data.message);
        return dispatch(getCommentSuccess(response.data));
      } else {
        // te(response.data.message);
        dispatch(getCommentFailure(response.data));
      }
    } catch (err) {
      dispatch(getCommentFailure());
    } finally {
      dispatch(loading(false));
    }
  };

export const saveEnach =
  (objBody = {}) =>
  async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await nachGet(
        `/paynimoenach/enach/getEnachJson?applicantUniqueId=${objBody.applicantUniqueId}&debitStartDate=${objBody.debitStartDate}`,
        false
      );
      // const response = await nachPost(
      //   `/paynimoenach/enach/getEnachJson?applicantUniqueId=${76837684}&debitStartDate=${12123}`,
      //   false
      // );
      console.log("response--->", response);
      if (!response.data.error) {
        ts(response.data.message);
        return dispatch(saveEnachSuccess(response.data));
      } else {
        te(response.data.message);
        dispatch(saveEnachFailure(response.data));
      }
    } catch (err) {
      dispatch(saveEnachFailure());
    } finally {
      dispatch(loading(false));
    }
  };

export const saveRepayment =
  (objBody = {}) =>
  async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await enachNewLinkPost(
        "/triarc-sales/repayment/save",
        objBody,
        false
      );
      if (!response.data.error) {
        // ts(response.data.message);
        return dispatch(saveRepaymentSuccess(response.data));
      } else {
        // te(response.data.message);
        dispatch(saveRepaymentFailure(response.data));
      }
    } catch (err) {
      dispatch(saveRepaymentFailure());
    } finally {
      dispatch(loading(false));
    }
  };

//-------------------------------------------------------------------

export const postCamsDetails =
  (data = {}) =>
  async () => {
    console.log("objBody", data);
    try {
      const response = await camsGet(
        `/CAMPSPay-enach/enach/registerEnach?emi=${parseFloat(
          data?.emi
        ).toFixed(2)}&tenure=${data?.tenure}&emailId=${
          data?.emailId
        }&mobileNumber=${data?.mobileNumber}&applicantUniqueId=${
          data?.applicantUniqueId
        }&debitStartDate=${data?.debitStartDate}&accountHolderName=${
          data?.accountHolderName
        }&bankCode=${data?.ifsc?.substring(0, 4)}&ifsc=${
          data?.ifsc
        }&aadharNo=${123456789123}&accountNumber=${
          data?.accountNumber
        }&service=sales`,
        false
      );
      console.log("response--->", response);
      if (!response.data.error) {
        ts(response.data.message);
        return response?.data;
      } else {
        te(response.data.message);
        return response?.data;
      }
    } catch (err) {
      //  dispatch(saveEnachFailure());
    } finally {
      //  dispatch(loading(false));
    }
  };

export const getCamsDetails =
  (objBody = {}) =>
  async () => {
    console.log("objBody", objBody);
    try {
      const response = await get(
        `/triarc-sales/repayment/getApplicantDetailsForCampsPayEnach?applicantUniqueId=${objBody?.id}`,
        false
      );
      console.log("response--->", response);
      if (!response.data.error) {
        ts(response.data.message);
        return response?.data;
      } else {
        te(response.data.message);
        return response?.data;
      }
    } catch (err) {
      //  dispatch(saveEnachFailure());
    } finally {
      //  dispatch(loading(false));
    }
  };

export const getCams =
  (objBody = {}) =>
  async () => {
    console.log("objBody", objBody);
    try {
      const response = await camsGet(
        `/CAMPSPay-enach/enach/getCampsPayEnachResponse?loanId=${objBody?.id}`,
        // `/CAMPSPay-enach/enach/getCampsPayEnachResponse?loanId=${"1113"}`,
        false
      );
      if (!response.data.error) {
        ts(response.data.message);
        return response?.data;
      } else {
        // te(response.data.message);
        return response?.data;
      }
    } catch (err) {
      //  dispatch(saveEnachFailure());
    } finally {
      //  dispatch(loading(false));
    }
  };
