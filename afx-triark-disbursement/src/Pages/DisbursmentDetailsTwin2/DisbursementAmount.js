import React, { useEffect } from "react";
import { Col, Row, Button, Form } from "antd";
import InputText from "../../Components/Input";
import Label from "../../Components/label";
import {
  getDisbursementAmountDetailsTwin2,
  saveDisbursementAmountDetailsTwin2,
} from "../../Redux/Services/disbursementModeTwin2";
import Spin from "../../Components/Spin";
import "./index.scss";

function DisbursementAmount(props) {
  const [disbsData, setDisbsData] = React.useState(null);
  const [sanctionedAmt, setSanctionedAmt] = React.useState("");
  const [aboveCharges, setAboveCharges] = React.useState("");
  const [disbursedAmount, setDisbursedAmount] = React.useState("");
  const [typePayout, setTypePayout] = React.useState("Number");
  const [payout, setPayout] = React.useState("");
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
  const [processingFees, setProcessingFees] = React.useState(0);
  const [pfAmountType, setPfAmountType] = React.useState("Number");
  const [flag, setFlag] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    await saveDisbursementAmountDetailsTwin2({
      gupshupRequestId: props?.match?.match.params.id,
      bureauCharges: parseFloat(values.bureauCharges),
     
      kliCharges: parseFloat(values.premiumAmount),
      otherCharges: parseFloat(values.otherCharges),
      processingFees: parseFloat(values?.processingFees),
      nachCharges: parseFloat(values.nachCharges),
      preEmi: parseFloat(values.preEmi),
      type: values?.pfAmountType,
      convenieneceCharges: parseFloat(values.convenienceCharges),
      loanAmount: sanctionedAmt,
      stampDuty: parseFloat(values.stampDuty),
      dealerCharges: parseFloat(values.dealerCharges),
      dealerSbvention: parseFloat(values.dealerSubvention),
      pddCharges: parseFloat(values.pddCharges),
      downPayment: disbsData?.downPayment,
      adminFees: parseFloat(values.adminFees),
      dealerPayout: parseFloat(values.dealerPayout),
      dealerPayoutType: values.dealerPayouttype,
      disbursedAmount: disbursedAmount,
    });
    getData();
  };

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields) {
      if (changedFields.dealerPayouttype) {
        form?.resetFields(["dealerPayout"]);
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
        parseFloat(allFields.preEmi) 

      if (allFields?.processingFees) {
        if (allFields?.pfAmountType === "Number") {
          total = total + parseFloat(allFields?.processingFees);
        }
        if (allFields?.pfAmountType === "Percent") {
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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (parseFloat(kliCharges) > 0) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [kliCharges]);

  const getData = async () => {
    setLoader(true);
    const response = await getDisbursementAmountDetailsTwin2({
      gupdhupId: props.match.match.params.id,
    });
    setLoader(false);
    setDisbsData(response);
    setIsPremiumSelected(response?.isPremiumamount);
    setDealerSubvention(parseFloat(response?.dealerSbvention));
    setAdminFees(parseFloat(response?.adminFees));
    setNachCharges(parseFloat(response?.nachCharges));
    setKliCharges(parseFloat(response?.kliCharges));
    setConvenienceCharges(parseFloat(response?.convenieneceCharges));
    setPddCharges(parseFloat(response?.pddCharges));
    setBureauCharges(parseFloat(response?.bureauCharges));
    setDealerCharges(parseFloat(response?.dealerCharges));
    setStampDuty(parseFloat(response?.stampDuty));
    setProcessingFees(parseFloat(response?.processingFees));
    setPreEmi(parseFloat(response?.preEmi));
    setOtherCharges(parseFloat(response?.otherCharges));
    setSanctionedAmt(response?.loanAmount);
    setAboveCharges(response?.totalCharges);
    setTypePayout(response?.dealerPayoutType);
    setPfAmountType(response?.type);
    setFlag(response?.isPremiumamount);
    
    form.setFieldsValue({
      dealerSubvention: response?.dealerSbvention,
      adminFees: response?.adminFees,
      nachCharges: response?.nachCharges,
      processingFees: response?.processingFees,
      preEmi: response?.preEmi,
      premiumAmount: response?.kliCharges,
      pddCharges: response?.pddCharges,
      bureauCharges: response?.bureauCharges,
      stampDuty: response?.stampDuty,
      dealerCharges: response?.dealerCharges,
      dealerPayout: response?.dealerPayout,
      dealerPayouttype: response?.dealerPayoutType,
      convenienceCharges: response?.convenieneceCharges,
      otherCharges: response?.otherCharges,
      amt_requested: sanctionedAmt,
      ltvPercentage: response?.ltvPercentage,
      pfAmountType: response?.type,
     
    });
   
    let total =
      parseFloat(response?.adminFees) +
      parseFloat(response?.bureauCharges) +
      parseFloat(response?.convenieneceCharges) +
      parseFloat(response?.dealerCharges) +
      parseFloat(response?.dealerSbvention) +
      parseFloat(response?.pddCharges) +
      parseFloat(response?.nachCharges) +
      parseFloat(response?.otherCharges) +
      parseFloat(response?.stampDuty) +
      parseFloat(response?.kliCharges) +
      parseFloat(response?.preEmi)
    if (!response?.type) {
      total =
        total +
        parseFloat(response?.processingFees);
    }
    if (response?.type === "Number") {
      total =
        total +
        parseFloat(response?.processingFees);
    }
    if (response?.type === "Percent") {
      total =
        total +
        parseFloat(
          response?.processingFees === 0 ? 0 : response?.processingFees
        ) *
        0.01;
    }

    setTotal(total + total);
    let disbursedAmount = parseFloat(response?.loanAmount) - total;
    setDisbursedAmount(disbursedAmount);
    setAboveCharges(total);
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

  useEffect(() => { }, [disbsData]);
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
  return (
    <>
      <Spin spinning={loader}>
        <Form
          name="basic"
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
                name="dealerSubvention"
                rules={[
                  {
                    required: true,
                    message: "Dealer Subvention is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"Dealer Subvention"}
                  value={disbsData?.dealerSubvention}
                  defaultValue={dealerSubvention?.toString()}
                  key={disbsData?.dealerSubvention}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name="adminFees"
                rules={[
                  {
                    required: true,
                    message: "Admin Fees is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"Admin Fees"}
                  value={disbsData?.adminFees}
                  defaultValue={adminFees?.toString()}
                  key={disbsData?.adminFees}
                />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item
                name="nachCharges"
                rules={[
                  {
                    required: true,
                    message: "Nach Charges is mandatory",
                  },
                  
                ]}
              >
                <InputText
                  label={"Nach Charges"}
                  value={disbsData?.nachCharges}
                  defaultValue={nachCharges?.toString()}
                  key={disbsData?.nachCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="processingFees"
                rules={[
                  {
                    required: true,
                    message: "Processing Fees is mandatory",
                  },
                  {
                    validator:
                      pfAmountType?.toLowerCase() === "number"
                        ? allowPF
                        : checkPF,
                  },
                ]}
              >
                <InputText
                  label={"Processing Fees"}
                  value={disbsData?.processingFees}
                  defaultValue={processingFees?.toString()}
                  key={disbsData?.processingFees}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="pfAmountType"
                rules={[
                  {
                    required: true,
                    message: "Processing Fee Type is mandatory",
                  },
                ]}
              >
                <InputText
                  label="Type"
                  value={pfAmountType}
                  key={disbsData?.pfAmountType}
                  onChange={(e) => {
                    setPfAmountType(e);
                  }}
                  type={"dropdown"}
                  options={[
                    {
                      label: "Percent",
                      value: "Percent",
                    },
                    {
                      label: "Number",
                      value: "Number",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="preEmi"
                rules={[
                  {
                    required: true,
                    message: "Pre EMI Amount is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"Pre EMI"}
                  value={disbsData?.preEmi}
                  defaultValue={preEmi?.toString()}
                  key={disbsData?.preEmi}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="premiumAmount"
                rules={[
                  {
                    required: false,
                    message: "KLI Charges is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"KLI charges / Hospicash"}
                  value={disbsData?.premiumAmount}
                  defaultValue={kliCharges?.toString()}
                  key={disbsData?.premiumAmount}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="convenienceCharges"
                rules={[
                  {
                    required: true,
                    message: "Convenience Charges is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"Convenience Charges"}
                  value={disbsData?.convenienceCharges}
                  defaultValue={convenienceCharges?.toString()}
                  key={disbsData?.convenienceCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="pddCharges"
                rules={[
                  {
                    required: true,
                    message: "PDD Charges is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"PDD Charges"}
                  value={disbsData?.pddCharges}
                  defaultValue={pddCharges?.toString()}
                  key={disbsData?.pddCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="bureauCharges"
                rules={[
                  {
                    required: true,
                    message: "Bureau Charges is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"Bureau Charges"}
                  value={disbsData?.bureauCharges}
                  defaultValue={bureauCharges?.toString()}
                  key={disbsData?.bureauCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="stampDuty"
                rules={[
                  {
                    required: true,
                    message: "Stamp Duty Amount is mandatory",
                  },
                  
                ]}
              >
                <InputText
                  label={"Stamp Duty"}
                  value={disbsData?.stampDuty}
                  defaultValue={stampDuty?.toString()}
                  key={disbsData?.stampDuty}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item
                name="dealerCharges"
                rules={[
                  {
                    required: true,
                    message: "Dealer Charges is mandatory",
                  },
                ]}
              >
                <InputText
                  label={"Dealer Charges"}
                  value={disbsData?.dealerCharges}
                  defaultValue={dealerCharges?.toString()}
                  key={disbsData?.dealerCharges}
                />
              </Form.Item>
            </Col>
            <Col lg={8} className="inputTextTop">
              <Form.Item name="otherCharges">
                <InputText
                  label={"Other Charges"}
                  value={disbsData?.otherCharges}
                  defaultValue={otherCharges?.toString()}
                  key={disbsData?.otherCharges}
                />
              </Form.Item>
            </Col>{" "}
            
            <Col lg={8} className="inputTextTop">
              <Form.Item name="downPayment">
                <InputText
                  readOnly={true}
                  label={"Down Payment"}
                  value={disbsData?.downPayment?.toString() || 0}
                  defaultValue={disbsData?.downPayment?.toString() || 0}
                  key={disbsData?.downPayment}
                />
              </Form.Item>
            </Col>{" "}
           
          </Row>

          <Row className="inputTextTop">
            <Col lg={8}>
              <Label label="Sanctioned Loan Amount" />
            </Col>
            <Col lg={8}></Col>
            <Col lg={8} className="amountWrapper">
              ₹ {parseFloat(sanctionedAmt).toLocaleString("en-IN", {
                style: "decimal",
                currency: "INR",
              })}
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              <Label label="Less Above Charges" />
            </Col>
            <Col lg={8}></Col>
            <Col lg={8} className="amountWrapper">
              ₹{" "}
              {pfAmountType?.toLowerCase() === "number"
                ? parseFloat(aboveCharges).toLocaleString("en-IN", {
                  style: "decimal",
                  currency: "INR",
                })
                : Math.round(aboveCharges).toLocaleString("en-IN", {
                  style: "decimal",
                  currency: "INR",
                })}
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Label label="Amount to be disbursed" />
            </Col>
            <Col lg={8}></Col>
            <Col lg={8} className="amountWrapper">
              ₹{" "}
              {pfAmountType?.toLowerCase() === "number"
                ? parseFloat(disbursedAmount).toLocaleString("en-IN", {
                  style: "decimal",
                  currency: "INR",
                })
                : Math.round(disbursedAmount).toLocaleString("en-IN", {
                  style: "decimal",
                  currency: "INR",
                })}
            </Col>
          </Row>

          <Row gutter={40}>

            <Col lg={8}>
              <Form.Item
                name={"dealerPayouttype"}
                rules={[
                  {
                    required: true,
                    message: "Dealer Payout Type is mandatory",
                  },
                ]}
              >
                <InputText
                  label="Type"
                  value={typePayout}
                  key={disbsData?.dealerPayoutType}
                  type={"dropdown"}
                  options={[
                    {
                      label: "Percent",
                      value: "Percent",
                    },
                    {
                      label: "Number",
                      value: "Number",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col lg={7}>
              <Form.Item
                name="dealerPayout"
                rules={[
                  {
                    required: true,
                    message: "Dealer Payout is mandatory",
                  },
                  {
                    pattern:
                      typePayout === "Percent"
                        ? new RegExp(/^(100|([0-9][0-9]?(\.[0-9]+)?))$/)
                        : new RegExp(/^[^.]*$/),
                    message:
                      typePayout === "Percent"
                        ? "Invalid Percent Input"
                        : "Invalid Number Input",
                  },
                ]}
              >
                <InputText
                  label={"Dealer Payout"}
                  type={"number"}
                  key={disbsData?.dealerPayout}
                  value={disbsData?.dealerPayout}
                  onInput={(e) => {
                    e.target.value =
                      typePayout == "Percent"
                        ? e.target.value.toString()
                          ? e.target.value.toString().slice(0, 5)
                          : e.target.value
                            .toString()
                            .slice(0, e.target.value.length - 1)
                        : e.target.value.toString();
                  }}
                  onKeyDown={(e) =>
                    typePayout.toLowerCase() === "Number" &&
                    (e.keyCode === 110 || e.keyCode === 190) &&
                    e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row type={"flex"} justify={"center"}>
            <Button className={"reset-button"} htmlType={"submit"}>
              Save
            </Button>
          </Row>
        </Form>
      </Spin>
    </>
  );
}

export default DisbursementAmount;
