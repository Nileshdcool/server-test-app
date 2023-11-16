import React from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { getBusinessDetails } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import Spin from "../../Components/Spin";
import BusinessDetailsEdit from "./BusinessDetailsEdit";
import { EditOutlined } from "@ant-design/icons";

function BusinessDetails(props) {
  const params = useParams();
  const [data, setData] = React?.useState(null);
  const [loader, setLoader] = React?.useState(null);
  const [flagEdit, setFlagEdit] = React.useState(true);

  React?.useEffect(() => {
    getBusinessData();
  }, []);

  const getBusinessData = async () => {
    setLoader(true);
    const response = await getBusinessDetails({
      applicantUniqueId: props?.id,
    });
    setData(response?.data?.data);
    setLoader(false);
  };

  const photo = (
    <img
      src={getFilePath(data?.filePath)}
      alt="pan"
      height="200px"
      width="300px"
    />
  );

  return (
    <>
      {flagEdit ? (
        <Spin spinning={loader}>
          {!(props?.caseFreeze || props?.userFreeze) && (
            <>
             <Row justify="end" align="middle">
               {/* <EditOutlined onClick={() => setFlagEdit(false)} /> */}
             </Row>
            </>
      
          )}
          {data?.filePath && (
            <Row>
              <Col lg={8}>
                <Label label="Photo" value={photo} />
              </Col>
            </Row>
          )}
          <Row gutter={[16,16]}>
            <Col lg={8}>
              <Label label="Sector" value={data?.sector} />
            </Col>
            <Col lg={8}>
              <Label label="Industry" value={data?.industry} />
            </Col>
            <Col lg={8}>
              <Label label="Sub-industry" value={data?.subindustry} />
            </Col>
            <Col lg={8}>
              <Label label="Segment" value={data?.segment} />
            </Col>
            <Col lg={8}>
              <Label label="Monthly Income" value={data?.monthlyIncome} />
            </Col>
          </Row>
          <br />
          <Row gutter={[16,16]}>
            <Col>
              <Label
                label="Is it a Company Bank Account?"
                value={data?.isItCompanyBankAccount ? "Yes" : "No"}
              />
            </Col>
          </Row>
          <b>Bank Details</b>
          <br /> <br />
          <Row gutter={[16,16]}>
            <Col lg={8}>
              <Label label="Account Type" value={data?.accountType} />
            </Col>
            <Col lg={8}>
              <Label label="Account Number" value={data?.accountNumber} />
            </Col>
            <Col lg={8}>
              <Label label="IFSC Code" value={data?.ifscCode} />
            </Col>
            <Col lg={8}>
              <Label label="Bank Name" value={data?.bankName} />
            </Col>
          </Row>
        </Spin>
      ) : (
        <BusinessDetailsEdit
          data={data}
          getData={getBusinessData}
          setFlagEdit={setFlagEdit}
          appId={props?.id}
        />
      )}
    </>
  );
}

export default BusinessDetails;
