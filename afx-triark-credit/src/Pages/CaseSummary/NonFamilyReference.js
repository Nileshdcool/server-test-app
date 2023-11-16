import React from "react";
import { Row, Col, Button } from "antd";
import Label from "../../Components/label";
import { useParams } from "react-router-dom";
import { getReferenceDetailsNonFamily } from "../../Redux/Services/Cases";
import { EditOutlined } from "@ant-design/icons";
import NonFamilyReferenceEdit from "./NonFamilyReferenceEdit";

function NonFamilyReference() {
  const { id } = useParams();
  const [data, setData] = React.useState("");
  const [flag, setFlag] = React.useState(true);

  const getNonFamilyRef = async () => {
    const response = await getReferenceDetailsNonFamily({
      applicantUniqueId: id,
    });
    setData(response?.data?.data);
  };

  React.useEffect(() => {
    getNonFamilyRef();
  }, []);

  return (
    <>
      {flag ? (
        <>
          {" "}
          <Row justify="end" align="middle">
            {/* <EditOutlined onClick={() => setFlag(false)} /> */}
          </Row>
          <Row>
            <Col lg={8}>
              <Label label="Relationship" value={data?.relationship} />
            </Col>
            <Col lg={8}>
              <Label label="Name" value={data?.name} />
            </Col>
            <Col lg={8}>
              <Label label="Mobile Number" value={data?.mobNo} />
            </Col>
            <Col lg={8}>
              <Label label="Address" value={data?.addres} />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <NonFamilyReferenceEdit
            data={data}
            setFlag={setFlag}
            getNonFamilyRef={getNonFamilyRef}
          />
        </>
      )}
    </>
  );
}

export default NonFamilyReference;
