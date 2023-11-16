import React from 'react';
import { Col, Row, Button, Form } from 'antd';
import InputText from '../../Components/Input';
import Label from '../../Components/label';
import {
  getDisbursmentAmount,
  saveDisbursmentAmount,
} from '../../Redux/Services/documentUpload';
import Spin from '../../Components/Spin';
import './index.scss';

function DisbursementAmount(props) {
  // const [disbsData, setDisbsData] = React.useState(null);
  const [sanctionedAmt, setSanctionedAmt] = React.useState('');
  const [aboveCharges, setAboveCharges] = React.useState('');
  const [disbursedAmount, setDisbursedAmount] = React.useState('');
  const [typePayout, setTypePayout] = React.useState('number');
  const [payout, setPayout] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [isPremiumSelected, setIsPremiumSelected] = React.useState(false);
  const [adminFees, setAdminFees] = React.useState(0);
  const [dealerSubvention, setDealerSubvention] = React.useState(0);
  const [bureauCharges, setBureauCharges] = React.useState(0);
  const [convenienceCharges, setConvenienceCharges] = React.useState(0);
  const [dealerCharges, setDealerCharges] = React.useState(0);
  const [nachCharges, setNachCharges] = React.useState(0);
  const [otherCharges, setOtherCharges] = React.useState(0);
  const [pddCharges, setPddCharges] = React.useState(0);
  const [kliCharges, setKliCharges] = React.useState(0);
  const [preEmi, setPreEmi] = React.useState(0);
  const [dealerPayout, setDealerPayout] = React.useState(0);
  const [stampDuty, setStampDuty] = React.useState(0);
  const [ltvPercentage, setLtvPercentage] = React.useState(0);
  const [processingFees, setProcessingFees] = React.useState(0);
  const [pfAmountType, setPfAmountType] = React.useState('Number');
  const [flag, setFlag] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [form] = Form.useForm();
  const { disbsData, setDisbsData } = props;

  const userFreeze =
    props.caseSummaryData?.modelAccess &&
    props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze =
    props.caseSummaryData?.mainapplicant &&
    props.caseSummaryData?.mainapplicant[0]?.disbursementFreeze;

  const onFinish = (values) => {
    saveDisbursmentAmount({
      ...values,
      disbursedAmount: disbursedAmount,
      totalCharges: aboveCharges,
      applicantUniqueId: props.match.params.id,
      isPremiumamount: flag,
    });
  };

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields) {
      if (changedFields.dealerPayouttype) {
        form?.resetFields(['dealerPayout']);
        setTypePayout(changedFields.dealerPayouttype);
      }

      if (changedFields?.premiumAmount) {
        setKliCharges(changedFields?.premiumAmount);
      }
      let total =
        parseFloat(allFields.adminFees) +
        parseFloat(allFields.bureauCharges) +
        parseFloat(allFields.convenienceCharges) +
        parseFloat(allFields.dealerCharges) +
        parseFloat(allFields.dealerSubvention) +
        parseFloat(allFields.nachCharges) +
        parseFloat(allFields.otherCharges) +
        parseFloat(allFields.pddCharges) +
        parseFloat(allFields.stampDuty) +
        parseFloat(allFields.premiumAmount) +
        parseFloat(allFields.preEmi);
      // +parseFloat(allFields.deliquencyFund);

      if (allFields?.processingFees) {
        if (allFields?.pfAmountType === 'Number') {
          total = total + parseFloat(allFields?.processingFees);
        }
        if (allFields?.pfAmountType === 'Percent') {
          total =
            total +
            parseFloat(allFields?.processingFees) *
              0.01 *
              parseFloat(sanctionedAmt);
        }
      }

      setTotal(total + total);
      setAboveCharges(total);
      let disbursedAmount = parseFloat(sanctionedAmt) - total;
      setDisbursedAmount(disbursedAmount);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (parseFloat(kliCharges) > 0) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [kliCharges]);

  const getData = async () => {
    setLoader(true);
    const response = await getDisbursmentAmount({
      applicantUniqueId: props.match.params.id,
    });
    console.log(response, 'res');

    setLoader(false);
    setIsPremiumSelected(response?.isPremiumamount);
    setDisbsData(response);
    setDealerSubvention(parseFloat(response?.dealerSubvention));
    setAdminFees(parseFloat(response?.adminFees));
    setNachCharges(parseFloat(response?.nachCharges));
    setKliCharges(parseFloat(response?.premiumAmount));
    setConvenienceCharges(parseFloat(response?.convenienceCharges));
    setPddCharges(parseFloat(response?.pddCharges));
    setBureauCharges(parseFloat(response?.bureauCharges));
    setDealerCharges(parseFloat(response?.dealerCharges));
    setStampDuty(parseFloat(response?.stampDuty));
    setProcessingFees(parseFloat(response?.processingFees));
    setPreEmi(parseFloat(response?.preEmi));
    setOtherCharges(parseFloat(response?.otherCharges));
    setSanctionedAmt(response?.amt_requested);
    setAboveCharges(response?.totalCharges);
    setDisbursedAmount(response?.disbursedAmount);
    setTypePayout(response?.dealerPayouttype);
    setLtvPercentage(response?.ltvPercentage);
    setPfAmountType(response?.pfAmountType);
    setFlag(response?.isPremiumamount);
    form.setFieldsValue({
      dealerSubvention: response?.dealerSubvention || 0,
      adminFees: response?.adminFees || 0,
      nachCharges: response?.nachCharges || 0,
      processingFees: response?.processingFees || 0,
      preEmi: response?.preEmi || 0,
      premiumAmount: response?.premiumAmount || 0,
      pddCharges: response?.pddCharges || 0,
      bureauCharges: response?.bureauCharges || 0,
      stampDuty: response?.stampDuty || 0,
      dealerCharges: response?.dealerCharges || 0,
      dealerPayout: response?.dealerPayout || 0,
      dealerPayouttype: response?.dealerPayouttype || 0,
      convenienceCharges: response?.convenienceCharges || 0,
      otherCharges: response?.otherCharges || 0,
      amt_requested: sanctionedAmt || 0,
      disbursedAmount: disbursedAmount || 0,
      dealerPayouttype: response?.dealerPayouttype || 0,
      ltvPercentage: response?.ltvPercentage || 0,
      pfAmountType: response?.pfAmountType || 0,
      // deliquencyFund: response?.deliquencyFund || 0,
    });

    let total;
    if (response?.pfAmountType === 'Number') {
      total = total + parseFloat(processingFees);
    }
    if (response?.pfAmountType === 'Percent') {
      total = total + parseFloat(processingFees) * 0.01;
    }

    setTotal(total + total);
  };

  // Amount less than check

  // FOR PF -------------------------------------------------
  const checkPF = (_, value) => {
    let pfAmount = disbsData?.pfAmountMaster || 0;

    if (
      parseFloat(value) > parseFloat(pfAmount) ||
      parseFloat(value) === parseFloat(pfAmount)
    ) {
      return Promise.resolve();
    }

    return Promise.reject(
      new Error(`Processing Fee must be greater than ${parseInt(pfAmount)}`)
    );
  };

  const allowPF = (_, value) => {
    return Promise.resolve();
  };

  React?.useEffect(() => {}, [disbsData]);
  // for nach------------------------------------------------

  const checkNach = (_, value) => {
    let nachAmount = disbsData?.nachChargesMaster || 0;
    if (
      parseInt(value) > parseInt(nachAmount) ||
      parseInt(value) === parseInt(nachAmount)
    ) {
      return Promise.resolve();
    }

    return Promise.reject(
      new Error(`Nach Charges must be greater than ${parseInt(nachAmount)}`)
    );
  };

  // for stamp

  const checkStamp = (_, value) => {
    let stampAmount = disbsData?.stampDutyMaster || 0;
    if (
      parseInt(value) > parseInt(stampAmount) ||
      parseInt(value) === parseInt(stampAmount)
    ) {
      return Promise.resolve();
    }

    return Promise.reject(
      new Error(`Stamp Charges must be greater than ${parseInt(stampAmount)}`)
    );
  };

  // -----------------------------------------------------------------

  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  const checkDealerPayout = (_, value) => {
    if (parseFloat(value) <= disbursedAmount) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error('Dealer Payout should not be greater than Disbursed Amount.')
    );
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          name='basic'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          form={form}
          onValuesChange={handleFormChange}
        >
          <Row gutter={40}>
            <Col lg={24}>
              <br />
            </Col>
            <Col lg={8}>
              <Form.Item
                name='dealerSubvention'
                rules={[
                  {
                    required: true,
                    message: 'Dealer Subvention is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Dealer Subvention'}
                  value={disbsData?.dealerSubvention}
                  defaultValue={dealerSubvention?.toString()}
                  key={disbsData?.dealerSubvention}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name='adminFees'
                rules={[
                  {
                    required: true,
                    message: 'Admin Fees is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Admin Fees'}
                  value={disbsData?.adminFees}
                  defaultValue={adminFees?.toString()}
                  key={disbsData?.adminFees}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name='nachCharges'
                rules={[
                  {
                    required: true,
                    message: 'Nach Charges is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Nach Charges'}
                  value={disbsData?.nachCharges}
                  defaultValue={nachCharges?.toString()}
                  key={disbsData?.nachCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='processingFees'
                rules={[
                  {
                    required: true,
                    message: 'Processing Fees is mandatory',
                  },
                  {
                    validator:
                      pfAmountType?.toLowerCase() === 'number'
                        ? allowPF
                        : checkPF,
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Processing Fees'}
                  value={disbsData?.processingFees}
                  defaultValue={processingFees?.toString()}
                  key={disbsData?.processingFees}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='pfAmountType'
                rules={[
                  {
                    required: true,
                    message: 'Processing Fee Type is mandatory',
                  },
                ]}
              >
                <InputText
                  disabled={userFreeze || caseFreeze}
                  label='Type'
                  // value={pfAmountType}
                  // key={disbsData?.pfAmountType}
                  onChange={(e) => setPfAmountType(e.target.value)}
                  type={'dropdown'}
                  options={[
                    {
                      label: 'Percent',
                      value: 'Percent',
                    },
                    {
                      label: 'Number',
                      value: 'Number',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='preEmi'
                rules={[
                  {
                    required: true,
                    message: 'Pre EMI Amount is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Pre EMI'}
                  value={disbsData?.preEmi}
                  defaultValue={preEmi?.toString()}
                  key={disbsData?.preEmi}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='premiumAmount'
                rules={[
                  {
                    required: false,
                    message: 'KLI Charges is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'KLI charges / Hospicash'}
                  value={disbsData?.premiumAmount}
                  defaultValue={kliCharges?.toString()}
                  key={disbsData?.premiumAmount}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='convenienceCharges'
                rules={[
                  {
                    required: true,
                    message: 'Convenience Charges is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Convenience Charges'}
                  value={disbsData?.convenienceCharges}
                  defaultValue={convenienceCharges?.toString()}
                  key={disbsData?.convenienceCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='pddCharges'
                rules={[
                  {
                    required: true,
                    message: 'PDD Charges is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'PDD Charges'}
                  value={disbsData?.pddCharges}
                  defaultValue={pddCharges?.toString()}
                  key={disbsData?.pddCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='bureauCharges'
                rules={[
                  {
                    required: true,
                    message: 'Bureau Charges is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Bureau Charges'}
                  value={disbsData?.bureauCharges}
                  defaultValue={bureauCharges?.toString()}
                  key={disbsData?.bureauCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='stampDuty'
                rules={[
                  {
                    required: true,
                    message: 'Stamp Duty Amount is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Stamp Duty'}
                  value={disbsData?.stampDuty}
                  defaultValue={stampDuty?.toString()}
                  key={disbsData?.stampDuty}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item
                name='dealerCharges'
                rules={[
                  {
                    required: true,
                    message: 'Dealer Charges is mandatory',
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Dealer Charges'}
                  value={disbsData?.dealerCharges}
                  defaultValue={dealerCharges?.toString()}
                  key={disbsData?.dealerCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop'>
              <Form.Item name='otherCharges'>
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Other Charges'}
                  value={disbsData?.otherCharges}
                  defaultValue={otherCharges?.toString()}
                  key={disbsData?.otherCharges}
                />
              </Form.Item>
            </Col>{' '}
            <Col lg={8} className='inputTextTop'>
              <Form.Item name='downPayment'>
                <InputText
                  readOnly={true}
                  label={'Down Payment'}
                  value={disbsData?.downPayment?.toString() || 0}
                  defaultValue={disbsData?.downPayment?.toString() || 0}
                  key={disbsData?.downPayment}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className='inputTextTop' style={{ display: 'none' }}>
              <Form.Item name='deliquencyFund'>
                <InputText
                  readOnly={true}
                  label={'Deliquency Fund'}
                  value={disbsData?.deliquencyFund?.toString() || 0}
                  defaultValue={disbsData?.deliquencyFund?.toString() || 0}
                  key={disbsData?.deliquencyFund}
                />
              </Form.Item>
            </Col>{' '}
            {/* <Col lg={8} className="inputTextTop">
              <Form.Item name="gapIneterst">
                <InputText
                  readOnly={true}
                  label={"Gap Interest"}
                  value={disbsData?.gapIneterst?.toString() || 0}
                  defaultValue={disbsData?.gapIneterst?.toString() || 0}
                  key={disbsData?.gapIneterst}
                />
              </Form.Item>
            </Col> */}
          </Row>

          <Row className='inputTextTop'>
            <Col lg={8}>
              <Label label='Sanctioned Loan Amount' />
            </Col>
            <Col lg={8}></Col>
            <Col lg={8} className='amountWrapper'>
              ₹ {sanctionedAmt}
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              <Label label='Less Above Charges' />
            </Col>
            <Col lg={8}></Col>
            <Col lg={8} className='amountWrapper'>
              ₹{' '}
              {pfAmountType?.toLowerCase() === 'number'
                ? aboveCharges
                : Math.round(aboveCharges)}
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Label label='Amount to be disbursed' />
            </Col>
            <Col lg={8}></Col>
            <Col lg={8} className='amountWrapper'>
              ₹{' '}
              {pfAmountType?.toLowerCase() === 'number'
                ? disbursedAmount
                : Math.round(disbursedAmount)}
            </Col>
          </Row>

          <Row gutter={40}>
            <Col lg={7}>
              <Form.Item
                name='dealerPayout'
                rules={[
                  {
                    required: true,
                    message: 'Dealer Payout is mandatory',
                  },
                  // {
                  //   pattern:
                  //     typePayout === "percent"
                  //       ? new RegExp(/^(100|([0-9][0-9]?(\.[0-9]+)?))$/)
                  //       : new RegExp(/^[^.]*$/),
                  //   message:
                  //     typePayout === "percent"
                  //       ? "Invalid Percent Input"
                  //       : "Invalid Number Input",
                  // },
                  {
                    validator: checkDealerPayout,
                  },
                ]}
              >
                <InputText
                  readOnly={userFreeze || caseFreeze}
                  label={'Dealer Payout'}
                  type={'number'}
                  key={disbsData?.dealerPayout}
                  value={disbsData?.dealerPayout}
                  onInput={(e) => {
                    e.target.value =
                      typePayout == 'percent'
                        ? e.target.value.toString()
                          ? e.target.value.toString().slice(0, 5)
                          : e.target.value
                              .toString()
                              .slice(0, e.target.value.length - 1)
                        : e.target.value.toString();
                  }}
                  onKeyDown={(e) =>
                    typePayout.toLowerCase() === 'number' &&
                    (e.keyCode === 110 || e.keyCode === 190) &&
                    e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>

            <Col lg={8}>
              <Form.Item
                name={'dealerPayouttype'}
                rules={[
                  {
                    required: true,
                    message: 'Dealer Payout Type is mandatory',
                  },
                ]}
              >
                <InputText
                  disabled={userFreeze || caseFreeze}
                  label='Type'
                  value={typePayout}
                  key={disbsData?.dealerPayouttype}
                  type={'dropdown'}
                  options={[
                    {
                      label: 'Percent',
                      value: 'percent',
                    },
                    {
                      label: 'Number',
                      value: 'number',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row type={'flex'} justify={'center'}>
            <Button className={'reset-button'} htmlType={'submit'}>
              Save
            </Button>
          </Row>
        </Form>
      </Spin>
    </>
  );
}

export default DisbursementAmount;
