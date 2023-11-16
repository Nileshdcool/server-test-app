import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Button } from 'antd';
import Label from '../../Components/label';
import InputText from '../../Components/Input';
import {
  getLoanDetails,
  saveLoanDetails,
  createCustomer,
} from '../../Redux/Services/Cases';
import { useParams } from 'react-router-dom';
import Spin from '../../Components/Spin';
import { LoadingOutlined, EditOutlined } from '@ant-design/icons';
import LoanDetailsEdit from './LoanDetailsEdit';

function LoanDetails(props) {
  const userFreeze = props?.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = props.caseSummaryData?.mainapplicant[0]?.creditFreeze;

  const [editFlag, setEditFlag] = useState(false);
  const [emi, setEmi] = useState(null);
  const [tenure, setTenure] = useState(null);
  const [amount, setAmount] = useState(null);
  const [amountCalculated, setAmountCalculated] = useState(null);
  const [roi, setRoi] = useState(null);
  const [loader, setLoader] = useState(false);
  const [downPayment, setDownpayment] = useState(0);
  const [data, setData] = useState(0);
  const [ltvPercentageWithKli, setLtvPercentageWithKli] = useState(null);
  const [ltvPercentageWithoutKli, setLtvPercentageWithoutKli] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [closeEdit, setCloseEdit] = useState(false);
  const flag = React.useRef(true);

  const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

  const editClick = () => {
    setEditFlag(true);
  };

  const cancelClick = () => {
    setEditFlag(false);
  };

  useEffect(() => {
    calcDownPayment();

    setTenure(data?.tenure_requested);
    setAmount(data?.amt_requested);
    setRoi(data?.rateOfInterest);

    // get Loan Details
    (async () => {
      setLoader(true);
      const response = await getLoanDetails({
        applicantUniqueId: props?.id,
        branch: props?.soleFlag.branchName,
      });
      setData(response?.data?.data);
      setLoader(false);
    })();
  }, []);

  useEffect(() => {
    if (flag.current && data?.amt_requested && data?.onRoadPrice) {
      let loanAmt = parseInt(data?.onRoadPrice) - parseInt(data?.amt_requested);
      setDownpayment(parseInt(loanAmt));

      flag.current = false;
    }
  }, [data?.amt_requested, data?.onRoadPrice]);

  // EMI Calculation ----------------->

  useEffect(() => {
    setTenure(data?.tenure_requested);
    setAmount(data?.amt_requested);
    setRoi(data?.rateOfInterest);

    //---Emi Calculation for even months-----/->
    if (data?.tenure_requested % 2 === 0) {
      let a = (data?.amt_requested / 100) * data?.rateOfInterest;
      let b = data?.tenure_requested / 12;
      let c = parseFloat(data?.amt_requested) + parseFloat(a * b);
      let emi = c / data?.tenure_requested;
      emi = emi.toFixed(2);
      setEmi(emi);
    }
    //---Emi Calculation for odd months------/->
    else {
      let emi =
        (parseFloat(data?.amt_requested) +
          parseFloat(data?.amt_requested) *
            (parseFloat(data?.rateOfInterest) / 100) *
            ((parseFloat(data?.tenure_requested) + 1) / 12)) /
        parseFloat(data?.tenure_requested);
      setEmi(emi);
    }
  }, [data?.amt_requested, data?.rateOfInterest, data?.tenure_requested]);

  useEffect(() => {
    if (tenure % 2 === 0) {
      let a = (amount / 100) * roi;
      let b = tenure / 12;
      let c = parseFloat(amount) + parseFloat(a * b);
      let emi = c / tenure;
      emi = emi.toFixed(2);
      setEmi(emi);
    }
    //---Emi Calculation for odd months------/->
    else {
      let emi =
        (parseFloat(amount) +
          parseFloat(amount) *
            (parseFloat(roi) / 100) *
            ((parseFloat(tenure) + 1) / 12)) /
        parseFloat(tenure);
      setEmi(emi);
    }
  }, [amount, tenure, roi]);

  useEffect(() => {
    (async () => {
      if (data?.isPremiumamount) {
        let para1 = amount / data?.onRoadPrice;
        let ltv1 = para1 * 100;
        let para2 = parseFloat(amount) - parseFloat(data?.premiumAmount);
        let para3 = parseFloat(data?.onRoadPrice);

        let ltv2 = (para2 / para3) * 100;
        setLtvPercentageWithKli(parseFloat(ltv1?.toFixed(2)));
        setLtvPercentageWithoutKli(parseFloat(ltv2?.toFixed(2)));
      } else {
        let para1 = amount / data?.onRoadPrice;
        let ltv = para1 * 100;
        setLtvPercentageWithoutKli(parseFloat(ltv?.toFixed(2)));
      }
    })();
  }, [amount, data?.premiumAmount, data?.isPremiumamount, data?.onRoadPrice]);

  React.useEffect(() => {
    if (data?.isPremiumamount && data?.amt_requested && data?.premiumAmount) {
      let amt =
        parseFloat(data?.amt_requested) - parseFloat(data?.premiumAmount);
      setAmountCalculated(amt);
    }
  }, [data?.amt_requested, data?.premiumAmount, data?.isPremiumamount]);

  // calculate down payment
  const calcDownPayment = (value = 0) => {
    let amtCalc;
    if (value > 0) {
      let loanAmt = parseInt(data?.onRoadPrice) - parseInt(value);
      setDownpayment(parseInt(loanAmt));
    }
  };

  const handleEmiCalc = (e = null, value = null) => {
    if (value == 'amt') {
      setAmount(e.target.value);
      calcDownPayment(e.target.value);
    } else if (value === 'tenure') {
      setTenure(e.target.value);
    } else {
      setRoi(e.target.value);
    }
  };

  const saveLoanDetail = async (values) => {
    const response = await saveLoanDetails({
      applicantUniqueId: props?.id,
      amount: amount,
      tenure: tenure,
      rateOfInterest: roi,
      emi: Math.ceil(emi),
      downPayment: downPayment,
      ltvPercentageWithKli,
      ltvPercentageWithoutKli,
      ...values,
    });

    if (!response?.data?.error) {
      setCloseEdit(true);

      (async () => {
        setLoader(true);
        const response = await getLoanDetails({
          applicantUniqueId: props?.id,
          branch: props?.soleFlag.branchName,
        });
        setData(response?.data?.data);
        setLoader(false);
        setShowInput(false);
      })();
    }
  };

  const onSaveLoanDetails = async () => {
    setLoader(true);

    const response = await saveLoanDetails({
      applicantUniqueId: props?.id,
      amount: amount,
      tenure: tenure,
      rateOfInterest: roi,
      emi: Math.ceil(emi),
      downPayment: downPayment,
      ltvPercentageWithKli,
      ltvPercentageWithoutKli,
    });

    if (!response?.data?.error) {
      const res = await createCustomer({
        applicant_uniqueid: props?.id,
        isguarantor: false,
        ismainapplicant: true,
      });
    }
    setLoader(false);
    props?.getData();
    (async () => {
      const response = await getLoanDetails({
        applicantUniqueId: props?.id,
        branch: props?.soleFlag.branchName,
      });
      setData(response?.data?.data);
    })();
    setTimeout(() => {
      setEditFlag(false);
    }, 600);
  };

  return (
    <Spin spinning={loader}>
      <Row>
        <Col lg={20}>
          <b>Loan Details</b>
        </Col>
        {/* {!(props?.caseFreeze || props?.userFreeze) && (
          <Col span={4}>
            <EditOutlined
              style={{ fontSize: 20 }}
              onClick={() => setShowInput(true)}
            />
          </Col>
        )} */}
        <br />
        <br />
      </Row>
      {showInput ? (
        <LoanDetailsEdit
          data={data}
          tenure={tenure}
          rateOfInterest={roi}
          emi={Math.ceil(emi)}
          downPayment={downPayment}
          ltvPercentageWithKli
          ltvPercentageWithoutKli
          saveLoanDetail={saveLoanDetail}
          closeEdit={closeEdit}
          caseSummaryData={props?.caseSummaryData}
          setAmount={setAmount}
          calcDownPayment={calcDownPayment}
          amount={amountCalculated}
        />
      ) : (
        <>
          {' '}
          <Row gutter={[32, 8]}>
            <Col lg={8}>
              <Label label='Vehicle Type' value={data?.vehicle_type} />
            </Col>
            <Col lg={8}>
              <Label label='Vehicle Brand' value={data?.brand_nm} />
            </Col>
            <Col lg={8}>
              <Label label='Vehicle Model' value={data?.model} />
            </Col>
            <Col lg={8}>
              <Label label='Vehicle Sub Model' value={data?.submodel} />
            </Col>
            <Col lg={8}>
              <Label label='Dealer' value={data?.dealer_name} />
            </Col>
            <Col lg={8}>
              <Label label='Sub Dealer' value={data?.subDealerName} />
            </Col>
            <Col lg={8}>
              <Label label='Dealer Charges' value={data?.dealerCharges} />
            </Col>
            <Col lg={8}>
              <Label
                label='Processing Fees'
                value={
                  data?.pfAmountType?.toLowerCase() === 'number'
                    ? `${data?.processingFees}`
                    : `${data?.processingFees}`
                }
              />
            </Col>
            <Col lg={8}>
              <Label label='Buraeu Charges' value={data?.bureauCharges} />
            </Col>
            <Col lg={8}>
              <Label label='Other Charges' value={data?.otherCharges} />
            </Col>
            <Col lg={8}>
              <Label label='Start Date' value={data?.startDate} />
            </Col>
            <Col lg={8}>
              <Label label='End Date' value={data?.endDate} />
            </Col>
            <Col lg={8}>
              <Label label='Scheme Name' value={data?.schemeName} />
            </Col>
            <Col lg={8}>
              <Label label='PF Amount Type' value={data?.pfAmountType} />
            </Col>
            <Col lg={8}>
              <Label label='Scheme Code' value={data?.schemeCode} />
            </Col>
            <Col lg={8}>
              {/* <Label label='LTV Percentage' value={data?.ltvPercentage} /> */}
              {data && data.ltvPercentage !== undefined && (
                <Label
                  label='LTV Percentage'
                  value={data.ltvPercentage.toFixed(2)}
                />
              )}
            </Col>
            <Col lg={8}>
              <Label label='Number of units' value={data?.unit} />
            </Col>
            <Col lg={8}>
              <Label label='Upfront amount' value={data?.upfrontAmount} />
            </Col>
            <Col lg={8}>
              <Label label='Vehicle Cost' value={data?.costOfVehicle} />
            </Col>
          </Row>
          <br />
          <b>Loan Protect Insurance</b>
          <br />
          <Row>
            <Col lg={8}>
              <Label
                label='Is Life Insurance taken?'
                value={data?.islifeInsurance ? 'Yes' : 'No'}
              />
            </Col>
            <Col lg={8}>
              <Label label='Premium Amount' value={data?.premiumAmount} />
            </Col>
            <Col lg={8}>
              <Label
                label='Premium Amount to be added to loan amount?'
                value={data?.isPremiumamount ? 'Yes' : 'No'}
              />
            </Col>
            <Col lg={8}>
              <Label label='Name' value={data?.name} />
            </Col>
            <Col lg={8}>
              <Label label='Relation' value={data?.relationType} />
            </Col>
            <Col lg={8}>
              <Label label='Date of Birth' value={data?.dateOfBirth} />
            </Col>
            <Col lg={8}>
              <Label label='Address' value={data?.address} />
            </Col>
          </Row>
        </>
      )}

      <Row>
        {!editFlag && (
          <>
            <Col span={18}></Col>
            <Col lg={6}>
              {/* {!(userFreeze || caseFreeze) && (
                <Button
                  className="reset-button"
                  onClick={() => {
                    editClick();
                  }}
                >
                  Edit
                </Button>
              )} */}
            </Col>
          </>
        )}
      </Row>
      {editFlag && (
        <Row gutter={[30, 30]}>
          <Col lg={16}></Col>
          <Col lg={3}>
            <Button className='save-button' onClick={onSaveLoanDetails}>
              Submit
            </Button>
          </Col>
          <Col lg={3}>
            <Button
              className='reset-button'
              onClick={() => {
                cancelClick();
              }}
            >
              Cancel
            </Button>
          </Col>
          <Col lg={8}>
            <InputText
              label={'Amount Required'}
              type={'number'}
              defaultValue={data?.amt_requested}
              onChange={(e) => handleEmiCalc(e, 'amt')}
            />
          </Col>
          <Col lg={8}>
            <InputText
              label={'Tenure Required'}
              type={'number'}
              defaultValue={tenure}
              onChange={(e) => handleEmiCalc(e, 'tenure')}
            />
          </Col>
          <Col lg={8}>
            <InputText
              label={'ROI Required'}
              type={'number'}
              defaultValue={data?.rateOfInterest}
              onChange={(e) => handleEmiCalc(e, 'roi')}
            />
          </Col>
        </Row>
      )}
      <br />
      <Row>
        {!editFlag && (
          <>
            <Col lg={8}>
              <Label label='Amount Required' value={amount} />
            </Col>
            <Col lg={8}>
              <Label label='Tenure Required' value={tenure} />
            </Col>
            <Col lg={8}>
              <Label label='ROI Required' value={data?.rateOfInterest} />
            </Col>
          </>
        )}
        <Col lg={8}>
          <Label label='EMI' value={Math.ceil(data?.emi)} />
        </Col>

        <Col lg={8}>
          <Label label='On Road Price' value={data?.onRoadPrice || ''} />
        </Col>
        <Col lg={8}>
          {/* <Label label='Downpayment' value={downPayment || ''} /> */}
          <Label label='Downpayment' value={data?.downPayment || ''} />
        </Col>
        {data?.loanProtactionInsuranceAmt && (
          <Col lg={8}>
            <Label
              label='Loan Suraksha'
              value={data?.loanProtactionInsuranceAmt || ''}
            />
          </Col>
        )}
        {data?.insuranceAmount && (
          <Col lg={8}>
            <Label
              label='Insurance Amount'
              value={data?.insuranceAmount || ''}
            />
          </Col>
        )}
      </Row>
      <Row>
        {data?.isPremiumamount && (
          <Col lg={8}>
            <Label
              label='LTV with KLI'
              value={ltvPercentageWithKli || data?.ltvPercentageWithKli || ''}
            />
          </Col>
        )}
        <Col lg={8}>
          <Label
            label='LTV without KLI'
            value={
              ltvPercentageWithoutKli || data?.ltvPercentageWithoutKli || ''
            }
          />
        </Col>
      </Row>
    </Spin>
  );
}

export default LoanDetails;
