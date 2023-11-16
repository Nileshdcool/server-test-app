import { loading } from "../Action/App";
import { te, ts } from "../../Utility/ReduxToaster";
import {
  getCodeAndIdSuccess,
  getCodeAndIdFailure,
} from "../Action/EnachLink";
import { enachPost } from "../../Utility/httpInterceptor";

//-------get Code and Id-------------
export const getCodeAndId =
(objBody = {}) =>
async (dispatch) => {
    // let value = qs.stringify(objBody);
    // console.log("value--->", value)
    dispatch(loading(true));
    try {
    const response = await enachPost(
      "/paynimoenach/enach/submitEnachForGushup",
      objBody,
      false
    );
    if (!response.data.error) {
        ts(response.data.message);
        return dispatch(getCodeAndIdSuccess(response.data));
    } else {
        te(response.data.message);
        dispatch(getCodeAndIdFailure(response.data));
    }
    } catch (err) {
    dispatch(getCodeAndIdFailure(err));
    } finally {
    dispatch(loading(false));
    }
};
