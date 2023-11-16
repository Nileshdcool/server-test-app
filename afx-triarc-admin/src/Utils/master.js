import { get, post, postImage } from "./httpInterceptor";
const zip = require("jszip")();

export const getFIUsers = (data) => {
  return post(`/triarc-admin/userToPincode/getFiActiveUsers`, data).then((res) => {
    return res;
  });
};

export const saveUpdateUserPincodeMapping = (data) => {
  return post(
    `/triarc-admin/userToPincode/saveOrUpdateFiUserPincodeMapping`,
    data
  ).then((res) => {
    return res;
  });
};

export const getUserPincodeMapping = (data) => {
  return post(`/triarc-admin/userToPincode/getFiUserPincodeMapping`, data).then(
    (res) => {
      return res;
    }
  );
};

export const getUserPincodeList = () => {
  return get(
    `/triarc-admin/userToPincode/getFiUserPincodeMappingList`
  ).then((res) => {
    return res;
  });
};

export const getState = () => {
  return get(`/triarc-admin/userToPincode/getStates`).then((res) => {
    return res;
  });
};

export const getDistrict = (data) => {
  return post(`/triarc-admin/userToPincode/getDistricts`, data).then((res) => {
    return res;
  });
};

export const saveUpdateStateDistrict = (data) => {
  return post(
    `/triarc-admin/userToPincode/getPincodesByStateAndDistrict`, data
  ).then((res) => {
    return res;
  });
};

export const deleteUser = (data) => {
  return post(`/triarc-admin/userToPincode/deleteUserPincodeMapping`, data).then(
    (res) => {
      return res;
    }
  );
}


//-------------------------Dealer Master--------------------------------
export const saveUpdateDealerMaster = (data) => {
  return post(`/triarc-admin/master/saveOrUpdateDealer`, data).then((res) => {
    return res;
  });
};

export const getDealerList = () => {
  return get(`/triarc-admin/master/getDelarMasterList`).then((res) => {
    return res;
  });
};

export const getDealerTypeMasterList = (data) => {
  return get(`/triarc-admin/master/getDealerTypeMasterList`).then((res) => {
    return res;
  });
};

export const getManufacturerMasterList = () => {
  return get(`/triarc-admin/master/getManufacturerMasterList`).then((res) => {
    return res;
  });
};

export const getAccountTypeMasterList = () => {
  return get(`/triarc-admin/master/getAccountTypeMasterList`).then((res) => {
    return res;
  });
};

export const getDealerSpecificData = (data) => {
  return post(`/triarc-admin/master/getDealerDataById`, data).then(
    (res) => {
      return res;
    }
  );
};

//------------------------Vehicle Master---------------------------------
export const saveUpdateVehicleMaster = (data) => {
  return post(`/triarc-admin/master/saveOrUpdateVehicle`, data).then((res) => {
    return res;
  });
};

export const getVehicleList = () => {
  return get(`/triarc-admin/master/getVehicleMasterList`).then((res) => {
    return res;
  });
};

export const getVehicleTypeMasterList = () => {
  return get(`/triarc-admin/master/getVehicleTypeMasterList`).then((res) => {
    return res;
  });
};

export const getVehicleSpecificData = (data) => {
  return post(`/triarc-admin/master/getVehicleDataById`, data).then((res) => {
    return res;
  });
};

//------------------------------Scheme Master-----------------------------
export const saveUpdateSchemeMaster = (data) => {
  return post(`/triarc-admin/master/saveOrUpdateScheme`, data).then((res) => {
    return res;
  });
};

export const getSchemeList = () => {
  return get(`/triarc-admin/master/getSchemeMasterList`).then((res) => {
    return res;
  });
};

export const getSchemeSpecificData = (data) => {
  return post(`/triarc-admin/master/getSchemerDataById`, data).then((res) => {
    return res;
  });
};

export const getTenureMaster = (data) => {
  return get(`/triarc-admin/master/getTenureList`, data).then((res) => {
    return res;
  });
};

export const getDealerNameMaster = (data) => {
  return post(`/triarc-admin/master/getDealerList`, data).then((res) => {
    return res;
  });
};

//----------------------------Faq Master-----------------------------

export const saveUpdateFaqMaster = (data) => {
  return post("/triarc-admin/master/saveOrUpdateFaq", data).then((res) => {
    return res;
  });
};

export const getFaqList = () => {
  return get(`/triarc-admin/master/getFaqList`).then((res) => {
    return res;
  });
};

export const getFaqSpecificData = (data) => {
  return post(`/triarc-admin/master/getFaqDetails`, data).then((res) => {
    return res;
  });
};


//-----------------------------Caraousel Master----------------------
export const saveUpdateCaraouselMaster = async (data = {}, bikeImgDetails) => {
  console.log("data--->", data)
  // -------- zip.file(file-name, file)---------------------
  for (let file = 0; file < bikeImgDetails.length; file++) {
    // Zip file with the file name.
    zip.file(bikeImgDetails[file].name, bikeImgDetails[file]);
  }
  const content = await zip.generateAsync({ type: "blob" });
  return postImage(
    "/triarc-admin/master/uploadCarouselImages",
    {
      carouselImageInfo: data.carouselImageInfo,
      file: await content,
    },
    false,
    true
  ).then((res) => {
    return res;
  });
};

export const deleteCaraouselImages = (data) => {
  return post("/triarc-admin/master/deleteCarousalImages", data).then((res) => {
    return res;
  });
};

export const getCaraouselSpecificData = (data) => {
  return post(`/triarc-admin/master/getCarousalImageBySection`, data).then(
    (res) => {
      return res;
    }
  );
};