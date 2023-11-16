import { notification } from 'antd';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';
import {
  get,
  post,
  postSales,
  getSales,
  postckyc,
  postLoanDet,
  getDownloadZipFiles,
  tvrReferencePost,
  BASE,
} from '../Utils/httpInterceptor';
import TvrBorrower from '../../Pages/CaseSummary/TvrBorrower';

//Get Case History
export const getCaseHistory = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getCaseHistory`,
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

// get Dl data and other documnents data
export const getDLAndOtherDocuments = async (data) => {
  const response = await postSales(
    `/triarc-sales/addetails/getOtherDocumentDetailsByApplicantUniqid`,
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

//Get Case History
export const getLeadDetails = async (data) => {
  const response = await get(
    `/triarc-credit/casesummary/getLeadDetails?applicantUniqueId=${data.applicantUniqueId}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
//Get Deviation
export const getDeviation = async (data) => {
  const response = await post(`/triarc-admin/common/getBranchlist`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get Case Report
export const getCaseReport = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getCaseReports`,
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

//Get Case Summary
export const getCaseSummaryDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getcasesummarydetails`,
    data
  );
  if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getQdeDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdeAdditionalDetails`,
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

export const saveLoanDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/saveLoanDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

//call loanDetail
export const loanDetails = async (objBody = {}, type) => {
  try {
    const response = await postSales(
      `/triarc-sales/qde/${type}`,
      objBody,
      false
    ).then((res) => {
      return res.data;
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const dealerList = async (objBody = {}) => {
  try {
    const response = await postSales(
      `/triarc-sales/master/getDealerList`,
      objBody,
      false
    ).then((res) => {
      return res.data;
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const getSchemeCode = async (objBody = {}) => {
  try {
    const response = await postSales(
      '/triarc-sales/master/getSchemeCode',
      objBody,
      false
    ).then((res) => {
      return res.data;
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const schemeDetails = async (objBody = {}) => {
  try {
    const response = await postSales(
      '/triarc-sales/master/getSchemeDetailsBySchemeCode',
      objBody,
      false
    ).then((res) => {
      return res.data;
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const saveLoanDetailEditablity = async (objBody = {}) => {
  try {
    const response = await postSales(
      '/triarc-sales/qde/saveorupdateqdeloandetails',
      objBody,
      false
    ).then((res) => {
      return res.data;
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

//Get decisioning reasons
export const getCaseDecisioningReason = async (data) => {
  const response = await get(
    `/triarc-credit/casesummary/getCaseDecisioningReason`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//saveVerify Status
export const saveVerifyStatus = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/saveVerifyStatus`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//Get DDE Details
export const getDdeDetails = async (data) => {
  const response = await post(`/triarc-credit/casesummary/getDdeDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//save decisioning
export const saveDecisioning = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/saveDecisioningDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//get decisioning
export const getCaseDecisioning = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getDecisioningDetails`,
    data
  );
  if (!response.data.error) {
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return {};
  }
};

//get decisioning

export const getLeadsDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getLeadsDetails`,
    data
  );
  if (!response.data.error) {
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return {};
  }
};

//get RCU
export const getRCU = async (data) => {
  const response = await post(`/triarc-credit/casesummary/getRcuDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//save RCU
export const saveRCU = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/saveRcuComment`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// getTvrDetails
export const getTvrDetails = async (data) => {
  const response = await post(`/triarc-credit/casesummary/getTvrDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//saveVerify Status
export const saveTvrDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/saveTvrDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// New API for TvrBorrower
export const getTvrBorrowerDetails = async (data) => {
  const response = await post(
    `/triarc-credit/tvrOzonCall/getTvrBorrowerDetails`,
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

export const saveTvrBorrowerDetails = async (data) => {
  const monthlyIncome = parseFloat(data?.monthlyIncome);
  const rent = parseFloat(data?.rent);
  const householdExpenses = parseFloat(data?.householdExpenses);
  const obligations = parseFloat(data?.obligations);
  const emi = parseFloat(data?.emi);

  const emiToDi = isNaN(emi)
    ? '0'
    : (
        emi /
        (monthlyIncome - (rent + householdExpenses + obligations))
      ).toFixed(2);

  const response = await post(`/triarc-credit/tvrOzonCall/saveTvrBorrower`, {
    ...data,
    emiToDi,
  });

  const message = response.data.message;
  if (!response.data.error) {
    notification.success({ message });
  } else {
    notification.error({ message });
  }

  return response;
};

export const getTvrBorrowerReference1 = async (data) => {
  const response = await post(`/triarc-credit/document/getTvrReference`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getTvrBorrowerReference2 = async (data) => {
  const response = await post(`/triarc-credit/document/getTvrReference`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const downloadCreditMemo = async (id) => {
  const response = await get(
    `/triarc-credit/document/generateCreditMemoPdf/${id}`
  );

  if (response.status === 200) {
    return response.data?.data?.camFilePath;
  } else {
    console.error(`Failed to download document at index `);
  }
};

export const getDownloadAllDoc = async (id) => {
  const response = await getDownloadZipFiles(
    `/triarc-credit/document/downloadDocuments/${id}`
  );

  if (response.status === 200) {
    const blobData = new Blob([response.data]);

    // Create a Blob URL
    const blobURL = window.URL.createObjectURL(blobData);

    // Create a link element to trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;

    // Specify the filename for the saved file
    downloadLink.download = `${id}.zip`;

    // Trigger a click event to start the download
    downloadLink.click();

    // Clean up: Revoke the Blob URL to free up resources
    window.URL.revokeObjectURL(blobURL);
  } else {
    console.error(`Failed to download document at index `);
  }
};

export const saveTvrBorrowerReference1 = async (data) => {
  const formData = new FormData();

  formData.append(
    'tvrReferenceInfo',
    JSON.stringify({
      applicantUniqueId: data?.applicantUniqueId,
      fileName: data?.fileName,
      status: 'Positive',
      remark: 'success',
      type: 'Reference1',
      knownSince: data?.knownSince,
      applicantAddressVerifictaion:
        data?.applicantAddressVerifictaion == 'Yes' ? true : false,
      relation: data?.relation,
    })
  );

  console.log('Entered into saveTvrBorrowerReference1 API call');

  const response = await tvrReferencePost(
    '/triarc-credit/document/uploadTvrReference',
    formData
  );

  console.log('saveTvrBorrowerReference1 API response', response);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveTvrBorrowerReference2 = async (data) => {
  const formData = new FormData();

  formData.append(
    'tvrReferenceInfo',
    JSON.stringify({
      applicantUniqueId: data?.applicantUniqueId,
      fileName: data?.fileName,
      status: data?.status,
      remark: data?.remark,
      type: 'Reference2',
      knownSince: data?.knownSince,
      applicantAddressVerifictaion:
        data?.applicantAddressVerifictaion == 'Yes' ? true : false,
      relation: data?.relation,
    })
  );

  console.log('Entered into saveTvrBorrowerReference2 API call');

  const response = await tvrReferencePost(
    '/triarc-credit/document/uploadTvrReference',
    formData
  );

  console.log('saveTvrBorrowerReference2 API response', response);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const negativePincode = async (data) => {
  const response = await post(`/triarc-credit/casesummary/getPincode`, data);
  http: if (!response.data.error) {
    // notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// loan details
export const getLoanDetails = async (data) => {
  console.log('inside');
  const response = await post(
    `/triarc-credit/casesummary/getQdeLoanDetailsByApplicantuniqId`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// loan details
export const getLoanDet = async (data) => {
  const response = await postLoanDet(`/triarc-sales/qde/getLoanDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveLoanDet = async (data) => {
  const response = await postLoanDet(`/triarc-sales/qde/saveLoanDetails`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// refernce details
export const getReferenceDetailsFamily = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdeFamilyReferenceDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const referenceDetailsFamilySave = async (data) => {
  const response = await postSales(
    '/triarc-sales/qde/saveorupdatefamilyref',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const referenceDetailsNonFamilySave = async (data) => {
  const response = await postSales(
    '/triarc-sales/qde/saveorupdatenonfamilyref',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// refernce non-family details
export const getReferenceDetailsNonFamily = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdeNonFamilyReferenceDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// utility details
export const getUltilityDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdeUtilityBillDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// business details
export const getBusinessDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdeBusinessDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// personal details
export const getPersonalDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdePersonalDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// personal details
export const getAdditionalDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdeAdditionalDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// PanGst details
export const getPanGstDetails = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdePanGstDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// IndSelfSole details
export const getIndSoleFlag = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getQdeIndSelfSoleFlagProductId`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// create cust

// /triarc-sales/customer/createOrUpdateCustomer
export const createCustomer = async (data) => {
  const response = await postSales(
    `/triarc-sales/customer/createOrUpdateCustomer`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const queryReason = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getCaseDecisioningSubqueryReason`,
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

// sales addtn details
// addtn details
export const saveAddtnDetails = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/saveAltContactDetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// addtn details - permnent details

export const saveOrUpdatePermanentAdd = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/saveOrUpdatePermanentAdd',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

//  current add
export const savePermanentDetails = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/saveAddressDetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// addtn details - ofc address
export const saveOfficeDetails = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/saveAddressDetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// ---------current add

export const getresidensetype = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getresidensetype`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response?.data;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
// addtn details - empp details dropdown
export const getDesignationDetails = async (data) => {
  const response = await getSales(
    `/triarc-sales/qde/gettypeofdesignation`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getEmploymentIndustry = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getEmploymentIndustry`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// *---------------------------------------------------

export const getProfessionList = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getProfessionList`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getSubCategoryList = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getSubCategoryList?profession=${data?.profession}`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getDesignations = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getDesignations?subCategory=${data?.subCategory}&profession=${data?.profession}`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getCompanyName = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getTopCompaniesList?companyName=${data?.name}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// addtn details - empp details save

export const saveEmployeeDetails = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/saveEmploymentDetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// business details - dropdown
export const getBankAccountType = async (data) => {
  const response = await getSales(
    '/triarc-sales/master/getBankAccountType',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
export const getSegmentList = async (data) => {
  const response = await getSales('/triarc-sales/qde/getsegmentlist', data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getSectorMaster = async (data) => {
  const response = await getSales('/triarc-sales/qde/getsectormaster', data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getIndustryList = async (data) => {
  const response = await getSales('/triarc-sales/qde/getindustrylist', data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getSubIndustryList = async (data) => {
  const response = await getSales(
    `/triarc-sales/qde/getsubindustrylist?sectorcode=${data?.sector}`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getIfscDetails = async (data) => {
  const response = await postSales(
    `/triarc-sales/qde/getBankDetailsFromIfsc`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getPennyDetails = async (data) => {
  const response = await postSales(
    '/triarc-sales/qde/verifyBankAccoutNumber',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

export const saveBusinessDetails = async (data) => {
  const response = await postSales(
    '/triarc-sales/qde/saveorupdatebusinessinformationdetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

//*-----------personal details -----------/
export const uploadSelfie = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/qde/uploadSelfie',
    { file: content, personalInfo: objBody.personalInfo },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

//*-----------bsuiness details -----------/
export const uploadSelfieBS = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/qde/uploadBusinessSelfie',
    { file: content, businessInfo: objBody.businessInfo },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

export const getQualificationDetails = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getQualification`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveUpdatePersonalDetails = async (data) => {
  const response = await postSales(
    `/triarc-sales/qde/saveOrUpdatePersonalDetails`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const deleteSelfie = async (data) => {
  const response = await postSales(`/triarc-sales/qde/deleteSelfie`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const deleteSelfieBS = async (data) => {
  const response = await postSales(
    '/triarc-sales/qde/deleteBusinessSelfie',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// --------------panGST---------------------------

export const uploadDocument = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/wrapper/panDetails',
    { file: content, ...objBody.data },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

// ----------------------utilility upload----------------

export const uploadUtility = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/utility/uploadUtilityDoc',
    { file: content, ...objBody.data },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

// ----------------------utilility curent add----------------

export const uploadCurrent = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/cuurentAddress/uploadDocument',
    { file: content, ...objBody.data },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};
// -

//----------------------utilility curent add----------------

export const uploadPermanent = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/addetails/uploadPermanentAddDoc',
    { file: content, ...objBody.data },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};
// ----------------------------------------------------

export const savePanGst = async (data) => {
  const response = await postSales(`/triarc-sales/pangst/savePanGst`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const wrapperAPI = async (data) => {
  const response = await postSales(`/triarc-sales/wrapper/wrapperAPI`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
export const deletePanGst = async (data) => {
  const response = await postSales(`/triarc-sales/pangst/deletePanGst`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// utility- delete-------------------------------------->

export const deleteUtilityBill = async (data) => {
  const response = await postSales(
    `/triarc-sales/utility/deleteUtilityBill`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// current address - delete-------------------------------------->

export const deleteCurrent = async (data) => {
  const response = await postSales(
    `/triarc-sales/cuurentAddress/deleteDocument`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// perm address - delete-------------------------------------->

export const deletePermanent = async (data) => {
  const response = await postSales(
    `/triarc-sales/addetails/deletePermanentAddDoc`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// common apis - utility add ----------------------------->

export const getcitylist = async (data) => {
  const response = await getSales(`/triarc-sales/master/getcitylist`);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getelectricompanycodelist = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getelectricompanycodelist`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
export const getutilitybilltype = async (data) => {
  const response = await getSales(`/triarc-sales/master/getutilitybilltype`);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveOrUpdateDocument = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/saveOrUpdateDocument',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveOrUpdateUtilityBill = async (data) => {
  const response = await postSales(
    '/triarc-sales/utility/saveOrUpdateUtilityBill',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getUtilityBillDetails = async (objBody) => {
  let url;
  const CORS_URL = '';
  if (objBody.type === 'elBill') {
    url =
      CORS_URL +
      'https://uc9q5045lj.execute-api.us-east-2.amazonaws.com/Prod/electricity-bill-authentication';
  } else if (objBody.type === 'gBill') {
    url =
      CORS_URL +
      'https://uc9q5045lj.execute-api.us-east-2.amazonaws.com/Prod/lpg-id-authentication';
  } else if (objBody.type === 'lBill') {
    url =
      CORS_URL +
      'https://uc9q5045lj.execute-api.us-east-2.amazonaws.com/Prod/telephone-landline-authentication';
  }
  const response = await postSales(url, objBody, false, true);

  if (response?.data) {
    notification.success({ message: response?.message });
    return response;
  } else {
    notification.error({ message: response?.message });
  }
  return response;
};

// ---------------KYC Section---------------------/

export const uploadPOIDocs = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  objBody.front && zipFiles.file(objBody.front.file.name, objBody.front.file);
  objBody.back && zipFiles.file(objBody.back.file.name, objBody.back.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/addetails/kycDocDetails',
    { file: content, ...objBody.data },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

export const getkycdocumentlist = async (data) => {
  const response = await getSales(
    `/triarc-sales/master/getkycdocumentlist`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const deleteDocument = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/deleteDocument',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const savePOI = async (data, editSection = 'adhaar') => {
  const response = await postSales(
    editSection === 'adhaar'
      ? '/triarc-sales/addetails/saveOrUpdateDocument'
      : '/triarc-sales/addetails/saveOrUpdateCustomerDocument',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const verifyVoter = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/voterVerifyDetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};
export const verifyDl = async (data) => {
  const response = await postSales(
    '/triarc-sales/addetails/dlVerifyDetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

// -----------personal details----------------

export const uploadDocumentPD = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/qde/uploadSelfie',
    { file: content, ...objBody.data },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

// -----------business details----------------

export const uploadDocumentBD = async (objBody = {}) => {
  const zipFiles = require('jszip')();
  zipFiles.file(objBody.file.name, objBody.file);
  const content = await zipFiles.generateAsync({ type: 'blob' });
  content.name = `${new Date().getTime()}.zip`;

  const response = await postSales(
    '/triarc-sales/qde/uploadBusinessSelfie',
    { file: content, ...objBody.data },
    true
    // true
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return response;
  }
};

export const getKarzaOutput = async (data) => {
  const response = await post(
    '/triarc-credit/karzaMatch/getKarzaDetails',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const createOrUpdateCustomer = async (data) => {
  const response = await postSales(
    '/triarc-sales/customer/createOrUpdateCustomer',
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const getTvrVerification = async (data) => {
  const response = await post(
    `/triarc-credit/tvrOzonCall/getTvrVerification`,
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

export const ckycListing = async (data) => {
  const response = await postckyc('/afx-cky/ckyc/ckycListing', data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const callingResponseSave = async (data) => {
  const response = await post(
    `/triarc-credit/tvrOzonCall/callingResponseSave`,
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

//-------------------Credit Information--------------------------------
export const getCreditInformation = async (data) => {
  const response = await post(
    `/triarc-credit/casesummary/getCreditInformation`,
    data
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveCreditInformation = async (data) => {
  const response = await post(
    `/triarc-credit/master/saveCreditInformation`,
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

//-------------------Final Assessment--------------------------------
export const getFinalAssessment = async (data) => {
  const response = await get(`/triarc-sales/master/getFinalAssessment`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response;
  } else {
    notification.error({ message: response.data.message });
    return [];
  }
};

export const saveFinalAssessment = async (data) => {
  const response = await post(
    `/triarc-credit/master/saveFinalAssessment`,
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
