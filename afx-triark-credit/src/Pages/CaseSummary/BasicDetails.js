import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Label from '../../Components/label';

function BasicDetails(props) {
  const [resData, setResData] = useState([]);
  const [mainApp, setMainApp] = useState([]);
  const [losData, setLosData] = useState([]);
  const [lenderName, setLenderName] = useState();
  const [dateOfAssessment, setDateOfAssessment] = useState();

  useEffect(() => {
    try {
      const response = props.caseSummaryData;
      const data = [
        ...response?.coapplicant.map((e) => {
          e.isCoApplicant = true;
          return e;
        }),
        ...response?.gurantor.map((e) => {
          e.isGurantor = true;
          return e;
        }),
      ];
      const mainAppData = response?.mainapplicant[0];
      const los = response?.losStatus;
      setResData(data);
      setMainApp(mainAppData);
      setLosData(los);
      setLenderName(response?.lenderName);
      setDateOfAssessment(response?.currentDate);
    } catch (err) {}
  }, []);

  const tabs = resData.map((item, index) => (
    <React.Fragment key={`basicDetails_${index}`}>
      {item.coSaveScheme ? (
        <Row>
          <Col lg={8}>
            <Label label='Customer Id' value={item.cif} />
          </Col>
          <Col lg={8}>
            <Label label='Co Applicant Name' value={item.customerName} />
          </Col>
          <Col lg={8}></Col>
        </Row>
      ) : null}
      {item.guaSaveScheme ? (
        <Row>
          <Col lg={8}>
            <Label label='Customer Id' value={item.cif} />
          </Col>
          <Col lg={8}>
            <Label label='Guarantor Name' value={item.customerName} />
          </Col>
          <Col lg={8}></Col>
        </Row>
      ) : null}
    </React.Fragment>
  ));

  return (
    <>
      <Row>
        <Col lg={8}>
          <Label label='LOS Application Id' value={mainApp?.id} />
        </Col>
        <Col lg={8}>
          <Label label='LOS Status' value={losData} />
        </Col>
        {mainApp?.scheme && (
          <Col lg={8}>
            <Label label='Scheme' value={mainApp?.schemeName} />
          </Col>
        )}
      </Row>
      <Row>
        {mainApp?.cif && (
          <Col lg={8}>
            <Label label='Customer Id' value={mainApp?.cif} />
          </Col>
        )}
        <Col lg={8}>
          <Label label='Main Applicant Name' value={mainApp?.customerName} />
        </Col>
        <Col lg={8}>
          <Label label='Bureau Score' value={mainApp?.bureauScore} />
        </Col>
      </Row>
      {tabs}
      <Row>
        {mainApp?.loanDetails && (
          <>
            <Col lg={8}>
              <Label label='Loan Amount' value={'₹ ' + mainApp?.loanAmt} />
            </Col>
            <Col lg={8}>
              <Label label='Tenure' value={mainApp?.tenure + ' Months'} />
            </Col>
            <Col lg={8}>
              <Label label='ROI' value={mainApp?.roi + ' %'} />
            </Col>
          </>
        )}
      </Row>
      <Row>
        {mainApp?.loanDetails && (
          <>
            <Col lg={8}>
              <Label label='Lender Name' value={lenderName} />
            </Col>
            <Col lg={8}>
              <Label
                label='Date of Assessment'
                value={dateOfAssessment.split(' ')[0]}
              />
            </Col>
            <Col lg={8}>
              <Label
                label='Time of Assessment'
                value={dateOfAssessment.split(' ')[1].replace(/\.0$/, '')}
              />
            </Col>
          </>
        )}
      </Row>
    </>
  );
}

export default BasicDetails;
