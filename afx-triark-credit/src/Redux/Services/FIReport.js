import { notification } from "antd";
import { get, post } from "../Utils/httpInterceptor";

// Upload FI Report
export const uploadFIReport = async (data) => {
  const zipFiles = require("jszip")();

  zipFiles.file(data.file.name, data.file);
  const content = await zipFiles.generateAsync({ type: "blob" });
  //   content.name = `${new Date().getTime()}.zip`;
  if (content) {
    const response = await post(
      `/triarc-credit/document/uploadFiReport`,
      {
        file: content,
        fiReportInfo: data.fiReportInfo,
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

export const uploadApprovalMailFile = async (data) => {
  const zipFiles = require("jszip")();

  zipFiles.file(data.file.name, data.file);
  const content = await zipFiles.generateAsync({ type: "blob" });
  //   content.name = `${new Date().getTime()}.zip`;
  if (content) {
    const response = await post(
      `/triarc-credit/credit/uploadApprovalMailFile`,
      {
        file: data.file,
        applicantId: data.applicantId,
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

//Getfi
export const getFIReportDetails = async (data) => {
  const response = await post(`/triarc-credit/document/getFiReport`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    // notification.error({ message: response.data.message });
    return response.data;
  }
};

export const getApprovalMailFile = async (data) => {
  const response = await get(
    `/triarc-credit/credit/getApprovalMailFile?applicantId=${data?.applicantId}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    // notification.error({ message: response.data.message });
    return response.data;
  }
};

//delete fi
export const deleteFIReportDetails = async (data) => {
  const response = await post(`/triarc-credit/document/deleteFiDocument`, data);
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};

export const deleteApprovalMailFile = async (data) => {
  const response = await post(
    `/triarc-credit/credit/deleteApprovalMailFile?applicantId=${data?.applicantId}`,
    {}
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};

// uploadMaualBureauFile
export const uploadMaualBureauFile = async (data) => {
  const zipFiles = require("jszip")();

  zipFiles.file(data.file.name, data.file);
  const content = await zipFiles.generateAsync({ type: "blob" });
  content.name = `${new Date().getTime()}.zip`;

  if (content) {
    const response = await post(
      `/triarc-credit/credit/uploadManualCriifReport`,
      {
        file: content,
        applicantUniqueId: data.applicantId,
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

export const getMaualBureauFile = async (data) => {
  const response = await get(
    `/triarc-credit/credit/getManualCriffReport?applicantUniqueId=${data?.applicantId}`
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    // notification.error({ message: response.data.message });
    return response.data;
  }
};

export const deleteMaualBureauFile = async (data) => {
  const response = await get(
    `/triarc-credit/credit/deleteManualCriffReport?applicantUniqueId=${data?.applicantId}`,
    {}
  );
  if (!response.data.error) {
    notification.success({ message: response.data.message });
    return response.data.data;
  } else {
    notification.error({ message: response.data.message });
    return response.data;
  }
};
