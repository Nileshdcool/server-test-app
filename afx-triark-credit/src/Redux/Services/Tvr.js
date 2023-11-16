import { notification } from "antd";
import { post } from "../Utils/httpInterceptor";

// ------------------------Tvr Borrower------------------------
export const uploadTvrBorrowerReport = async (data) => {
  const zipFiles = require("jszip")();
  zipFiles.file(data.file.name, data.file);
  const content = await zipFiles.generateAsync({ type: "blob" });
  if (content) {
    const response = await post(
      `/triarc-credit/document/uploadTvrBorrower`,
      {
        file: content,
        tvrBorrowerInfo: data.tvrBorrowerInfo,
      },
      true
    );
    if (!response.data.error) {
      notification.success({ message: response.data.message });
      return response;
    } else {
      notification.error({ message: response.data.message });
      return response;
    }
  }
};

export const getTvrBorrowerReport = async (data) => {
    const response = await post(`/triarc-credit/document/getTvrBorrower`, data);
    if (!response.data.error) {
      notification.success({ message: response.data.message });
      return response.data.data;
    } else {
      return response.data;
    }
};

export const deleteTvrBorrowerReport = async (data) => {
    const response = await post(`/triarc-credit/document/deleteTvrBorrowerDocument`, data);
    if (!response.data.error) {
      notification.success({ message: response.data.message });
      return response.data.data;
    } else {
      notification.error({ message: response.data.message });
      return response.data;
    }
};


//-------------------------Tvr Reference---------------------------
export const uploadTvrReferenceReport = async (data) => {
    const zipFiles = require("jszip")();
    zipFiles.file(data.file.name, data.file);
    const content = await zipFiles.generateAsync({ type: "blob" });
    if (content) {
      const response = await post(
        `/triarc-credit/document/uploadTvrReference`,
        {
          file: content,
          tvrReferenceInfo: data.tvrReferenceInfo,
        },
        true
      );
      if (!response.data.error) {
        notification.success({ message: response.data.message });
        return response;
      } else {
        notification.error({ message: response.data.message });
        return response;
      }
    }
};

export const getTvrReferenceReport = async (data) => {
    const response = await post(`/triarc-credit/document/getTvrReference`, data);
    if (!response.data.error) {
      notification.success({ message: response.data.message });
      return response.data.data;
    } else {
      // notification.error({ message: response.data.message });
      return response.data;
    }
};

export const deleteTvrReferenceReport = async (data) => {
    const response = await post(`/triarc-credit/document/deleteTvrReferenceDocument`, data);
    if (!response.data.error) {
      notification.success({ message: response.data.message });
      return response.data.data;
    } else {
      notification.error({ message: response.data.message });
      return response.data;
    }
};

