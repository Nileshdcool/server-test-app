import { notification } from "antd";
import { get, post } from "../Utils/httpInterceptor";

// Upload FI Report
export const uploadFIReport = async (data) => {
  const zipFiles = require("jszip")();
  
  zipFiles.file(data.file.name, data.file);
  const content = await zipFiles.generateAsync({ type: "blob" });
  //   content.name = `${new Date().getTime()}.zip`;
  if (content) {
    const response = await get(
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
