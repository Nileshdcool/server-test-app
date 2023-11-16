// import { Collapse } from "antd";
// import React from "react";
// // import Radio from "@material-ui/core/Radio";
// import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
// import { Button, Card, Col, Input, Row, Form, Radio } from "antd";
// import TextField from "@material-ui/core/TextField";
// import SelectIcon from "../../assets/Images/select.svg";
// import { connect } from "react-redux";
// import { savePanGetGst, getGstAddress } from "../../Redux/Services/Qde";
// import "./style.scss";
// import { tw } from "../../Utility/ReduxToaster";

// function DDEgst(props) {
//   const [show, setShow] = React.useState(true);
//   const [gstNumber, setGstNumber] = React.useState([]);
//   const [gstAddress, setGstAddress] = React.useState("");
//   const [gstAddressL2, setGstAddressL2] = React.useState("");
//   let form;

//   const getGstNumber = () => {
//     const value = gstNumber?.map((number) => {
//       return <option value={number?.gstinId}>{number?.gstinId}</option>;
//     });
//     return value;
//   };


//   React.useEffect(() => {
//     if (documentType !== "form60" ) {
//       if (pangstdetails?.panNumber) {
//         (async () => {
//           const response = await props?.savePanGetGst({
//             panNumber: pangstdetails?.panNumber,
//           });
//           setGstNumber(response?.payload?.data);
//         })();
//       }
//     }
//   }, [documentType, pangstdetails, props]);

//   const handleFormChange = (changedFields, allFields) => {
//     if (changedFields?.radio) {
//       if (changedFields?.radio === "via_creds") {
//         // call via creds operation
//         console.log("creds");
//       } else if (changedFields?.radio === "via_otp") {
//         // call via otp operation
//         console.log("otp");
//       }
//     }
//     if (changedFields?.gst) {
//       (async () => {
//         const response = await props.getGstAddress({ gst: changedFields?.gst });
//         setGstAddress(response?.payload?.addressLine1);
//         setGstAddressL2(response?.payload?.addressLine2);
//       })();
//     }
//   };

//   const pangstdetails = props?.dde?.ddeDetails?.pangstdetails;
//   const documentType = props?.dde?.ddeDetails?.pangstdetails?.documentType;

//   const { Panel } = Collapse;
//   return (
//     <div>
//       <div className="DDEgstContainer">
//         <Form ref={(e) => (form = e)} onValuesChange={handleFormChange}>
//           <Collapse
//             showArrow="false"
//             expandIconPosition="right"
//             expandIcon={({ isActive }) =>
//               isActive ? <MinusOutlined /> : <PlusOutlined />
//             }
//             defaultActiveKey={["1"]}>
//             <Panel header="GST Verification" key="1">
//               <div className="DDEgstTxtParent">
//                 <div className="DDEgsttxt">
//                   <span className="DDEgstTxt">PAN :</span>
//                   <span className="DDEgstValue">
//                     {documentType !== "form60"
//                       ? pangstdetails?.panNumber
//                       : "N/A"}
//                   </span>
//                 </div>
//                 <div className="DDEgsttxt">
//                   <span className="DDEgstTxt">PAN Name:</span>
//                   <span className="DDEgstValue">
//                     {documentType !== "form60" ? pangstdetails?.panName : "N/A"}
//                   </span>
//                 </div>
//                 <div className="DDEgsttxt">
//                   <span className="DDEgstTxt">Mobile Number:</span>
//                   <span className="DDEgstValue">
//                     {documentType !== "form60"
//                       ? pangstdetails?.mobileNumber
//                       : "N/A"}
//                   </span>
//                 </div>
//               </div>
//               <br />
//               <br />

//               <Row className={"typeRow"} gutter={[40, 40]}>
//                 <Col lg={8}>
//                   <div className={"mui-dropdown-wrapper"}>
//                     <img
//                       style={{ marginTop: 4 }}
//                       alt={"select"}
//                       src={SelectIcon}
//                       className="searchIcon"
//                     />
//                     <Form.Item
//                       name="gst"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Relationship selection is mandatory",
//                         },
//                       ]}>
//                       <TextField
//                         // onChange={handleSelect}
//                         select
//                         label="Select any one GST to Verify"
//                         fullWidth
//                         SelectProps={{
//                           native: true,
//                         }}>
//                         <option hidden></option>
//                         {getGstNumber()}
//                       </TextField>
//                     </Form.Item>
//                   </div>
//                 </Col>
//                 {show && (
//                   <>
//                     <Col lg={8}>
//                       <h3 className="DDEgst-label-head">
//                         Registered GST Address
//                       </h3>
//                       <p className="DDEgst-label-para">
//                         {`${gstAddress} ${gstAddressL2}`}
//                       </p>
//                     </Col>
//                     <Col lg={8}></Col>{" "}
//                     <Col lg={8}>
//                       <h3 className="DDEgst-label-head ml-1">
//                         Verification Mode
//                       </h3>
//                       <Form.Item
//                         name="radio"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Relationship selection is mandatory",
//                           },
//                         ]}>
//                         <Radio.Group
//                           style={{ display: "flex", width: "100%" }}
//                           className="QDe-scheme-radio">
//                           <Radio value={"via_creds"}>Via Credentials</Radio>
//                           <Radio value={"via_otp"}>Via OTP</Radio>
//                         </Radio.Group>
//                       </Form.Item>
//                     </Col>{" "}
//                     <Col lg={8}>
//                       <h3 className="DDEgst-label-head">Status</h3>
//                       <p className="DDEgst-label-tags">Active</p>
//                     </Col>
//                   </>
//                 )}
//               </Row>

//               <br />
//               <br />
//               <div className="buttons-position  mt-4 mb-2">
//                 <button className="cancle-button mr-3">Cancel</button>
//                 <button className="save-button">Submit</button>
//               </div>
//             </Panel>
//           </Collapse>
//         </Form>
//       </div>
//     </div>
//   );
// }

// const mapDispatchToProps = {
//   savePanGetGst,
//   getGstAddress,
// };

// const mapStateToProps = (state) => {
//   return {
//     dde: state.dde,
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(DDEgst);

