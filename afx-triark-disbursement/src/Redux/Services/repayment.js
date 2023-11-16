//Get Repayment details
import { notification } from 'antd';
import {
  post,
  get,
  enachPost,
  nachGet,
  camsGet,
  salesGet,
} from '../Utils/httpInterceptor';

export const getRepaymentDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/repayment/getRepaymentDetails`,
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

export const getBanktDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/repayment/getBankDetails`,
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

export const getDecisioningDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/repayment/getDecisioningDetails`,
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

export const saveDecisioningDetails = async (data) => {
  const response = await post(
    `/triarc-disbursement/repayment/saveDecisioningDetails`,
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

export const saveDecisioningDetailsLMS = async (data) => {
  const response = await post(
    `/triarc-disbursement/repayment/saveDecisioningDetails`,
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

export const getNachDetails = async (data) => {
  const response = await camsGet(
    `/CAMPSPay-enach/enach/getCampsPayEnachResponse?loanId=${data?.applicantUniqueId}`
  );
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    // notification.error({ message: response.data.message });
    return [];
  }
};

export const saveEnach = async (data) => {
  const response = await nachGet(
    `/paynimoenach/enach/getEnachJson?applicantUniqueId=${data.applicantUniqueId}&debitStartDate=${data.debitStartDate}`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const verifyBankAccount = async (data) => {
  const response = await post(
    `/triarc-disbursement/repayment/verifyBankAccoutNumber`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    // return [];
    return response.data.data;
  }
};

export const getDropdownValue = async (data) => {
  const response = await get(
    `/triarc-disbursement/repayment/getBankAccountType`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    // return [];
    return response.data.data;
  }
};

export const getIFSCDetails = async (data) => {
  // https://rockett.club:8096/triarc-disbursement/repayment/getBankDetailsFromIfsc
  const response = await post(
    `/triarc-disbursement/repayment/getBankDetailsFromIfsc`,
    data
  );
  if (response.data.KarzaStatusCode === '101') {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: 'Please enter valid IFSC code' });
    // return [];
    return response.data.data;
  }
};

export const getPennyDetails = async (data) => {
  const response = await post(`/triarc-sales/qde/verifyBankAccoutNumber`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: 'Please enter valid IFSC code' });
    // return [];
    return response.data.data;
  }
};

export const saveUpdateRepayment = async (data) => {
  const response = await post(`/triarc-disbursement/repayment/save`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const camsData = async (data) => {
  const response = await camsGet(
    `/CAMPSPay-enach/enach/getCampsPayEnachResponse?loanId=${data?.id}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    // notification.error({ message: response.data.message });
    return response.data;
  }
};

export const editCount = async (data) => {
  const response = await post(
    `/triarc-disbursement/repayment/saveEditCount`,
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

export const getEngineChasis = async (data) => {
  const response = await get(
    `/triarc-disbursement/decision/getDecisioningDetails?applicantUniqueid=${data.id}`
  );

  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
export const updateEngineChasis = async (data) => {
  const response = await get(
    `/triarc-disbursement/decision/updateDecisioningDetails?applicantUniqueid=${data.id}&engineNumber=${data?.engineNumber}&chassisNumber=${data.chassisNumber}`
  );

  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
export const getQueryReasonType = async (data) => {
  const response = await get(
    `/triarc-disbursement/disbursementDetails/getQueryReasonType`
  );

  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
export const getSubQueryReasonType = async (data) => {
  const response = await post(
    `/triarc-disbursement/disbursementDetails/getSubQueryReasonType`,
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

// -----------------------------------------------------------

export const getCamsUrl = async (data) => {
  const response = await camsGet(
    `/CAMPSPay-enach/enach/registerEnach?emi=${parseFloat(data?.emi).toFixed(
      2
    )}&tenure=${data?.tenure}&emailId=${data?.emailId}&mobileNumber=${
      data?.mobileNumber
    }&applicantUniqueId=${data?.applicantUniqueId}&debitStartDate=${
      data?.debitStartDate
    }&accountHolderName=${
      data?.accountHolderName
    }&bankCode=${data?.ifsc?.substring(0, 4)}&ifsc=${data?.ifsc}&aadharNo=${
      data?.aadharNo
    }&accountNumber=${
      data?.accountNumber
    }&service=disbursed&authenticationMode=${data?.authenticationMode}`,
    false
  );

  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getCamsData = async (data) => {
  const response = await salesGet(
    `/triarc-sales/repayment/getApplicantDetailsForCampsPayEnach?applicantUniqueId=${data?.id}`
  );

  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
