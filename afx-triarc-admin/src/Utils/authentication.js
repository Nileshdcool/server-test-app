import { get, post, postAuth } from "./httpInterceptor";

// Update Password
export const updatePassword = (data) => {
  return post(`/triarc-admin/authentication/updatePassword`, data).then((res) => {
    return res;
  });
};

//Login Api
export const loginUser = (data) => {
  return post(`/triarc-admin/authentication/authenticate`, data).then((res) => {
    return res;
  });
};

// Reset Password
export const resetPassword = (data) => {
  return postAuth(`/triarc-admin/authentication/resetPassword`, data).then(
    (res) => {
      return res;
    }
  );
};

// Forgot password
export const forgotPassword = (data) => {
  return postAuth(
    `/triarc-admin/authentication/forgotPassword?userName=${data.userName}&newPassword=${data.password}&otp=${data.otp}`
  ).then((res) => {
    return res;
  });
};

// send Otp
export const sendOTP = (data) => {
  return postAuth(
    `/triarc-admin/authentication/sendOtpForForgetPassword?userName=${data.userName}`
  ).then((res) => {
    return res;
  });
};

// LOGOUT
export const logout = () => {
  return post(`/triarc-admin/authentication/logout`).then((res) => {
    return res;
  });
};
