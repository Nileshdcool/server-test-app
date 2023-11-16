import {
  GET_CODE_AND_ID_SUCCESS,
  GET_CODE_AND_ID_FAILURE,
} from "../Constants/";

const initialState = {
  loading: null,
  getCodeId: null,
};

function enachLinkReducer(state = initialState, action) {
  switch (action.type) {

    //----------get Code and Id----------------------
    case GET_CODE_AND_ID_SUCCESS:
      return {
        ...state,
        getCodeId: action.payload,
        loading: false,
      };

    case GET_CODE_AND_ID_FAILURE:
      return { ...state, getCodeId: null, loading: false };

    default:
      return state;
  }
}

export default enachLinkReducer;
