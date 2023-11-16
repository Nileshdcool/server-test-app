import {
  SAVE_REPAYMENT_SUCCESS,
  SAVE_REPAYMENT_FAILURE,
  SAVE_COMMENT_SUCCESS,
  SAVE_COMMENT_FAILURE,
  GET_REPAYMENT_SUCCESS,
  GET_REPAYMENT_FAILURE,
  GET_COMMENT_SUCCESS,
  GET_COMMENT_FAILURE,
  SAVE_ENACH_SUCCESS,
  SAVE_ENACH_FALIURE,
} from "../Constants";

const initialState = {
  getQdeDetails: null,
  repayment: {
    data: {},
  },
  saveRepayment: false,
  comment:{
    data:{}
  },
  saveComment: null,
  repay:[],
  disbsComment:[],
  eNach: {
    data: {}
  },
  saveEnach: null
};

function repaymentReducer(state = initialState, action) {
  switch (action.type) {
    //-----------------------------Repayment-----------------------------
    case SAVE_REPAYMENT_SUCCESS:
      return {
        ...state,
        addSuccess: true,
        repayment: action.payload,
        saveRepayment: true,
        getQdeDetails: true,
      };

    case SAVE_REPAYMENT_FAILURE:
      return {
        ...state,
        repayment: {},
        saveRepayment: false,
        getQdeDetails: false,
      };

    case SAVE_COMMENT_SUCCESS:
      return {
        ...state,
        addSuccess: true,
        comment: action.payload,
        saveComment: true,
        getQdeDetails: true,
      };

    case SAVE_COMMENT_FAILURE:
      return {
        ...state,
        comment: {},
        saveComment: false,
        getQdeDetails: false,
      };

    case GET_REPAYMENT_SUCCESS:
      return {
        ...state,
        repay: action.payload,
      };

    case GET_REPAYMENT_FAILURE:
      return {
        ...state,
        repay: [],
      };

    case GET_COMMENT_SUCCESS:
      return {
        ...state,
        disbsComment: action.payload,
      };

    case GET_COMMENT_FAILURE:
      return {
        ...state,
        disbsComment: [],
      };

    case SAVE_ENACH_SUCCESS:
      return {
        ...state,
        addSuccess: true,
        eNach: action.payload,
        saveEnach: true,
        getQdeDetails: true,
      };

    case SAVE_ENACH_FALIURE:
      return {
        ...state,
        eNach: {},
        saveEnach: false,
        getQdeDetails: false,
      };

    default:
      return state;
  }
}
export default repaymentReducer;
