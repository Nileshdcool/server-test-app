import React from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import AdditionalContatDetailsEdit from "./AdditionalContactDetailsEdit";
import { EditOutlined } from "@ant-design/icons";

function AdditionalContatDetails(props) {
  const [flag, setFlag] = React.useState(true);

  return (
    <>
      {flag ? (
        <>
          <Row justify="end" align="middle">
            {/* {!(props?.caseFreeze || props?.userFreeze) && (
            <EditOutlined onClick={() => setFlag(false)} />
            )} */}
          </Row>
          <Row>
            <Col lg={8}>
              <Label label="Mobile Number" value={props?.data?.mobileNo} />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <AdditionalContatDetailsEdit
            data={props?.data}
            getData={props?.getData}
            setFlag={setFlag}
          />
        </>
      )}
    </>
  );
}

export default AdditionalContatDetails;
