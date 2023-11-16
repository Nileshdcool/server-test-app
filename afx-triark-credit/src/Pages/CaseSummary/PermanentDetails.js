import { Col, Row, Tag } from "antd";
import React from "react";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import PermanentDetailsEdit from "./PermanentDetailsEdit";

function PermanentDetails(props) {
  const [flagEdit, setFlagEdit] = React.useState(true);

  let params = useParams();

 const img = (
   <img
     src={getFilePath(props?.data?.filePath ? props?.data?.filePath : "")}
     alt="image"
     height="200px"
     width="300px"
   />
 );
 
 const imgBack = (
   <img
     src={getFilePath(
       props?.data?.filePathBack ? props?.data?.filePathBack : ""
     )}
     alt="image"
     height="200px"
     width="300px"
   />
 );

  return (
    <>
      {flagEdit ? (
        <>
          {/* {!(props?.caseFreeze || props?.userFreeze) && (
            <Row justify="end" align="middle">
              <EditOutlined onClick={() => setFlagEdit(false)} />
            </Row>
          )} */}
          <Row>
            <Col lg={7}>
              <Label
                value={img}
              />
            </Col>

            <Col md={5} lg={4} xl={2} />
            <Col lg={7}>
              <Label
                value={imgBack}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Label
                label="Address Line 1"
                value={props?.data?.permanentAddress1}
              />
            </Col>
            <Col lg={8}>
              <Label
                label="Address Line 2"
                value={props?.data?.permanentAddress2}
              />
            </Col>
            <Col lg={8}>
              <Label
                label="Landmark 1"
                value={props?.data?.permanentAddressLandmark1}
              />
            </Col>
            <Col lg={8}>
              <Label
                label="Landmark 2"
                value={props?.data?.permanentAddressLandmark2}
              />
            </Col>
            <Col lg={8}>
              <Label label="PIN Code" value={props?.data?.permanentPinCode} />
            </Col>
            <Col lg={8}>
              <Label label="City" value={props?.data?.permanentCity} />
            </Col>
            <Col lg={8}>
              <Label label="State" value={props?.data?.permanentState} />
            </Col>{" "}
            <Col lg={8}>
              <Label
                label="Residence Type"
                value={props?.data?.permanentResidenceType}
              />
            </Col>
            <Col lg={8}>
              <Label
                label="Residing at current address since"
                value={`${props?.data?.permanentYear || 0} Years ${
                  props?.data?.permanentMonth || 0
                } Months`}
              />
            </Col>
          </Row>{" "}
        </>
      ) : (
        <PermanentDetailsEdit
          data={props?.data}
          setFlagEdit={setFlagEdit}
          flagEdit={flagEdit}
          getData={props?.getData}
          appId={params?.id}
        />
      )}
    </>
  );
}

export default PermanentDetails;
