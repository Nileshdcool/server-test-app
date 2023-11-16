import React, { useEffect, useState } from 'react';
import { getLoanDet } from '../../Redux/Services/Cases';
import { Col, Row } from 'antd';
import Label from '../../Components/label';
import { EditOutlined } from '@ant-design/icons';
import LoanDetEdit from './LoanDetEdit';

function LoanDet(props) {
  const [data, setData] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await getLoanDet({
        applicantUniqueid: props?.match?.params?.id,
      });
      setData(response?.data?.data);
    })();
  }, []);

  // console.log(data, 'API response');

  const handleDataUpdate = (updatedData) => {
    setData(updatedData);
    setShowInput(false); // Disable edit mode
  };

  return (
    <>
      <Row>
        <Col lg={20}>
          <b>Loan Details</b>
        </Col>
        {!(props?.caseFreeze || props?.userFreeze) && (
          <Col span={4}>
            <EditOutlined
              style={{ fontSize: 20 }}
              onClick={() => setShowInput(!showInput)}
            />
          </Col>
        )}
        <br />
        <br />
      </Row>
      {showInput == false ? (
        <Row>
          <Col lg={8}>
            <Label label='IOT Device charges' value={data?.iotDeviceCharges} />
          </Col>
          <Col lg={8}>
            <Label label='Processing Fee' value={data?.processingFees} />
          </Col>
          <Col lg={8}>
            <Label label='CLI' value={data?.cliAmount} />
          </Col>
          <Col lg={8}>
            <Label label='Down Payment' value={data?.downPayment} />
          </Col>
          <Col lg={8}>
            <Label label='Tenure' value={data?.tenure_requested} />
          </Col>
          <Col lg={8}>
            <Label label='IRR(Flat)' value={data?.rateOfInterest} />
          </Col>
        </Row>
      ) : (
        <LoanDetEdit
          props={props}
          setShowInput={setShowInput}
          onDataUpdate={handleDataUpdate}
        />
      )}

      <Row>
        <Col lg={8}>
          <Label label='Upfront Payment ' value={data?.upfrontAmount} />
        </Col>

        <Col lg={8}>
          <Label label='On Road price' value={data?.onRoadPrice} />
        </Col>
        <Col lg={8}>
          <Label label='On Road cost including' value={data?.onRoadCost} />
        </Col>
        <Col lg={8}>
          <Label label='Loan Amount' value={data?.disbursedAmount} />
        </Col>
        <Col lg={8}>
          {/* <Label label='LTV' value={data?.ltvPercentage} /> */}
          {data && data.ltvPercentage !== undefined && (
            <Label
              label='LTV Percentage'
              value={data.ltvPercentage.toFixed(2)}
            />
          )}
        </Col>
        <Col lg={8}>
          <Label label='IRR(Reducing)' value={data?.rateOfInterestReducing} />
        </Col>
        <Col lg={8}>
          <Label label='EMI Amount' value={Math.ceil(data?.emi)} />
        </Col>
        <Col lg={8}>
          <Label label='Insurance Amount' value={data?.insuranceAmount} />
        </Col>
        <Col lg={8}>
          <Label label='RTO Amount' value={data?.rtoAmount} />
        </Col>
        <Col lg={8}>
          <Label label='Sales Remark' value={data?.salesAppRemark} />
        </Col>
      </Row>
    </>
  );
}

export default LoanDet;
