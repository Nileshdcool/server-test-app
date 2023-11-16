import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getPersonalDetails } from "../../Redux/Services/Cases";
import Spin from "../../Components/Spin";
import { EditOutlined } from "@ant-design/icons";
import FinancialInformationEdit from "./FinancialInformationEdit";

function FinancialInformation(props) {
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [flagEdit, setFlagEdit] = React.useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoader(true);
    const response = await getPersonalDetails({
      applicantUniqueId: props?.id,
    });
    setData(response?.data?.data);
    setLoader(false);
  };

  return (
    <>
      {flagEdit ? (
        <Spin spinning={loader}>
          <Row justify="end" align="middle">
            {/* {!(props?.caseFreeze || props?.userFreeze) && (
              <EditOutlined onClick={() => setFlagEdit(false)} />
            )} */}
          </Row>
          <Row>
            <Col lg={8}>
              <Label label="Account Type" value={data?.accountType} />
            </Col>
            <Col lg={8}>
              <Label label="Account Number" value={data?.accountNumber} />
            </Col>
            <Col lg={8}>
              <Label label="IFSC Code" value={data?.ifscNumber} />
            </Col>
            <Col lg={8}>
              <Label label="Bank Name" value={data?.bankName} />
            </Col>
            <Col lg={8}>
              <Label label="Bank Type" value={data?.accountType} />
            </Col>
            <Col lg={8}>
              <Label label="Savings" value={data?.savings} />
            </Col>
            <Col lg={8}>
              <Label label="Investment" value={data?.investment} />   
            </Col>
            <Col lg={8}>
              <Label label="Liabilities" value={data?.liabilities} />
            </Col>
          </Row>
        </Spin>
      ) : (
        <FinancialInformationEdit
          data={data}
          setFlagEdit={setFlagEdit}
          getData={getData}
          qdeData={props?.qdeData}
          appId={props?.id}
        />
      )}
    </>
  );
}

export default FinancialInformation;
