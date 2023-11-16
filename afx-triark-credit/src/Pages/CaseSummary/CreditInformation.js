import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { getCreditInformation } from "../../Redux/Services/Cases";
import Spin from "../../Components/Spin";
import { EditOutlined } from "@ant-design/icons";
import CreditInformationEdit from "./CreditInformationEdit";

function CreditInformation(props) {
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [flagEdit, setFlagEdit] = React.useState(true);

  const photo = (
    <img
      src={getFilePath(data?.filePath)}
      alt="pan"
      height="200px"
      width="300px"
    />
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoader(true);
    const response = await getCreditInformation({
      applicantUniqueId: props?.match?.params?.id,
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
          <>
            <Row>
                <Col lg={8}>
                    <Label label="Credit Score" value={data?.creditScore} />
                </Col>
                <Col lg={8}>
                    <Label label="Credit History" value={data?. creditHistory} />
                </Col>
            </Row>
            <div><b>Current Loans: </b></div>
            <Row>
              <Col lg={8}>
                  <Label label="No 30 DPD reporting in last 3 months" value={data?.ThirtyDPD} />
              </Col>
              <Col lg={8}>
                  <Label label="No 60 DPD reporting in last 12 months" value={data?.sixtyDPD} />
              </Col>
              <Col lg={8}>
                  <Label label="Never in 90 DPD" value={data?.nintyDPD} />
              </Col>
              <Col lg={8}>
                  <Label label="No Written Off / Suit Filed / SMA reporting ever" value={data?.writtenOrSuit} />
              </Col>
              <Col lg={8}>
                  <Label label="In case of restructured accounts, there should be no 30 DPD reporting in any tradeline post the restructuring date" value={data?.restructuredAccounts} />
              </Col>
            </Row>
        </>
        </Spin>
      ) : (
        <CreditInformationEdit
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

export default CreditInformation;
