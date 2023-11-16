import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import CloseCaraouselModel from "./CloseCaraouselModel";
import Select from "react-select";
import {
  saveUpdateCaraouselMaster,
  getManufacturerMasterList,
  getVehicleTypeMasterList,
  getCaraouselSpecificData,
  deleteCaraouselImages,
} from "../../Utils/master";
import { BranchList } from "../../Utils/dsa";
import ImageUploader from "react-images-upload";
import { BASE_URL } from "../../Utils/httpInterceptor";
toast.configure();

class AddCaraouselModel extends Component {
  state = {
    subModel: null,
    location: null,
    vehicleType: null,
    vehicleBrand: null,
    model: null,
    manufacturer: null,
    cc: null,
    onRoadPrice: null,
    maxAmount: null,
    vehicleTypeId: null,
    vehicleMakeId: null,
    vehicleClassVariantId: null,
    vehicleClassId: null,
    branchListData: [],
    getManufacturer: [],
    vehicleTypeData: [],
    branch: null,
    dealerId: null,
    bikeImage1: null,
    bikeImageData: [],
    bikesArr: [],
    bikeError: true,
    isDisplayBikeImage1: false,
    isDisplayBikeImage2: false,
    isDisplayBikeImage3: false,
    isDisplayBikeImage4: false,
    isDisplayBikeImage5: false,
    isDisplayBikeImage6: false,
    hell: null,
    bikeImg1: null,
    bikeImg2: null,
    bikeImg3: null,
    bikeImg4: null,
    bikeImg5: null,
    bikeImg6: null,
    bikeImgDetails: [],
    deletedBikeImages: [],
    bikePreview1: true,
    bikePreview2: true,
    bikePreview3: true,
    bikePreview4: true,
    bikePreview5: true,
    bikePreview6: true,
    bikeImageDataId: [],
    dealerPoType: null,
    errors: {
      subModel: null,
      model: null,
      cc: null,
      onRoadPrice: null,
      maxAmount: null,
      vehicleTypeId: null,
      vehicleMakeId: null,
      vehicleClassVariantId: null,
      manufacturer: null,
      vehicleType: null,
      branch: null,
      vehicleClassId: null,
    },
  };

  componentDidMount() {
    this.handleShow();
    this.getAllBranchList();
    this.getManufacturerList();
    this.getVehicleTypeList();
    this.getVehicleSpecificDataFunction();
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.state.bikeImageData !== prevState.bikeImageData) {
      if (this.state.bikeImageData.length >= 2) {
        this.setState({ bikeError: false });
      } else {
        this.setState({ bikeError: true });
      }
    }
  }

  //----------------------------------modal----------------------------------
  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = (modclose) => {
    if (!modclose) this.modclose();
    this.setState({ show: false });
    this.props.addUser();
  };

  modclose = (modclose) => {
    this.setState({ showInner: !this.state.showInner });
  };

  close = (close) => {
    this.setState({ showInner: !this.state.showInner });
  };
  //---------------------------------modal------------------------------------

  //--------------------------getDataFunction----------------------
  getAllBranchList = () => {
    BranchList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          branchListData:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  getManufacturerList = () => {
    getManufacturerMasterList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          getManufacturer:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  getVehicleTypeList = () => {
    getVehicleTypeMasterList().then((response) => {
      if (response.data && response.data.error == false) {
        this.setState({
          vehicleTypeData:
            response.data && response.data.data ? response.data.data : [],
        });
      }
    });
  };

  getVehicleSpecificDataFunction = () => {
    this.setState({ isloading: true });
    let obj = {
      section: this.props.verifyObj,
    };
    getCaraouselSpecificData(obj).then((response) => {
      console.log("response---->", response);
      this.setState({ isloading: false });
      this.setState({
        dealerId:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.id,
      });
      const image1 =
        response &&
        response.data &&
        response.data.data &&
        response.data.data.filter((item) => {
          if (item.documentType === "image1") {
            return item;
          }
        });
      const image2 =
        response &&
        response.data &&
        response.data.data &&
        response.data.data.filter((item) => {
          if (item.documentType === "image2") {
            return item;
          }
        });
      const image3 =
        response &&
        response.data &&
        response.data.data &&
        response.data.data.filter((item) => {
          if (item.documentType === "image3") {
            return item;
          }
        });
      const image4 =
        response &&
        response.data &&
        response.data.data &&
        response.data.data.filter((item) => {
          if (item.documentType === "image4") {
            return item;
          }
        });
      const image5 =
        response &&
        response.data &&
        response.data.data &&
        response.data.data.filter((item) => {
          if (item.documentType === "image5") {
            return item;
          }
        });
      const image6 =
        response &&
        response.data &&
        response.data.data &&
        response.data.data.filter((item) => {
          if (item.documentType === "image6") {
            return item;
          }
        });
      this.setState({
        dealerPoType:
          response &&
          response.data &&
          response.data.data &&
          response.data.data.dealerPoType,
        bikeImg1:
          image1.length != 0
            ? image1
            : [{ isdisplay: false, remove: "true", docType: "image1" }],
        bikeImg2:
          image2.length != 0
            ? image2
            : [{ isdisplay: false, remove: "true", docType: "image2" }],
        bikeImg3:
          image3.length != 0
            ? image3
            : [{ isdisplay: false, remove: "true", docType: "image3" }],
        bikeImg4:
          image4.length != 0
            ? image4
            : [{ isdisplay: false, remove: "true", docType: "image4" }],
        bikeImg5:
          image5.length != 0
            ? image5
            : [{ isdisplay: false, remove: "true", docType: "image5" }],
        bikeImg6:
          image6.length != 0
            ? image6
            : [{ isdisplay: false, remove: "true", docType: "image6" }],
      });
      if (response && response.data && response.data.data) {
        const combined = [
          ...this.state.bikeImg1,
          ...this.state.bikeImg2,
          ...this.state.bikeImg3,
          ...this.state.bikeImg4,
          ...this.state.bikeImg5,
          ...this.state.bikeImg6,
        ];
        this.setState({ bikeImageData: combined });
      }
    });
  };
  //--------------------------getDataFunction----------------------

  //----------------------------------------all handleOnChanges------------------------------
  handleName = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name]: true } });
    } else {
      this.setState({ errors: { ...errors, [name]: false } });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleBranch = (branch) => {
    let { errors } = this.state;
    if (branch === "" || branch === null || branch === undefined) {
      this.setState({ errors: { ...errors, branch: true } });
    } else {
      this.setState({ errors: { ...errors, branch: false } });
    }
    this.setState({ branch });
  };

  handleManufacturer = (manufacturer) => {
    const { errors } = this.state;
    if (
      manufacturer === "" ||
      manufacturer === null ||
      manufacturer === undefined
    ) {
      this.setState({ errors: { ...errors, manufacturer: true } });
    } else {
      this.setState({ errors: { ...errors, manufacturer: false } });
    }
    this.setState({ manufacturer });
  };

  handleVehicleType = (vehicleType) => {
    const { errors } = this.state;
    if (
      vehicleType === "" ||
      vehicleType === null ||
      vehicleType === undefined
    ) {
      this.setState({ errors: { ...errors, vehicleType: true } });
    } else {
      this.setState({ errors: { ...errors, vehicleType: false } });
    }
    this.setState({ vehicleType });
    // this.setState({ dealerPoType: dealerPoType && dealerPoType.value });
  };

  onValidate = (name) => {
    const { branch, errors } = this.state;
    if (name === "branch") {
      if (
        branch === "" ||
        branch === null ||
        branch === undefined ||
        (branch && branch.length === 0)
      ) {
        this.setState({ errors: { ...errors, branchError: true } });
      } else {
        this.setState({ errors: { ...errors, branchError: false } });
      }
    }
  };

  dealerPoOption = [
    { id: 1, value: "YES", label: "Yes" },
    { id: 2, value: "NO", label: "No" },
  ];
  //--------------------------------all handleOnChanges---------------------------

  //------------------------------all keyPress events---------------------------
  restrictSpecialCharactersNumber = (e) => {
    const regx = "^[a-zA-Z ]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictSpecialCharacters = (e) => {
    const regx = "^[a-zA-Z0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictSpecialCharactersNumberWithoutSpace = (e) => {
    const regx = "^[a-zA-Z0-9 ]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictAlphabets = (e) => {
    const regx = "^[0-9]*$";
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  restrictBlankSpace = (e) => {
    const regx = /^\S*$/;
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  //-----------------------------all keyPress events--------------------------

  //--------------------------------submitButton onChange--------------------------

  onDrop = (file, picture, name, id, documentType, e) => {
    if (picture.length > 1) {
      picture.shift();
      file.shift();
    }
    if (documentType === "image1") {
      this.setState({ bikePreview1: true, showArray1: true });
    } else if (documentType === "image2") {
      this.setState({ bikePreview2: true, showArray2: true });
    } else if (documentType === "image3") {
      this.setState({ bikePreview3: true, showArray3: true });
    } else if (documentType === "image4") {
      this.setState({ bikePreview4: true, showArray4: true });
    } else if (documentType === "image5") {
      this.setState({ bikePreview5: true, showArray5: true });
    }else if (documentType === "image6") {
      this.setState({ bikePreview6: true, showArray6: true });
    }
    this.setState({
      bikeImgDetails: this.state.bikeImgDetails.concat(file),
    });
    let { errors } = this.state;
    this.setState({ [name]: file, errors: errors });
    let bikeImages = {
      id: id,
      documentType: documentType,
      // isdisplay: isdisplay,
      fileName: file && file[0] && file[0].name,
    };
    if (bikeImages) {
      let temp = [];
      // if (!this.props.verifyObj) {
      //   this.setState({
      //     bikeImageData: this.state.bikeImageData.concat(bikeImages),
      //   });
      // } else if
      if (this.props.verifyObj) {
        console.log("**", this.state.bikeImageData);
        this.state.bikeImageData.map((item) => {
          console.log("item-->", item);
          console.log("bikeImages--->", bikeImages);
          if (item.docType === bikeImages.documentType) {
            temp.push(bikeImages);
          } else if (item.documentType === bikeImages.documentType) {
            temp.push(bikeImages);
          } else {
            temp.push(item);
          }
        });
        this.setState({ bikeImageData: temp, bikeImageDataId: temp });
      }
    }
  };

  deleteUploadedFunctn = (docType) => {
    if (docType === "image1") {
      this.setState({
        bikeImg1: null,
        bikePreview1: false,
        showArray1: false,
        docType: "image1",
      });
    }
    if (docType === "image2") {
      this.setState({
        bikeImg2: null,
        bikePreview2: false,
        showArray2: false,
        docType: "image2",
      });
    }
    if (docType === "image3") {
      this.setState({
        bikeImg3: null,
        bikePreview3: false,
        showArray3: false,
        docType: "image3",
      });
    }
    if (docType === "image4") {
      this.setState({
        bikeImg4: null,
        bikePreview4: false,
        showArray4: false,
        docType: "image4",
      });
    } if (docType === "image5") {
      this.setState({
        bikeImg5: null,
        bikePreview5: false,
        showArray5: false,
        docType: "image5",
      });
    } if (docType === "image6") {
      this.setState({
        bikeImg6: null,
        bikePreview6: false,
        showArray6: false,
        docType: "image6",
      });
    }

    // const temp = this.state.bikeImageData.filter((item) => {
    //   if (item.documentType !== documentType) {
    //     return item;
    //   }
    // });

    // this.state.bikeImageData.map((item) => {
    //   if (item.documentType === documentType) {
    //     this.setState({
    //       deletedBikeImages: this.state.deletedBikeImages.concat(item),
    //     }, ()=>{
    //       console.log("deletedBikeImages-->", this.state.deletedBikeImages)
    //     });
    //   }
    // });

    let temp = [];
    this.state.bikeImageData.map((item) => {
      console.log("docType", docType);
      console.log("item-->", item);
      if (item.documentType === docType) {
        console.log("cond1");
        temp.push({ isdisplay: false, remove: "true", docType: docType });
        this.setState({
          deletedBikeImages: this.state.deletedBikeImages.concat(item),
        });
        // this.setState({ bikeImageData: temp, bikeImageDataId : temp});
      } else {
        console.log("cond3");
        temp.push(item);
        // this.setState({ bikeImageData: temp, bikeImageDataId: temp });
      }
    });
    console.log("temp-->", temp);
    this.setState({ bikeImageData: temp });

    // console.log("temp-->", temp)

    //  const temp = this.state.bikeImageData.map((item) => {
    //   if (item.documentType !== documentType) {
    //     return item;
    //   }
    // });
  };

  handleDealerPo = (dealerPoType) => {
    this.setState({ dealerPoType: dealerPoType && dealerPoType.value });
  };

  handleSubmit = (e) => {
    const { errors, dealerPoType } = this.state;

    let isAdd = true;

    if (isAdd) {
      let result = this.state.deletedBikeImages.map((a) => {
        return { fileName: a.fileName, documentType: a.documentType };
      });
      let bikeResult = this.state.bikeImageData.map((a) => {
        return {
          fileName: a.fileName,
          documentType: a.documentType,
          id: null,
          // isdisplay: a.isdisplay,
        };
      });
      const resultBike = this.state.bikeImageData.filter((data) => {
        if (data && data.remove !== "true") {
          return {
            fileName: data.fileName,
            documentType: data.documentType,
            id: null,
            isdisplay: data.isdisplay,
          };
        }
      });
      const res = resultBike.map((item) => {
        return {
          fileName: item.fileName,
          documentType: item.documentType,
          id: null,
          isdisplay: item.isdisplay,
        };
      });
      if (this.props.verifyObj && this.state.deletedBikeImages.length > 0) {
        deleteCaraouselImages({ data: result, section: this.props.verifyObj });
      }
      saveUpdateCaraouselMaster(
        {
          carouselImageInfo: JSON.stringify({
            data: res,
            section: this.props.verifyObj,
          }),
        },
        this.state.bikeImgDetails
      ).then((response) => {
        if (response.data && response.data.error === false) {
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
          });
          this.handleClose();
        }
        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
          });
          this.handleClose();
        }
      });
    }
    this.setState({ errors: { ...errors } });
  };

  //---------------------------------Submit Button onChange---------------------

  render() {
    const { show, bikeImg1, bikeImg2, bikeImg3, bikeImg4, bikeImg5, bikeImg6 } =
      this.state;

    let dealerPoObj = {};

    const dealerPoOption = [
      { id: 1, value: "Home", label: "Home" },
      { id: 2, value: "Explore", label: "Explore" },
    ];

    dealerPoOption.map((res) => {
      if (res.value == this.state.dealerPoType) {
        dealerPoObj = res;
      }
    });

    const dropstyle = {
      container: (base) => ({
        ...base,
        flex: 1,
      }),
    };

    console.log("bikeImageData--->", this.state.bikeImageData);

    return (
      <React.Fragment>
        <div>
          <Modal
            className="add-user"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={() => {
              this.close();
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Caraousel Master</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {this.state.isloading ? (
                <h4 className="text-center">LOADING...</h4>
              ) : (
                <>
                  <div className="row">
                    {/* <div className="col-md-12  mt-4" lg={12}>
                      <label>Section</label>
                      <Select
                        value={dealerPoObj}
                        name="dealerPoObj"
                        onChange={this.handleDealerPo}
                        options={dealerPoOption}
                        placeholder="Section"
                        styles={dropstyle}
                      />
                    </div> */}
                    <div
                      className="col-md-4  mt-4"
                      lg={12}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      {(bikeImg1 &&
                        bikeImg1[0] &&
                        bikeImg1[0].filePath &&
                        bikeImg1[0].filePath.replace(
                          "/var/www/html",
                          BASE_URL
                        )) ||
                      (this.state.bikeImageData.length != 0 &&
                        this.state.bikeImageData &&
                        this.state.bikeImageData[0] &&
                        this.state.bikeImageData[0].documentType &&
                        this.state.bikeImageData[0].documentType.toLowerCase() ===
                          "image1") ? (
                        <span
                          onClick={(e) => this.deleteUploadedFunctn("image1")}
                          className="personalCrossIcon"
                        >
                          X
                        </span>
                      ) : null}
                      {bikeImg1 &&
                      bikeImg1[0] &&
                      bikeImg1[0].filePath &&
                      bikeImg1[0].filePath.replace(
                        "/var/www/html",
                        BASE_URL
                      ) ? (
                        <img
                          src={
                            bikeImg1 &&
                            bikeImg1[0] &&
                            bikeImg1[0].filePath.replace(
                              "/var/www/html",
                              BASE_URL
                            )
                          }
                          alt="bike1"
                          style={{ height: "50%" }}
                        ></img>
                      ) : (
                        <>
                          <ImageUploader
                            singleImage={"true"}
                            value={bikeImg1}
                            name="bikeImage1"
                            withIcon={true}
                            withPreview={this.state.bikePreview1}
                            withLabel={true}
                            accept="image/*"
                            buttonText="Upload Bike Image 1"
                            onChange={(file, base64) => {
                              this.onDrop(
                                file,
                                base64,
                                "bikeImage1",
                                null,
                                "image1",
                                false
                              );
                            }}
                            imgExtension={[
                              ".jpg",
                              ".gif",
                              ".png",
                              ".jpeg",
                              ".pdf",
                            ]}
                            maxFileSize={5242880}
                          />
                        </>
                      )}
                    </div>
                    <div
                      className="col-md-4  mt-4"
                      lg={12}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      {(bikeImg2 &&
                        bikeImg2[0] &&
                        bikeImg2[0].filePath &&
                        bikeImg2[0].filePath.replace(
                          "/var/www/html",
                          BASE_URL
                        )) ||
                      (this.state.bikeImageData.length != 0 &&
                        this.state.bikeImageData &&
                        this.state.bikeImageData[1] &&
                        this.state.bikeImageData[1].documentType &&
                        this.state.bikeImageData[1].documentType.toLowerCase() ===
                          "image2") ? (
                        <span
                          onClick={(e) => this.deleteUploadedFunctn("image2")}
                          className="personalCrossIcon"
                        >
                          X
                        </span>
                      ) : null}
                      {bikeImg2 &&
                      bikeImg2[0] &&
                      bikeImg2[0].filePath &&
                      bikeImg2[0].filePath.replace(
                        "/var/www/html",
                        BASE_URL
                      ) ? (
                        <img
                          src={
                            bikeImg2 &&
                            bikeImg2[0] &&
                            bikeImg2[0].filePath &&
                            bikeImg2[0].filePath.replace(
                              "/var/www/html",
                              BASE_URL
                            )
                          }
                          alt="bike2"
                          style={{ height: "50%" }}
                        ></img>
                      ) : (
                        <>
                          <ImageUploader
                            value={bikeImg2}
                            name="bikeImage2"
                            withIcon={true}
                            withPreview={this.state.bikePreview2}
                            withLabel={true}
                            accept="image/*"
                            buttonText="Upload Bike Image 2"
                            onChange={(file, base64) => {
                              this.onDrop(
                                file,
                                base64,
                                "bikeImage2",
                                null,
                                "image2",
                                false
                              );
                            }}
                            imgExtension={[
                              ".jpg",
                              ".gif",
                              ".png",
                              ".jpeg",
                              ".pdf",
                            ]}
                            maxFileSize={5242880}
                          />
                        </>
                      )}
                    </div>
                    <div
                      className="col-md-4  mt-4"
                      lg={12}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      {(bikeImg3 &&
                        bikeImg3[0] &&
                        bikeImg3[0].filePath &&
                        bikeImg3[0].filePath.replace(
                          "/var/www/html",
                          BASE_URL
                        )) ||
                      (this.state.bikeImageData.length != 0 &&
                        this.state.bikeImageData &&
                        this.state.bikeImageData[2] &&
                        this.state.bikeImageData[2].documentType &&
                        this.state.bikeImageData[2].documentType.toLowerCase() ===
                          "image3") ? (
                        <span
                          onClick={(e) => this.deleteUploadedFunctn("image3")}
                          className="personalCrossIcon"
                        >
                          X
                        </span>
                      ) : null}
                      {bikeImg3 &&
                      bikeImg3[0] &&
                      bikeImg3[0].filePath &&
                      bikeImg3[0].filePath.replace(
                        "/var/www/html",
                        BASE_URL
                      ) ? (
                        <img
                          src={
                            bikeImg3 &&
                            bikeImg3[0] &&
                            bikeImg3[0].filePath &&
                            bikeImg3[0].filePath.replace(
                              "/var/www/html",
                              BASE_URL
                            )
                          }
                          alt="bike3"
                          style={{ height: "50%" }}
                        ></img>
                      ) : (
                        <>
                          <ImageUploader
                            name="bikeImage3"
                            withIcon={true}
                            withPreview={this.state.bikePreview3}
                            withLabel={true}
                            accept="image/*"
                            buttonText="Upload Bike Image 3"
                            onChange={(file, base64) => {
                              this.onDrop(
                                file,
                                base64,
                                "bikeImage3",
                                null,
                                "image3",
                                false
                              );
                            }}
                            imgExtension={[
                              ".jpg",
                              ".gif",
                              ".png",
                              ".jpeg",
                              ".pdf",
                            ]}
                            maxFileSize={5242880}
                          />
                        </>
                      )}
                    </div>
                    <div
                      className="col-md-4  mt-4"
                      lg={12}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      {(bikeImg4 &&
                        bikeImg4[0] &&
                        bikeImg4[0].filePath &&
                        bikeImg4[0].filePath.replace(
                          "/var/www/html",
                          BASE_URL
                        )) ||
                      (this.state.bikeImageData.length != 0 &&
                        this.state.bikeImageData &&
                        this.state.bikeImageData[3] &&
                        this.state.bikeImageData[3].documentType &&
                        this.state.bikeImageData[3].documentType.toLowerCase() ===
                          "image4") ? (
                        <span
                          onClick={(e) => this.deleteUploadedFunctn("image4")}
                          className="personalCrossIcon"
                        >
                          X
                        </span>
                      ) : null}
                      {bikeImg4 &&
                      bikeImg4[0] &&
                      bikeImg4[0].filePath &&
                      bikeImg4[0].filePath.replace(
                        "/var/www/html",
                        BASE_URL
                      ) ? (
                        <img
                          src={
                            bikeImg4 &&
                            bikeImg4[0] &&
                            bikeImg4[0].filePath &&
                            bikeImg4[0].filePath.replace(
                              "/var/www/html",
                              BASE_URL
                            )
                          }
                          alt="bike4"
                          style={{ height: "50%" }}
                        ></img>
                      ) : (
                        <>
                          <ImageUploader
                            name="bikeImage4"
                            withIcon={true}
                            withPreview={this.state.bikePreview4}
                            withLabel={true}
                            accept="image/*"
                            buttonText="Upload Bike Image 4"
                            onChange={(file, base64) => {
                              this.onDrop(
                                file,
                                base64,
                                "bikeImage4",
                                null,
                                "image4",
                                false
                              );
                            }}
                            imgExtension={[
                              ".jpg",
                              ".gif",
                              ".png",
                              ".jpeg",
                              ".pdf",
                            ]}
                            maxFileSize={5242880}
                          />
                        </>
                      )}
                    </div>
                   
                    <div
                      className="col-md-4  mt-4"
                      lg={12}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      {(bikeImg5 &&
                        bikeImg5[0] &&
                        bikeImg5[0].filePath &&
                        bikeImg5[0].filePath.replace(
                          "/var/www/html",
                          BASE_URL
                        )) ||
                      (this.state.bikeImageData.length != 0 &&
                        this.state.bikeImageData &&
                        this.state.bikeImageData[4] &&
                        this.state.bikeImageData[4].documentType &&
                        this.state.bikeImageData[4].documentType.toLowerCase() ===
                          "image5") ? (
                        <span
                          onClick={(e) => this.deleteUploadedFunctn("image5")}
                          className="personalCrossIcon"
                        >
                          X
                        </span>
                      ) : null}
                      {bikeImg5 &&
                      bikeImg5[0] &&
                      bikeImg5[0].filePath &&
                      bikeImg5[0].filePath.replace(
                        "/var/www/html",
                        BASE_URL
                      ) ? (
                        <img
                          src={
                            bikeImg5 &&
                            bikeImg5[0] &&
                            bikeImg5[0].filePath &&
                            bikeImg5[0].filePath.replace(
                              "/var/www/html",
                              BASE_URL
                            )
                          }
                          alt="bike5"
                          style={{ height: "50%" }}
                        ></img>
                      ) : (
                        <>
                          <ImageUploader
                            name="bikeImage5"
                            withIcon={true}
                            withPreview={this.state.bikePreview5}
                            withLabel={true}
                            accept="image/*"
                            buttonText="Upload Bike Image 5"
                            onChange={(file, base64) => {
                              this.onDrop(
                                file,
                                base64,
                                "bikeImage5",
                                null,
                                "image5",
                                false
                              );
                            }}
                            imgExtension={[
                              ".jpg",
                              ".gif",
                              ".png",
                              ".jpeg",
                              ".pdf",
                            ]}
                            maxFileSize={5242880}
                          />
                        </>
                      )}
                    </div>
                    <div
                      className="col-md-4  mt-4"
                      lg={12}
                      style={{ position: "relative", textAlign: "center" }}
                    >
                      {(bikeImg6 &&
                        bikeImg6[0] &&
                        bikeImg6[0].filePath &&
                        bikeImg6[0].filePath.replace(
                          "/var/www/html",
                          BASE_URL
                        )) ||
                      (this.state.bikeImageData.length != 0 &&
                        this.state.bikeImageData &&
                        this.state.bikeImageData[5] &&
                        this.state.bikeImageData[5].documentType &&
                        this.state.bikeImageData[5].documentType.toLowerCase() ===
                          "image6") ? (
                        <span
                          onClick={(e) => this.deleteUploadedFunctn("image6")}
                          className="personalCrossIcon"
                        >
                          X
                        </span>
                      ) : null}
                      {bikeImg6 &&
                      bikeImg6[0] &&
                      bikeImg6[0].filePath &&
                      bikeImg6[0].filePath.replace(
                        "/var/www/html",
                        BASE_URL
                      ) ? (
                        <img
                          src={
                            bikeImg6 &&
                            bikeImg6[0] &&
                            bikeImg6[0].filePath &&
                            bikeImg6[0].filePath.replace(
                              "/var/www/html",
                              BASE_URL
                            )
                          }
                          alt="bike6"
                          style={{ height: "50%" }}
                        ></img>
                      ) : (
                        <>
                          <ImageUploader
                            name="bikeImage6"
                            withIcon={true}
                            withPreview={this.state.bikePreview6}
                            withLabel={true}
                            accept="image/*"
                            buttonText="Upload Bike Image 6"
                            onChange={(file, base64) => {
                              this.onDrop(
                                file,
                                base64,
                                "bikeImage6",
                                null,
                                "image6",
                                false
                              );
                            }}
                            imgExtension={[
                              ".jpg",
                              ".gif",
                              ".png",
                              ".jpeg",
                              ".pdf",
                            ]}
                            maxFileSize={5242880}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer show={this.state.showInner}>
              <Button className="btn-danger" onClick={this.modclose}>
                Cancel
              </Button>
              <Button
                className="btn-success"
                onClick={(e) => {
                  this.handleSubmit(this.state.bikeImageData);
                }}
                // disabled={this.state.bikeError}
              >
                {this.props.verifyObj ? "Update" : "Add"}
              </Button>
            </Modal.Footer>
          </Modal>
          <CloseCaraouselModel
            show={this.state.showInner}
            button2={this.modclose}
            button1={this.handleClose}
            title="Do you want to close ?"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AddCaraouselModel;
