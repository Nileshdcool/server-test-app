import React, { useState } from "react";
import { Form, Row, Col, DatePicker, Radio, Button } from "antd";
import InputText from "./../../Components/Input";
import {
  loanDetails,
  dealerList,
  getSchemeCode,
  schemeDetails,
  getLeadDetails,
} from "../../Redux/Services/Cases";
import moment from "moment";

const LoanDetailsEdit = ({
  data,
  ltvPercentageWithKli,
  ltvPercentageWithoutKli,
  saveLoanDetail,
  caseSummaryData,
  setAmount,
  amount,
  downPayment,
  calcDownPayment,
}) => {
  const [form] = Form.useForm();
  const [vehicleTypeDropdownList, setVehicleTypeDropdownList] = useState([]);
  const [vehicleBrandDropdownList, setVehicleBrandDropdownList] = useState([]);
  const [vehicleModelDropdownList, setVehicleModelDropdownList] = useState([]);
  const [vehicleSubModelDropdownList, setVehicleSubModelDropdownList] =
    useState([]);
  const [dealer, setDealer] = useState([]);
  const [schemeCode, setSchemeCode] = useState([]);
  const [schemeResponse, setSchemeResponse] = useState(null);
  const [showPremiumSection, setShowPremiumSection] = useState(null);
  const [pfType, setPfType] = useState("");
  const [branchName, setBranchName] = useState("");
  const dateFormat = "DD/MM/YYYY";
  const customFormat = (value) => `Start Date : ${value.format(dateFormat)}`;
  const customFormatEndDate = (value) =>
    `End Date : ${value.format(dateFormat)}`;
  const customFormatDOB = (value) =>
    `Date of Birth: ${value.format(dateFormat)}`;
  ;

  const userFreeze = caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze = caseSummaryData?.mainapplicant[0]?.creditFreeze;

  const onFinish = (values) => {
    if (values) {
      (async () => {
        const obj = {
          applicantUniqueId: data?.applicantUniqueid,
          "vehicletype":values?.vehicletype,
          vehiclebrand: values?.vehiclebrand,
          model: values?.model,
          submodel: values?.submodel,
          dealerName: values?.dealer,
          subDealerName: values?.subdealer,
          dealerCharges: values?.dealerCharges,
          processingFees: values?.pfAmount,
          bureauCharges: values?.bureauCharges,
          otherCharges: values?.otherCharges,
          startDate:
            form && form.getFieldValue("startDate")?.format("DD/MM/YYYY"),
          endDate: form && form.getFieldValue("endDate")?.format("DD/MM/YYYY"),
          scheme: values?.schemeName,
          pfAmountType: values?.pfAmountType,
          schemeCode: values?.schemeCode,
          ltvPercentage: values?.ltvPercentage,
          islifeInsurance: values?.islifeInsurance,
          premiumAmount: values?.premiumAmount,
          isPremiumamount: values?.isPremiumamount,
          name: values?.name,
          relationType: values?.relationType,
          dateOfBirth:
            form && form.getFieldValue("dateOfBirth")?.format("DD/MM/YYYY"),
          address: values?.address,
          costOfVehicle: values?.costOfVehicle
        };
        const response = await saveLoanDetail(obj);
        ;
      })();
    }
  };

  //getDropdown data
  const getDropdownData = async (values, type, setList, key) => {
    ;
    if (true) {
      const payload = {
        ...values,
        lead_code: data?.lead_code,
      };
      const response = await loanDetails(payload, type);
      ;
      if (response) {
        ;
        const list = response.map((item) => {
          return { label: item[key], value: item[key] };
        });

        setList(list);
      }
    }
  };

    const handleFormChange = (changedFields, allFields) => {
    ;
    const {
      vehicletype,
      vehiclebrand,
      model,
      submodel,
      dealer,
      schemeCode,
      pfAmountType,
      premiumAmount,
    } = changedFields;
    if (vehicletype) {
      getDropdownData(
        { vehicletype },
        "getvehiclebrandlist",
        setVehicleBrandDropdownList,
        "vehiclebrand"
      );
      form.resetFields(["vehiclebrand", "model", "submodel"]);
      setVehicleModelDropdownList([]);
      setVehicleSubModelDropdownList([]);
    }

    if (vehiclebrand) {
      ;

      getDropdownData(
        {
          vehiclebrand: allFields?.vehiclebrand,
          vehicletype: allFields?.vehicletype,
        },
        "getvehiclemodellist",
        setVehicleModelDropdownList,
        "model"
      );
      form.resetFields(["model", "submodel"]);
      setVehicleSubModelDropdownList([]);
    }

    if (model) {
      getDropdownData(
        {
          model: allFields?.model,
          vehiclebrand: allFields?.vehiclebrand,
          vehicletype: allFields?.vehicletype,
        },
        "getvehiclesubmodellist",
        setVehicleSubModelDropdownList,
        "submodel"
      );
      form.resetFields(["submodel"]);
    }
    if (submodel) {
      ;
      dealerList({
        branchName: branchName,
      }).then((re) => {
        ;
        if (re) {
          let finalResult = re.map((re) => {
            return { label: re.dealer_name, value: re.dealer_name };
          });
          ;
          setDealer(finalResult);
        }
      });
    }
    if (dealer) {
      (async () => {
        const res = await getSchemeCode({
          dealerName: "ALL",
          location: branchName,
        });
        let finalResult = await res?.map((re) => {
          return { label: re?.schemeCode, value: re?.schemeCode };
        });
        setSchemeCode(finalResult);
        ;
      })();
    }

    if (schemeCode) {
      (async () => {
        const response = await schemeDetails({
          dealerName: "ALL",
          location: branchName,
          schemeCode: allFields?.schemeCode,
          applicantUniqueId: data?.applicantUniqueid,
        });
        setSchemeResponse(response);
        form &&
          form.setFieldsValue({
            preEmi: response?.preEmiChanrges,
            ltvPercentage: response?.ltv,
            pddCharges: response?.pdd,
            processingFees: response?.pfAmount,
            pfAmountType: response?.pfAmountType,
            nachCharges: response?.nachCharges,
            dealerSubvention: response?.dealerSubvention,
            bureauCharges: response?.bureauCharges,
            otherCharges: response?.anyOtherCharges,
            premiumAmount: response?.klpiBracket,
            startDate: moment(response?.startDate, "DD/MM/YYYY"),
            endDate: moment(response?.endDate, "DD/MM/YYYY"),
            schemeName: response?.schemeName,
            costOfVehicle: response?.costOfVehicle
          });
      })();
    }

    if (allFields?.islifeInsurance) {
      setShowPremiumSection(allFields?.islifeInsurance);
    } else {
      setShowPremiumSection(allFields?.islifeInsurance);
    }

    if (changedFields?.pfAmountType) {
      setPfType(pfAmountType);
      form.resetFields(["pfAmount"]);
    }

    if (premiumAmount) {
      ;
      if (allFields?.isPremiumamount) {
        let amt = parseFloat(amount) + parseFloat(premiumAmount);
        ;
        setAmount(amt);
        calcDownPayment(amt);
      }
    }
    if (changedFields?.isPremiumamount) {
      let amt = parseFloat(amount) + parseFloat(allFields?.premiumAmount);
      setAmount(amt);
      calcDownPayment(amt);
    }
  };

  ;

  const dropdowns = [
    {
      name: "vehicletype",
      label: "Vehicle Type*",
      list: vehicleTypeDropdownList,
    },
    {
      name: "vehiclebrand",
      label: "Vehicle Brand*",
      list: vehicleBrandDropdownList,
    },
    {
      name: "model",
      label: "Vehicle Model*",
      list: vehicleModelDropdownList,
    },
    {
      name: "submodel",
      label: "Vehicle SubModel*",
      list: vehicleSubModelDropdownList,
    },
    {
      name: "dealer",
      label: "Dealer*",
      list: dealer,
    },
    {
      name: "subdealer",
      label: "Sub Dealer",
      list: dealer,
    },
  ].map((item) => {
    return (
      <Col lg={8}>
        <div className={"mui-dropdown-wrapper"}>
          <Form.Item
            name={item?.name}
            rules={[
              {
                required: item?.name === "subdealer" ? false : true,
                message: `${
                  item?.label && item?.label.slice(0, -1)
                } is mandatory`,
              },
            ]}
          >
            <InputText
              key={form && form.getFieldValue(item?.name)}
              label={item?.label}
              type={"dropdown"}
              options={item?.list}
            />
          </Form.Item>
        </div>
      </Col>
    );
  });

  // dropdown pfamt values
  const pfAmountDropdown = ["Number", "Percent"]?.map((re) => {
    return { label: re, value: re };
  });

  const relationDropdown = ["Father", "Mother", "Sister", "Spouse"]?.map(
    (re) => {
      return { label: re, value: re };
    }
  );

  const checkPF = (_, value) => {
   
    let pfAmount =
      parseFloat(schemeResponse?.pfAmount) > 0
        ? parseFloat(schemeResponse?.pfAmount)
        : 0;

    if (
      parseFloat(value) > parseFloat(pfAmount) ||
      parseFloat(value) === parseFloat(pfAmount)
    ) {
      return Promise.resolve();
    } else if (form.getFieldValue("pfAmountType")?.toLowerCase() === "number") {
      return Promise.reject(
        new Error(`Processing Fee must be greater than ${parseInt(pfAmount)}`)
      );
    } else {
      return Promise.resolve();
    }
  };

  const getDetails = async (branchName) => {
    getDropdownData(
      {},
      "getvehicletypelist",
      setVehicleTypeDropdownList,
      "vehicletype"
    );
    // set fields value - on mount
    form &&
      form.setFieldsValue({
        startDate: moment(data?.startDate, "DD/MM/YYYY"),
        endDate: moment(data?.endDate, "DD/MM/YYYY"),
        adminFees: data?.adminFees?.toString(),
        amt_requested: data?.amt_requested?.toString(),
        vehiclebrand: data?.brand_nm?.toString(),
        bureauCharges: data?.bureauCharges?.toString(),
        bureauPull: data?.bureauPull?.toString(),
        convenienceCharges: data?.convenienceCharges?.toString(),
        customerCreation: data?.customerCreation?.toString(),
        dealerCharges: data?.dealerCharges?.toString(),
        dealerPayout: data?.dealerPayout?.toString(),
        dealerPayouttype: data?.dealerPayouttype?.toString(),
        dealerSubvention: data?.dealerSubvention?.toString(),
        dealer: data?.dealer_name?.toString(),
        subdealer: data?.subDealerName?.toString(),
        downPayment: data?.downPayment?.toString(),
        emi: data?.emi?.toString(),
        isPremiumamount: data?.isPremiumamount,
        isguarantor: data?.isguarantor?.toString(),
        islifeInsurance: data?.islifeInsurance,
        ismainapplicant: data?.ismainapplicant?.toString(),
        ltvPercentage: data?.ltvPercentage?.toString(),
        ltvPercentageWithKli: data?.ltvPercentageWithKli?.toString(),
        ltvPercentageWithoutKli: data?.ltvPercentageWithoutKli?.toString(),
        maxamt: data?.maxamt?.toString(),
        model: data?.model?.toString(),
        nachCharges: data?.nachCharges?.toString(),
        nachChargesMaster: data?.nachChargesMaster?.toString(),
        onRoadPrice: data?.onRoadPrice?.toString(),
        otherCharges: data?.otherCharges?.toString(),
        pddCharges: data?.pddCharges?.toString(),
        pfAmount: data?.processingFees?.toString(),
        pfAmountMaster: data?.pfAmountMaster?.toString(),
        pfAmountType: data?.pfAmountType?.toString(),
        pfAmountTypeMaster: data?.pfAmountTypeMaster?.toString(),
        preEmi: data?.preEmi?.toString(),
        processingFees: data?.processingFees?.toString(),
        rateOfInterest: data?.rateOfInterest?.toString(),
        scheme: data?.scheme?.toString(),
        schemeCode: data?.schemeCode?.toString(),
        schemeName: data?.schemeName?.toString(),
        stampDuty: data?.stampDuty?.toString(),
        stampDutyMaster: data?.stampDutyMaster?.toString(),
        submodel: data?.submodel?.toString(),
        tenure_requested: data?.tenure_requested?.toString(),
        vehicletype: data?.vehicle_type?.toString(),
        costOfVehicle: data?.costOfVehicle
      });

    if (data?.islifeInsurance) {
      setShowPremiumSection(true);
      form.setFieldsValue({
        premiumAmount: data?.premiumAmount?.toString(),
        name: data?.name?.toString(),
        address: data?.address,
        relationType: data?.relationType?.toString(),
        dateOfBirth: moment(data?.dateOfBirth, "DD/MM/YYYY"),
      });
    } else {
      form.setFieldsValue({
        name: "",
        address: "",
        premiumAmount: "",
      });
    }
    if (data?.vehicle_type) {
      getDropdownData(
        { vehicletype: data?.vehicle_type },
        "getvehiclebrandlist",
        setVehicleBrandDropdownList,
        "vehiclebrand"
      );
      getDropdownData(
        { vehiclebrand: data?.brand_nm, vehicletype: data?.vehicle_type },
        "getvehiclemodellist",
        setVehicleModelDropdownList,
        "model"
      );
      getDropdownData(
        {
          vehiclebrand: data?.brand_nm,
          vehicletype: data?.vehicle_type,
          model: data?.model,
        },
        "getvehiclesubmodellist",
        setVehicleSubModelDropdownList,
        "submodel"
      );
      dealerList({
        branchName: branchName,
      }).then((re) => {
        ;
        if (re) {
          let finalResult = re.map((re) => {
            return { label: re.dealer_name, value: re.dealer_name };
          });
          ;
          setDealer(finalResult);
        }
      });
    }
    if (data?.dealer_name) {
      (async () => {
        const res = await getSchemeCode({
          dealerName: data?.dealer_name,
          location: branchName,
        });
        let finalResult = await res?.map((re) => {
          return { label: re?.schemeCode, value: re?.schemeCode };
        });
        setSchemeCode(finalResult);
        ;
      })();
    }
  };

  React?.useEffect(() => {
    (async () => {
      const response = await getLeadDetails({
        applicantUniqueId: data?.applicantUniqueid,
      });
      setBranchName(response?.branchName);
      if (response?.branchName) {
        getDetails(response?.branchName);
        const responseS = await schemeDetails({
          dealerName: "ALL",
          location: response?.branchName,
          schemeCode: data?.schemeCode,
          applicantUniqueId: data?.applicantUniqueid,
        });

        ;
        setSchemeResponse(responseS);
      }
    })();
  }, []);


  const disabledDate = (current) => {
    return current > moment().clone().subtract(18, "years");
  };

  return (
    <div>
      {" "}
      <Form
        initialValues={{
          remember: true,
        }}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        onValuesChange={handleFormChange}
      >
        <Row gutter={[30, 10]}>{dropdowns}</Row>

        <Row gutter={[30, 10]}>
          <Col lg={8}>
            <Form.Item
              name={"schemeCode"}
              rules={[
                {
                  required: true,
                  message: `Scheme Code is mandatory`,
                },
              ]}
            >
              <InputText
                key={form && form.getFieldValue("schemeCode")}
                label={"Scheme Code"}
                type={"dropdown"}
                options={schemeCode}
                defaultValue={data?.schemeCode}
                disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[30, 10]}>
          <Col lg={8}>
            <Form.Item
              name={"startDate"}
              rules={[
                {
                  required: true,
                  message: `Start Date is mandatory`,
                },
              ]}
            >
              <DatePicker
                placeholder={"Start Date"}
                inputProps={{ readOnly: true }}
                format={customFormat}
                disabled
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"endDate"}
              rules={[
                {
                  required: true,
                  message: `End Date is mandatory`,
                },
              ]}
            >
              <DatePicker
                placeholder={"End Date"}
                format={customFormatEndDate}
                disabled
                inputReadOnly={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[30, 10]}>
          <Col lg={8}>
            <Form.Item
              name={"schemeName"}
              rules={[
                {
                  required: false,
                  message: `Scheme Name is mandatory`,
                },
              ]}
            >
              <InputText
                label={"Scheme Name"}
                type={"text"}
                disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={8}>
            <Form.Item
              name={"pfAmountType"}
              rules={[
                {
                  required: true,
                  message: "Processing Fee Type is mandatory",
                },
              ]}
            >
              <InputText
                onChange={() => form.resetFields(["pfAmount"])}
                label={"PF Amount Type"}
                type={"dropdown"}
                options={pfAmountDropdown}
                disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"pfAmount"}
              rules={[
                {
                  required: true,
                  message: `Processing Fees is mandatory`,
                },
                {
                  validator: checkPF,
                },
                {
                  pattern: new RegExp(/^[0-9 ]*$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                type={"number"}
                label={"Processing Fees"}
                disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={8}>
            <Form.Item
              name={"bureauCharges"}
              rules={[
                {
                  required: true,
                  message: `Buraeu Charges is mandatory`,
                },
                {
                  pattern: new RegExp(/^[0-9 ]*$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Buraeu Charges"}
                type={"number"}
                disabled={true}
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={8}>
            <Form.Item
              name={"dealerCharges"}
              rules={[
                {
                  required: true,
                  message: `Dealer Charges is mandatory`,
                },
                {
                  pattern: new RegExp(/^[0-9 ]*$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Dealer Charges*"}
                type={"number"}
                disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>{" "}
          <Col lg={8}>
            <Form.Item
              name={"otherCharges"}
              rules={[
                {
                  required: true,
                  message: `Other Charges is mandatory`,
                },
                {
                  pattern: new RegExp(/^[0-9 ]*$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Other Charges"}
                type={"number"}
                disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"ltvPercentage"}
              rules={[
                {
                  required: true,
                  message: `LTV Percentage is mandatory`,
                },
                {
                  pattern: new RegExp(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"LTV Percentage"}
                type={"number"}
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"unit"}
              rules={[
                {
                  required: true,
                  message: `No. of units is mandatory`,
                },
                {
                  pattern: new RegExp(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Number of units"}
                type={"number"}
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"unit"}
              rules={[
                {
                  required: true,
                  message: `Upfront amt is mandatory`,
                },
                {
                  pattern: new RegExp(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Upfront amount"}
                type={"number"}
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              name={"costOfVehicle"}
              rules={[
                {
                  required: false,
                  message: `costOfVehicle is mandatory`,
                },
              ]}
            >
              <InputText
                label={"Cost of Vehicle"}
                type={"text"}
                disabled={caseFreeze || userFreeze}
              />
            </Form.Item>
          </Col>
        </Row>

        <br />
        <b>Loan Protect Insurance</b>
        <br />
        <Row gutter={[16, 24]}>
          <Col span={8}>
            <b>Is Life Insurance taken</b>
          </Col>{" "}
          <Col span={16}>
            <Form.Item
              name={"islifeInsurance"}
              rules={[
                {
                  required: true,
                  message: "Please Select an Option",
                },
              ]}
            >
              <Radio.Group
                name="radiogroup"
                defaultValue={data?.islifeInsurance}
                disabled={caseFreeze || userFreeze}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {showPremiumSection && (
            <>
              <Col span={8}>
                <b>Premium Amount</b>
              </Col>{" "}
              <Col span={8}>
                <Form.Item
                  name={"premiumAmount"}
                  rules={[
                    {
                      required: true,
                      message: "PremiumAmount is manadtory",
                    },
                    {
                      pattern: new RegExp(/^[0-9 ]*$/),
                      message: "Invalid Input",
                    },
                  ]}
                >
                  <InputText
                    label={"Premium Amount"}
                    type={"number"}
                    disabled={caseFreeze || userFreeze}
                  />
                </Form.Item>
              </Col>
              <Col span={8}></Col>
              <Col span={8}>
                <b>Premium Amount to be added to loan amount ?</b>
              </Col>{" "}
              <Col span={16}>
                <Form.Item
                  name={"isPremiumamount"}
                  rules={[
                    {
                      required: true,
                      message: "Please Select Option",
                    },
                  ]}
                >
                  <Radio.Group
                    name="radiogroup"
                    defaultValue={data?.isPremiumamount}
                    disabled={caseFreeze || userFreeze}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <br />
              <Col span={24}>
                <b>Nominee Details</b>
              </Col>
              <br />
              <Col lg={8}>
                <Form.Item
                  name={"name"}
                  rules={[
                    {
                      required: true,
                      message: "Name is mandatory",
                    },
                  ]}
                >
                  <InputText
                    defaultValue={data?.name}
                    label={"Name"}
                    type={"text"}
                    disabled={caseFreeze || userFreeze}
                  />
                </Form.Item>
              </Col>{" "}
              <Col lg={8}>
                <Form.Item
                  name="relationType"
                  rules={[
                    {
                      required: true,
                      message: "Relationship selection is mandatory",
                    },
                  ]}
                >
                  <InputText
                    label={"Relationship*"}
                    type={"dropdown"}
                    options={relationDropdown}
                    defaultValue={data?.relationType}
                    disabled={caseFreeze || userFreeze}
                  />
                </Form.Item>
              </Col>{" "}
              <Col lg={8}>
                <Form.Item
                  name="dateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Date is mandatory",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder={"Date of Birth"}
                    disabled={caseFreeze || userFreeze}
                    format={customFormatDOB}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={"address"}
                  rules={[
                    {
                      required: true,
                      message: "Address is mandatory",
                    },
                  ]}
                >
                  <InputText
                    disabled={caseFreeze || userFreeze}
                    defaultValue={data?.address}
                    label={"Address"}
                    type={"text"}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        <Row justify="center" align="middle">
          <Button
            htmlType="submit"
            className="reset-button"
            disabled={caseFreeze || userFreeze}
          >
            Save
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default LoanDetailsEdit;
