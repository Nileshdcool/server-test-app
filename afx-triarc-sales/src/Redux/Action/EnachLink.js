import { 
    GET_CODE_AND_ID_SUCCESS, 
    GET_CODE_AND_ID_FAILURE 
} from "../Constants";

//---------------get Code and Id----------------
export const getCodeAndIdSuccess = (obj) => {
  return { type: GET_CODE_AND_ID_SUCCESS, payload: obj };
};

export const getCodeAndIdFailure = (obj) => {
  return { type: GET_CODE_AND_ID_FAILURE, payload: {} };
};