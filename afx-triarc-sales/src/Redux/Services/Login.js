import axios from 'axios';
import { BASE_URL } from '../../Utility/Config';
import { te } from '../../Utility/ReduxToaster';
import { loading } from '../Action/App';
require('dotenv').config();

export const getLoginModule =
  (objBody = {}) =>
  async (dispatch) => {
    try {
      // const URL = `${BASE_URL}:${process.env.REACT_APP_CREDIT_MODULE_API}`;
      const URL = `${BASE_URL}`;

      const response = await axios.post(
        `${URL}/triarc-credit/authentication/authenticate`,
        objBody
      );

      if (response.data.error) {
        console.log(response.data.message);
        te(response.data.message);
      } else {
        const branchStr = await response.data.data.branchName
          ?.split(',')
          ?.join(',');

        const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
        const REDIRECT_URL = `${FrontendURL}/credit/token`;
        localStorage.setItem('ctoken', response.data.token);
        window.location.replace(
          `${REDIRECT_URL}?search=${response.data.token}&empId=${response.data.data.employeeId}&branch=${branchStr}&branchCode=${branchStr}&roleId=${response.data.data.roleId}`
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const disbursementModule =
  (objBody = {}) =>
  async (dispatch) => {
    try {
      //  const URL = `${BASE_URL}:${process.env.REACT_APP_DISBURSEMENT_MODULE_API}`;
      // const URL = `${BASE_URL}:${process.env.REACT_APP_DISBURSEMENT_MODULE_API}`;

      const URL = `${BASE_URL}`;
      const response = await axios.post(
        `${URL}/triarc-disbursement/authentication/authenticate`,
        objBody
      );

      if (response.data.error) {
        console.log(response.data.message);
        te(response.data.message);
      } else {
        const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
        const REDIRECT_URL = `${FrontendURL}/disbs/token`;
        localStorage.setItem('dtoken', response.data.token);
        window.location.replace(
          `${REDIRECT_URL}?search=${response.data.token}&empId=${response.data.data.employeeId}&branch=${response.data.data.branchName}&roleId=${response.data.data.roleId}`
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const getReportingModule =
  (objBody = {}) =>
  async (dispatch) => {
    console.log('in indiside service');
    console.log('in');
    try {
      // const URL = `${BASE_URL}:${process.env.REACT_APP_REPORTING_MODULE_PORT}`;
      // const URL = `https://rockett.club:9006`;
      const URL = `https://rockett.club`;

      const response = await axios.post(
        `${URL}/triarc-CWCReportApp/authentication/authenticate`,
        objBody
      );

      console.log('response---->', response);
      if (response.data.error) {
        console.log(response.data.message);
        te(response.data.message);
      } else {
        const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
        const REDIRECT_URL = `${FrontendURL}:${3005}/twin/token`;
        localStorage.setItem('rtoken', response.data.token);
        window.location.replace(
          `${REDIRECT_URL}?search=${response.data.token}&empId=${response.data.data.employeeId}&user=${response.data.data.employeeName}&roleId=${response.data.data.roleId}&salesFlag=${response.data.data.salesDashboardFlag}&creditFlag=${response.data.data.creditDashboardFlag}&disbsFlag=${response.data.data.disbursementDashboardFlag}&gupshupFlag=${response.data.data.gupshupDashboardFlag}`
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const getCallCenterPortal =
  (objBody = {}) =>
  async (dispatch) => {
    try {
      // const URL = `${BASE_URL}:${process.env.REACT_APP_REPORTING_MODULE_PORT}`;
      const URL = `https://rockett.club`;

      const response = await axios.post(
        `${URL}/callcenterportal/authentication/authenticate`,
        objBody
      );

      if (response?.data?.data) {
        if (response.data.error) {
          console.log(response.data.message);
          te(response.data.message);
        } else {
          const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
          const REDIRECT_URL = `${FrontendURL}:${3007}/callCenter/token`;
          localStorage.setItem('rtoken', response.data.token);
          window.location.replace(
            `${REDIRECT_URL}?search=${response.data?.data?.token}&empId=${response.data.data.employeeId}&user=${response.data.data.employeeName}&roleId=${response.data.data.roleId}&mobileNo=${response.data.data.mobileNo}&otp=${response.data.data.otp}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const getDealerPortal =
  (objBody = {}) =>
  async (dispatch) => {
    console.log('in indiside service');
    console.log('in');
    try {
      // const URL = `${BASE_URL}:${process.env.REACT_APP_REPORTING_MODULE_PORT}`;
      const URL = `https://rockett.club`;

      const response = await axios.post(
        `${URL}/dealerportal/authentication/authenticate`,
        objBody
      );

      console.log('response---->', response);

      if (response?.data?.data) {
        if (response.data.error) {
          console.log(response.data.message);
          te(response.data.message);
        } else {
          const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
          const REDIRECT_URL = `${FrontendURL}:${3006}/dealerPortal/token`;
          localStorage.setItem('rtoken', response.data.token);
          window.location.replace(
            `${REDIRECT_URL}?search=${response.data?.data?.token}&empId=${response.data.data.employeeId}&user=${response.data.data.employeeName}&roleId=${response.data.data.roleId}&mobileNo=${response.data.data.mobileNo}&otp=${response.data.data.otp}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const getAccountsPortal =
  (objBody = {}) =>
  async (dispatch) => {
    console.log('in indiside service');
    console.log('in');
    try {
      // const URL = `${BASE_URL}:${process.env.REACT_APP_REPORTING_MODULE_PORT}`;
      const URL = `https://rockett.club`;

      const response = await axios.post(
        `${URL}/account/authentication/authenticate`,
        objBody
      );

      console.log('response---->', response);

      if (response?.data?.data) {
        if (response.data.error) {
          console.log(response.data.message);
          te(response.data.message);
        } else {
          const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
          const REDIRECT_URL = `${FrontendURL}:${3008}/accounts/token`;
          localStorage.setItem('rtoken', response.data?.token);
          window.location.replace(
            `${REDIRECT_URL}?search=${response.data?.token}&empId=${response.data.data.employeeId}&user=${response.data.data.employeeName}&roleId=${response.data.data.roleId}&mobileNo=${response.data.data.mobileNo}&otp=${response.data.data.otp}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const getRcuModule =
  (objBody = {}) =>
  async (dispatch) => {
    console.log('in indiside service');
    console.log('in');

    // const headers = {
    //   "Access-Control-Allow-Origin": "*",
    // };
    try {
      // const URL = `${BASE_URL}:${process.env.REACT_APP_REPORTING_MODULE_PORT}`;
      const URL = `https://rockett.club`;

      const response = await axios.post(
        `${URL}/rcu-module/authentication/authenticate`,
        objBody
      );

      console.log('response---->', response);

      if (response?.data?.data) {
        if (response.data.error) {
          console.log(response.data.message);
          te(response.data.message);
        } else {
          const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
          const REDIRECT_URL = `${FrontendURL}:${3009}/rcu/token`;
          localStorage.setItem('rtoken', response.data.token);
          window.location.replace(
            `${REDIRECT_URL}?search=${response.data?.token}&empId=${response.data.data.employeeId}&branch=${response.data.data.branchName}&user=${response.data.data.employeeName}&roleId=${response.data.data.roleId}&mobileNo=${response.data.data.mobileNo}&otp=${response.data.data.otp}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const getDeviationModule =
  (objBody = {}) =>
  async (dispatch) => {
    console.log('in indiside service');
    console.log('in');

    // const headers = {
    //   "Access-Control-Allow-Origin": "*",
    // };
    try {
      // const URL = `${BASE_URL}:${process.env.REACT_APP_REPORTING_MODULE_PORT}`;
      const URL = `https://rockett.club`;

      const response = await axios.post(
        `${URL}/afx-deviation/authentication/authenticate`,
        objBody
      );

      console.log('response---->', response);

      if (response?.data?.data) {
        if (response.data.error) {
          console.log(response.data.message);
          te(response.data.message);
        } else {
          const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
          const REDIRECT_URL = `${FrontendURL}:${3010}/cwcDeviation/token`;
          localStorage.setItem('rtoken', response.data.token);
          window.location.replace(
            `${REDIRECT_URL}?search=${response.data?.token}&empId=${response.data.data.employeeId}&branch=${response.data.data.branchName}&user=${response.data.data.employeeName}&roleId=${response.data.data.roleId}&mobileNo=${response.data.data.mobileNo}&otp=${response.data.data.otp}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };

export const getPartnerPortal =
  (objBody = {}) =>
  async (dispatch) => {
    try {
      const URL = `https://rockett.club`;

      const response = await axios.post(
        `${URL}/triarc-vams-api/authentication/partnerauthenticate`,
        objBody
      );

      // console.log("response---->", response?.data?.data);
      if (response?.data) {
        // console.log("response---->", response.data.error);
        if (response.data.error) {
          console.log(response.data.message);
          te(response.data.message);
        } else {
          const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
          const REDIRECT_URL = `${FrontendURL}:${5004}/partnerPortal/token`;
          localStorage.setItem('ptoken', response.data?.token);
          window.location.replace(
            `${REDIRECT_URL}?search=${response.data?.token}&empId=${response.data.data.employeeId}&user=${response.data.data.employeeName}&roleId=${response.data.data.roleId}&mobileNo=${response.data.data.mobileNo}&otp=${response.data.data.otp}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loading(false));
    }
  };
