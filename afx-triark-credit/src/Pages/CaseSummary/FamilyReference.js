import React from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getReferenceDetailsFamily } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import FamilyReferenceEdit from "./FamilyReferenceEdit";

function FamilyReference() {
  const { id } = useParams();
  const [flag, setFlag] = React?.useState(true);
  const [data, setData] = React.useState("");

  const getFamilyReference = async () => {
    const response = await getReferenceDetailsFamily({
      applicantUniqueId: id,
    });
    setData(response?.data?.data);
  };

  React.useEffect(() => {
    getFamilyReference();
  }, []);

  return (
    <>
      {flag ? (
        <>
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
          <FamilyReferenceEdit
            data={data}
            setFlag={setFlag}
            getFamilyReference={getFamilyReference}
          />
        </>
      )}
    </>
  );
}

export default FamilyReference;
