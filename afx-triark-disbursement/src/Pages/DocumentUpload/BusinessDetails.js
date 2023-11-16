import React, { useContext } from "react";
import { Row, Col, Button } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { getBusinessDetails } from "../../Redux/Services/Cases";
import { useParams } from "react-router-dom";
import Spin from "../../Components/Spin";

function BusinessDetails(props) {
  const params = useParams();
  const [data, setData] = React?.useState(null);
  const [loader, setLoader] = React?.useState(null);

  React?.useEffect(() => {
    (async () => {
      setLoader(true);
      const response = await getBusinessDetails({
        applicantUniqueId: props?.id,
      });
      setData(response?.data?.data);
      setLoader(false);
    })();
  }, []);
  if (!data) {
    return <></>;
  }
  const photo = (
    <img
      src={getFilePath(data?.filePath)}
      alt="image"
      height="200px"
      width="300px"
    />
  );

  return (
    <>
      <Spin spinning={loader}>
        {data?.filePath && (
          <Row>
            <Col lg={8}>
              <Label label="Photo" value={photo} />
            </Col>
          </Row>
        )}
        <Row>
          {/* {data?.sector && ( */}
          <Col lg={8}>
            <Label label="Sector" value={data?.sector} />
          </Col>
          {/* )}
        {data?.industry && ( */}
          <Col lg={8}>
            <Label label="Industry" value={data?.industry} />
          </Col>
          {/* )}
        {data?.subindustry && ( */}
          <Col lg={8}>
            <Label label="Sub-industry" value={data?.subindustry} />
          </Col>
          {/* )}
        {data?.segment && ( */}
          <Col lg={8}>
            <Label label="Segment" value={data?.segment} />
          </Col>
          {/* )}
        {data?.monthlyIncome && ( */}
          <Col lg={8}>
            <Label label="Monthly Income" value={data?.monthlyIncome} />
          </Col>
          {/* )} */}
        </Row>
        <br />
        <Row>
          <Col>
            <Label
              label="Is it a Company Bank Account?"
              value={data?.isItCompanyBankAccount ? "Yes" : "No"}
            />
          </Col>
        </Row>
        <b>Bank Details</b>
        <br /> <br />
        <Row>
          <Col lg={8}>
            <Label label="Account Type" value={data?.bankAccountType} />
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
    </>
  );
}

export default BusinessDetails;
