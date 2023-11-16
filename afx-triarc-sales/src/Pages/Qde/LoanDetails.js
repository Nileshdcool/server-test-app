/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import { Button, Col, Form, Row, Radio } from "antd";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Input from "@material-ui/core/Input";
import { connect } from "react-redux";
import SelectIcon from "../../assets/Images/select.svg";
import {
  saveLoanDetail,
  getMaxAmountValue,
  getSchemeCode,
  getSchemeDetails,
  getApprovedLoanAmount,
} from "../../Redux/Services/Qde";
import { dealerList, loanDetails } from "../../Utility/Services/LoanDetails";
import { DatePicker, Select } from "antd";
import moment from "moment";
import "./style.scss";
import { tw } from "../../Utility/ReduxToaster";
import { public_url } from "../../Utility/Constant";
import { useHistory } from "react-router-dom";
import _debounce from "lodash/debounce";

const useStyles = makeStyles({
  root: {
    '& .MuiSlider-markLabel[data-index="0"]': {
      transform: "translateX(0%)",
    },
    '& .MuiSlider-markLabel[data-index="1"]': {
      transform: "translateX(-100%)",
    },
  },
});

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
};

const LoanDetails = (props) => {
  const classes = useStyles();
  // let form;
  const [form] = Form.useForm();
  const [vehicleTypeDropdownList, setVehicleTypeDropdownList] = useState([]);
  const [vehicleBrandDropdownList, setVehicleBrandDropdownList] = useState([]);
  const [vehicleModelDropdownList, setVehicleModelDropdownList] = useState([]);
  const [vehicleSubModelDropdownList, setVehicleSubModelDropdownList] =
    useState([]);
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [rateOfInterest, setRateOfInterest] = useState(0);
  const [roi, setRoi] = useState(0);
  const [updated, setUpdated] = useState(false);
  const [dealer, setDealer] = useState([]);
  const [emi, setEmi] = useState(0);
  const [total, setTotal] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [PremiumAmount, setPremiumAmount] = useState(0);
  const [islifeInsurance, setIsInsuranceSelected] = useState(null);
  const [isPremiumamount, setPremiumSelected] = useState(false);
  const [maxAmt, setmaxAmt] = useState(200000);
  const [maxAmount, setmaxAmount] = useState(null);
  const [btnDisable, setBtnDisable] = useState(true);
  const [typePayout, setTypePayout] = useState("number");
  const [payout, setPayout] = useState(0);
  const [schemCodeFlag, setSchemeCodeFlag] = useState(false);
  const [pfType, setPfType] = useState(null);
  const [label, setLabel] = useState(false);
  const [klpiBracket, setKlpiBracket] = useState(null);
  const [pfAmountMaster, setPfAmountMaster] = useState(null);
  const [pfAmountTypeMaster, setPfAmountTypeMaster] = useState(null);
  const [nachChargesMaster, setNachChargesMaster] = useState(null);
  const [stampDutyMaster, setStampDutyMaster] = useState(null);
  const [amtRequested, setAmtRequested] = useState(null);
  const [approvedLoanAmt, setApprovedLoanAmt] = useState(null);
  const [approvedLoanData, setApprovedLoanData] = useState({});
  const [selectedAmount, setSelectedAmount] = useState(0);

  const debounceFn = React.useCallback(_debounce(handleDebounceFn, 1000), []);

  let history = useHistory();
  const { Option } = Select;

  const marksAmount = [
    {
      value: 20000,
      label: "20k",
    },

    {
      value: parseInt(maxAmt),
      label: parseInt(maxAmt),
    },
  ];

  const handleSliderAmount = (event, value) => {
    setAmount(value);
    if (isPremiumamount) {
      let total = parseInt(PremiumAmount) + parseInt(value);
      setTotal(total);
    }
    if (!isPremiumamount) {
      let total = parseInt(value);
      setTotal(total);
    }
    // saveLoanDetails();
  };
  let handleInputChangeAmount = (e) => {

    
    setAmount(e.target.value);
    setSelectedAmount(e.target.value);
    if (isPremiumamount) {
      let total = parseInt(PremiumAmount) + parseInt(e.target.value);
      setTotal(total);
    }
    if (!isPremiumamount) {
      let total = parseInt(e.target.value);
      setTotal(total);
    }
    console.log("sss", e.target.value);
    debounceFn(e.target.value);
  };
  const handleInputChangeTenure = (event) => {
    setTenure(event.target.value);
    form && form.resetFields(["tenure"]);
  };

  const disabledDate = (current) => {
    return current > moment().clone().subtract(18, "years");
  };

  const onCurrencyChange = (value) => {
    setTypePayout(value);
    form.resetFields(["dealerPayout"]);
    setPayout("");
  };

  // [ changeStep (5) ]
  const handleChangeStep = () => {
    props.changeStep(5);
  };

  // slider validation - tenure
  const handleSliderError = (rule, value = tenure, callback) => {
    if (value < 37 && value > 5) {
      return callback();
    }
    callback(
      parseInt(value) < 6
        ? "Tenure must be greater than or equal to 6 Months"
        : "Tenure must be less than or equal to 36 Months"
    );
  };

  // Redirect to leadList
  const redirectToLeadList = () => {
    history.push(
      `${public_url.leadLists}/${props.qde.getQdeSectionDetails.data.productId}`
    );
  };

  // settting up max amount
  useEffect(() => {
    if (props.qde && props.qde.getMaxAmount && props.qde.getMaxAmount.maxamt) {
      setmaxAmt(props.qde.getMaxAmount.maxamt);
      setTimeout(()=>{

        saveLoanDetails()
      },600)
    }

    console.log("maxx", props?.qde?.getMaxAmount?.maxamt);
    if(props?.qde?.getMaxAmount?.maxamt){
      setmaxAmount(props?.qde?.getMaxAmount?.maxamt);
    }
  }, [props.qde && props.qde.getMaxAmount && props.qde.getMaxAmount.maxamt]);

  // EMI Calculation -------- Common Function
  const EmiCalculation = () => {
    if (rateOfInterest !== null) {
      let emiAmt = isPremiumamount
        ? parseInt(amount) + parseInt(PremiumAmount)
        : parseInt(amount);

      //---Emi Calculation for even months-----/->
      if (tenure % 2 === 0) {
        let a = (emiAmt / 100) * rateOfInterest;
        let b = tenure / 12;
        let c = parseFloat(emiAmt) + parseFloat(a * b);
        let emi = c / tenure;
        emi = emi.toFixed(2);
        setEmi(emi);
      }
      //---Emi Calculation for odd months------/->
      else {
        let emi =
          (parseFloat(emiAmt) +
            parseFloat(emiAmt) *
              (parseFloat(rateOfInterest) / 100) *
              ((parseFloat(tenure) + 1) / 12)) /
          parseFloat(tenure);
        setEmi(emi);
      }
    }
  };
  useEffect(() => {
    EmiCalculation();
  }, [rateOfInterest, amount, tenure]);

  // set Values--
  useEffect(() => {
    if (!isEmpty(props?.qde?.schemeDetails)) {
      // set Fields  - scheme Details

      form?.setFieldsValue({
        preEmi: props?.qde?.schemeDetails?.preEmiChanrges,
        ltvPercentage: props?.qde?.schemeDetails?.ltv,
        pddCharges: props?.qde?.schemeDetails?.pdd,
        processingFees: props?.qde?.schemeDetails?.pfAmount,
        pfAmountType: props?.qde?.schemeDetails?.pfAmountType,
        nachCharges: props?.qde?.schemeDetails?.nachCharges,
        dealerSubvention: props?.qde?.schemeDetails?.dealerSubvention,
        bureauCharges: props?.qde?.schemeDetails?.bureauCharges,
        otherCharges: props?.qde?.schemeDetails?.anyOtherCharges,
        premiumAmount: props?.qde?.schemeDetails?.klpiBracket,
        startDate: moment(props?.qde?.schemeDetails?.startDate, "DD/MM/YYYY"),
        endDate: moment(props?.qde?.schemeDetails?.endDate, "DD/MM/YYYY"),
        schemeName: props?.qde?.schemeDetails?.schemeName,
        stampDuty: props?.qde?.schemeDetails?.stampDuty,
      });

      if (
        props?.qde?.schemeDetails?.pfAmount &&
        props?.qde?.schemeDetails?.nachCharges &&
        props?.qde?.schemeDetails?.stampDuty
      ) {
        setPfAmountMaster(props?.qde?.schemeDetails?.pfAmount);
        setPfAmountTypeMaster(props?.qde?.schemeDetails?.pfAmountType);
        setNachChargesMaster(props?.qde?.schemeDetails?.nachCharges);
        setStampDutyMaster(props?.qde?.schemeDetails?.stampDuty);
      }

      if (props?.qde?.schemeDetails?.dealerPayout) {
        form.setFieldsValue({
          dealerPayout: props?.qde?.schemeDetails?.dealerPayout,
        });
        setPayout(props?.qde?.schemeDetails?.dealerPayout);
      } else {
        form.setFieldsValue({
          dealerPayout: 0,
        });
        setPayout(0);
      }

      if (props?.qde?.schemeDetails?.dealerPayouttype) {
        form.setFieldsValue({
          dealerPayouttype: props?.qde?.schemeDetails?.dealerPayouttype,
        });
        setTypePayout(props?.qde?.schemeDetails?.dealerPayouttype);
      } else {
        form.setFieldsValue({
          dealerPayouttype: "number",
        });
        setTypePayout("number");
      }

      setLabel(true);
      setKlpiBracket(props?.qde?.schemeDetails?.klpiBracket);
      setPfType(props?.qde?.schemeDetails?.pfAmountType);
    }
  }, [props?.qde?.schemeDetails]);

  // ComponentDidMount ----------------------------------------/
  useEffect(() => {
    //scroll top
    window.scrollTo(0, 0);
    if (isEmpty(form && form.getFieldValue("dealerSubvention"))) {
      form.setFieldsValue({
        dealerSubvention: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("adminFees"))) {
      form.setFieldsValue({
        adminFees: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("nachCharges"))) {
      form.setFieldsValue({
        nachCharges: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("processingFees"))) {
      form.setFieldsValue({
        processingFees: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("preEmi"))) {
      form.setFieldsValue({
        preEmi: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("convenienceCharges"))) {
      form.setFieldsValue({
        convenienceCharges: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("pddCharges"))) {
      form.setFieldsValue({
        pddCharges: 100,
      });
    }
    if (isEmpty(form && form.getFieldValue("bureauCharges"))) {
      form.setFieldsValue({
        bureauCharges: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("stampDuty"))) {
      form.setFieldsValue({
        stampDuty: 100,
      });
    }
    if (isEmpty(form && form.getFieldValue("dealerCharges"))) {
      form.setFieldsValue({
        dealerCharges: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("otherCharges"))) {
      form.setFieldsValue({
        otherCharges: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("ltvPercentage"))) {
      form.setFieldsValue({
        ltvPercentage: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("exShowroom"))) {
      form.setFieldsValue({
        exShowroom: 0,
      });
    }
    if (isEmpty(form && form.getFieldValue("insurance"))) {
      form.setFieldsValue({
        insurance: 0,
      });
    }

    dealerList({
      branchName:
        JSON.parse(localStorage.getItem("UserData")) &&
        JSON.parse(localStorage.getItem("UserData")).branchName,
    }).then((re) => {
      if (!isEmpty(re)) {
        let result = re.map((re) => re.dealer_name);
        setDealer(result);
      }
    });

    // API Call - Max Amount
    if (props?.qde?.getQdeSectionDetails?.data?.loandetails?.submodel) {
      props.getMaxAmountValue({
        leadCode: props.qde.getQdeSectionDetails.data.leadCode,
        lead_code: props.qde.getQdeSectionDetails.data.leadCode,
        submodel: props.qde.getQdeSectionDetails.data.loandetails.submodel,
        vehicletype:
          props.qde.getQdeSectionDetails.data.loandetails.vehicle_type,
        vehiclebrand: props.qde.getQdeSectionDetails.data.loandetails.brand_nm,
        model: props.qde.getQdeSectionDetails.data.loandetails.model,
        exShowroom:
          props.qde?.getQdeSectionDetails?.data?.loandetails?.exShowroom,
        insurance:
          props?.qde?.getQdeSectionDetails?.data?.loandetails?.insurance,

        location:
          JSON.parse(localStorage.getItem("UserData")) &&
          JSON.parse(localStorage.getItem("UserData")).branchName,
      });
    }
    if (props?.qde?.getQdeSectionDetails?.data?.loandetails?.islifeInsurance) {
      setIsInsuranceSelected(
        props.qde.getQdeSectionDetails.data.loandetails.islifeInsurance
      );
    }
    if (props?.qde?.getQdeSectionDetails?.data?.loandetails?.isPremiumamount) {
      setPremiumSelected(true);
    }

    // API Call - Scheme Code

    props.getSchemeCode({
      dealerName:
        props?.qde?.getQdeSectionDetails?.data?.loandetails?.dealer_name,
      location: JSON.parse(localStorage.getItem("UserData"))?.branchName,
    });
  }, []);

  //chnged Fields Handle Form Change
  const handleFormChange = (changedFields, allFields) => {
    const type = allFields.vehicletype;

    if (isEmpty(allFields.dateOfBirth)) {
      setIsSelected(false);
    }

    // set Amount selected
    if (changedFields.amount) {
      setAmount(amount);
      let total = parseInt(PremiumAmount) + parseInt(changedFields.amount);
      setTotal(total);
    }

    // set tenure
    if (changedFields.tenure) {
      setTenure(changedFields.tenure);
      form && form.setFieldsValue({ tenureInput: changedFields.tenure });
    }

    // set IsLife Insurance
    if (changedFields.islifeInsurance) {
      setIsInsuranceSelected(true);
    } else if (changedFields.islifeInsurance === false) {
      form.resetFields([
        "premiumAmount",
        "isPremiumamount",
        "relationType",
        "dateOfBirth",
        "name",
        "address",
      ]);
      setPremiumAmount(0);
      setPremiumSelected(false);
      setIsInsuranceSelected(false);
      setTotal(amount);
    }

    // set IsPremiumAmt when premium amount chnges
    if (changedFields.premiumAmount) {
      setPremiumAmount(parseInt(changedFields.premiumAmount));
      let total;
      if (allFields.isPremiumamount === "Y") {
        total = parseInt(changedFields.premiumAmount) + parseInt(amount);
        setTotal(total);
      }
      if (allFields.isPremiumamount === "N") {
        total = parseInt(amount);
        setTotal(total);
      }
    }

    // set IsPremiumAmt when selection radio chnges
    if (changedFields.isPremiumamount === "Y") {
      EmiCalculation();
      setPremiumSelected(true);
      let total = parseInt(allFields.premiumAmount) + parseInt(amount);
      setTotal(total);
    }
    if (changedFields.isPremiumamount === "N") {
      EmiCalculation();
      setPremiumSelected(false);
      let total = parseInt(amount);
      setTotal(total);
    }

    // set Rate of Interest
    if (changedFields.roi) {
      // updateTrackRef.current = true;
      setRateOfInterest(
        changedFields.roi === "" ? "" : Number(changedFields.roi)
      );
      setRoi(changedFields.roi);
    }
    if (changedFields.exShowroom) {
      processChange({
        leadCode: props.qde.getQdeSectionDetails.data.leadCode,
        lead_code: props.qde.getQdeSectionDetails.data.leadCode,
        submodel: allFields.submodel,
        vehicletype: allFields.vehicletype,
        vehiclebrand: allFields.vehiclebrand,
        model: allFields.model,
        exShowroom: changedFields.exShowroom,
        location:
          JSON.parse(localStorage.getItem("UserData")) &&
          JSON.parse(localStorage.getItem("UserData")).branchName,
      });
    }

    if (changedFields.insurance) {
      processChange({
        leadCode: props.qde.getQdeSectionDetails.data.leadCode,
        lead_code: props.qde.getQdeSectionDetails.data.leadCode,
        submodel: allFields.submodel,
        vehicletype: allFields.vehicletype,
        vehiclebrand: allFields.vehiclebrand,
        model: allFields.model,
        exShowroom: allFields.exShowroom,
        insurance: changedFields.insurance,
        location:
          JSON.parse(localStorage.getItem("UserData")) &&
          JSON.parse(localStorage.getItem("UserData")).branchName,
      });
    }

  
    // exShowroom: 65633
   
    // insurance: 6453

    // max amount api call
    if (changedFields.submodel) {
      form && form.resetFields(["exShowroom", "insurance"]);
      props.getMaxAmountValue({
        leadCode: props.qde.getQdeSectionDetails.data.leadCode,
        lead_code: props.qde.getQdeSectionDetails.data.leadCode,
        submodel: changedFields.submodel,
        vehicletype: allFields.vehicletype,
        vehiclebrand: allFields.vehiclebrand,
        model: allFields.model,
        location:
          JSON.parse(localStorage.getItem("UserData")) &&
          JSON.parse(localStorage.getItem("UserData")).branchName,
        exShowroom: allFields?.exShowroom,
        insurance: allFields?.insurance,
      });
    }

    // on changes amount
    if (changedFields.amount) {
      console.log("ads........");
    }

    //scheme code api call
    if (changedFields.dealer) {
      props.getSchemeCode({
        dealerName: allFields.dealer,
        location: JSON.parse(localStorage.getItem("UserData"))?.branchName,
      });
    }
    if (changedFields.dateOfBirth) {
      // set Date Of Birth
      setIsSelected(changedFields.dateOfBirth !== null);
    }

    // set vehicle dropdowns
    const { vehicletype, vehiclebrand, model } = changedFields;
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
      getDropdownData(
        { vehiclebrand, vehicletype: type },
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
          model,
          vehiclebrand: allFields?.vehiclebrand,
          vehicletype: allFields?.vehicletype,
        },
        "getvehiclesubmodellist",
        setVehicleSubModelDropdownList,
        "submodel"
      );
      form.resetFields(["submodel"]);
    }

    if (changedFields?.schemeCode) {
      setSchemeCodeFlag(true);
      if (props?.qde?.schemeCode) {
        let arr = [];
        arr = props?.qde?.schemeCode;
        const value = arr.filter((value) => {
          if (value?.schemeCode === changedFields?.schemeCode) {
            return value;
          }
        });
        // setSchemeCodeObj(value[0]);
        (() => {
          props.getSchemeDetails({
            dealerName: value[0]?.dealerName,
            location: JSON.parse(localStorage.getItem("UserData"))?.branchName,
            schemeCode: value[0]?.schemeCode,
            applicantUniqueId: props.match.params.id,
          });
        })();
      }
    }
  };

  console.log("maxx 2", maxAmt, maxAmount);
  const saveLoanDetails = async (e) => {
    console.log("maxx 3", maxAmt, maxAmount);
    let id = null;

    if (!isEmpty(props?.qde?.getQdeSectionDetails?.data?.loandetails)) {
      id = props?.qde?.getQdeSectionDetails?.data?.loandetails?.id;
    }
    const response = await props.getApprovedLoanAmount({
      dealerSubvention: form && form.getFieldValue("dealerSubvention"),
      adminFees: form && form.getFieldValue("adminFees"),
      nachCharges: form && form.getFieldValue("nachCharges"),
      convenienceCharges: form && form.getFieldValue("convenienceCharges"),
      pddCharges: form && form.getFieldValue("pddCharges"),
      bureauCharges: form && form.getFieldValue("bureauCharges"),
      dealerCharges: form && form.getFieldValue("dealerCharges"),
      otherCharges: form && form.getFieldValue("otherCharges"),
      isPremiumamount:
        form && form.getFieldValue("isPremiumamount") == "Y" ? true : false,
      dateOfBirth:
        form && form.getFieldValue("dateOfBirth")?.format("DD/MM/YYYY"),
      startDate: form && form.getFieldValue("startDate").format("DD/MM/YYYY"),
      endDate: form && form.getFieldValue("endDate")?.format("DD/MM/YYYY"),
      premiumAmount: form && form.getFieldValue("premiumAmount"),
      vehicle_type: form && form.getFieldValue("vehicletype"),
      brand_nm: form && form.getFieldValue("vehiclebrand"),
      model: form && form.getFieldValue("model"),
      submodel: form && form.getFieldValue("submodel"),
      dealer_name: form && form.getFieldValue("dealer"),
      subDealerName: form && form.getFieldValue("subdealer"),
      rateOfInterest: form && form.getFieldValue("roi"),
      amt_requested: total,
      tenure_requested: tenure,
      leadCode: props.qde.getQdeSectionDetails.data.leadCode,
      lead_code: props.qde.getQdeSectionDetails.data.leadCode,
      applicant_uniqueid: props.match.params.id,
      isguarantor: false,
      ismainapplicant: true,
      maxamt: parseFloat(maxAmt),
      emi: Math.ceil(emi),
      dealerPayouttype: typePayout,
      pfAmountMaster: pfAmountMaster,
      pfAmountTypeMaster: pfAmountTypeMaster,
      nachChargesMaster: nachChargesMaster,
      stampDutyMaster: stampDutyMaster,
      address: form && form.getFieldValue("address"),
      amount: form && form.getFieldValue("amount"),
      dealer: form && form.getFieldValue("dealer"),
      dealerPayout: form && form.getFieldValue("dealerPayout"),
      exShowroom: form && form.getFieldValue("exShowroom"),
      insurance: form && form.getFieldValue("insurance"),
      islifeInsurance: form && form.getFieldValue("islifeInsurance"),
      ltvPercentage: form && form.getFieldValue("ltvPercentage"),
      name: form && form.getFieldValue("name"),
      pfAmountType: form && form.getFieldValue("pfAmountType"),
      preEmi: form && form.getFieldValue("preEmi"),
      processingFees: form && form.getFieldValue("processingFees"),
      relationType: form && form.getFieldValue("relationType"),
      roi: form && form.getFieldValue("roi"),
      schemeCode: form && form.getFieldValue("schemeCode"),
      schemeName: form && form.getFieldValue("schemeName"),
      stampDuty: form && form.getFieldValue("stampDuty"),
      subdealer: form && form.getFieldValue("subdealer"),
      tenure: form && form.getFieldValue("tenure"),
      vehiclebrand: form && form.getFieldValue("vehiclebrand"),
      amountSelected: e || amount,
      id,
    });

    console.log("ssa", response);
    if (response) {
      setApprovedLoanData(response)
      if (response?.isPremiumamount) {
        const amt =
          (await parseFloat(response?.amt_requested)) -
          parseFloat(response?.premiumAmount);
        setApprovedLoanAmt(amt);
      } else {
        setApprovedLoanAmt(response?.amt_requested);
      }
      setAmtRequested(response?.amt_requested);
    }


  };

  console.log("ssa", form && form.getFieldValue("adminFees"));

  //onSubmit
  const handleFormSave = (e) => {
    if (total > maxAmt) {
      tw("Total amount cannot exceed vehicle amount");
    } else {
      let id = null;

      if (!isEmpty(props?.qde?.getQdeSectionDetails?.data?.loandetails)) {
        id = props?.qde?.getQdeSectionDetails?.data?.loandetails?.id;
      }

      props.saveLoanDetail({
        ...e,
        dealerSubvention: parseFloat(e.dealerSubvention),
        adminFees: parseFloat(e.adminFees),
        nachCharges: parseFloat(e.nachCharges),
        convenienceCharges: parseFloat(e.convenienceCharges),
        pddCharges: parseFloat(e.pddCharges),
        bureauCharges: parseFloat(e.bureauCharges),
        dealerCharges: parseFloat(e.dealerCharges),
        otherCharges: parseFloat(e.otherCharges),
        isPremiumamount: isPremiumamount,
        dateOfBirth: e?.dateOfBirth?.format("DD/MM/YYYY"),
        startDate: e?.startDate?.format("DD/MM/YYYY"),
        endDate: e?.endDate?.format("DD/MM/YYYY"),
        premiumAmount: parseFloat(PremiumAmount),
        vehicle_type: e.vehicletype,
        brand_nm: e.vehiclebrand,
        model: e.model,
        submodel: e.submodel,
        dealer_name: e.dealer,
        subDealerName: e.subdealer,
        rateOfInterest: parseFloat(e.roi),
        amt_requested: total,
        tenure_requested: tenure,
        leadCode: props.qde.getQdeSectionDetails.data.leadCode,
        lead_code: props.qde.getQdeSectionDetails.data.leadCode,
        applicant_uniqueid: props.match.params.id,
        isguarantor: false,
        ismainapplicant: true,
        maxamt: maxAmt,
        emi: Math.ceil(emi),
        dealerPayouttype: typePayout,
        pfAmountMaster: parseFloat(pfAmountMaster),
        pfAmountTypeMaster: parseFloat(pfAmountTypeMaster),
        nachChargesMaster: parseFloat(nachChargesMaster),
        stampDutyMaster: parseFloat(stampDutyMaster),
        amountSelected: amount,
        ltvGridPercentage: approvedLoanData?.ltvGridPercentage,
        ltvGridId: approvedLoanData?.ltvGridId,
        exShowroom: parseFloat(e.exShowroom),
        insurance: parseFloat(e.insurance),
        id,
      });
    }
  };

  // exShowroom: 65633
// id: 17
// insurance: 6453

  useEffect(() => {
    if (props.qde.getQdeSectionDetails) {
      if (!isEmpty(props?.qde?.getQdeSectionDetails?.data?.loandetails)) {
        setBtnDisable(false);
        setIsSelected(true);
        setUpdated(true);
        const { ...data } = props.qde.getQdeSectionDetails.data.loandetails;

        form.setFieldsValue({
          vehicletype: data?.vehicle_type,
          vehiclebrand: data?.brand_nm,
          model: data?.model,
          submodel: data?.submodel,
          dealer: data?.dealer_name,
          subdealer: data?.subDealerName,
          roi: data?.rateOfInterest,
          amount: data?.isPremiumamount
            ? parseInt(data?.amt_requested) - parseInt(data?.premiumAmount)
            : parseInt(data?.amt_requested),
          tenure: data?.tenure_requested,
          isPremiumamount: data.isPremiumamount ? "Y" : "N",
          islifeInsurance: data?.islifeInsurance,
          dealerCharges: data?.dealerCharges,
          processingFees: data?.processingFees,
          insuranceAmount: data?.insuranceAmount,
          bureauCharges: data?.bureauCharges,
          otherCharges: data?.otherCharges,
          name: data?.name,
          address: data?.address,
          relationType: data?.relationType,
          dealerPayout: data?.dealerPayout,
          dealerSubvention: data?.dealerSubvention,
          adminFees: data?.adminFees,
          nachCharges: data?.nachCharges,
          preEmi: data?.preEmi,
          pddCharges: data?.pddCharges,
          convenienceCharges: data?.convenienceCharges,
          stampDuty: data?.stampDuty,
          schemeCode: data?.schemeCode,
          ltvPercentage: data?.ltvPercentage,
          pfAmountType: data?.pfAmountType,
          schemeName: data?.schemeName,
          startDate: moment(data?.startDate, "DD/MM/YYYY"),
          endDate: moment(data?.endDate, "DD/MM/YYYY"),
          exShowroom: data?.exShowroom,
          insurance: data?.insurance,

          // dealerPayouttype,
        });

        if(data?.exShowroom &&  data?.insurance){
             props.getMaxAmountValue({
               leadCode: props.qde.getQdeSectionDetails.data.leadCode,
               lead_code: props.qde.getQdeSectionDetails.data.leadCode,
               submodel: data?.submodel,
               vehicletype: data?.vehicle_type,
               vehiclebrand: data?.brand_nm,
               model: data?.model,
               location:
                 JSON.parse(localStorage.getItem("UserData")) &&
                 JSON.parse(localStorage.getItem("UserData")).branchName,
             });
        }

        if (
          props?.qde?.getQdeSectionDetails?.data?.loandetails
            ?.nachChargesMaster &&
          props?.qde?.getQdeSectionDetails?.data?.loandetails?.stampDutyMaster
        ) {
          setPfAmountMaster(
            props?.qde?.getQdeSectionDetails?.data?.loandetails?.pfAmountMaster
          );
          setPfAmountTypeMaster(
            props?.qde?.getQdeSectionDetails?.data?.loandetails
              ?.pfAmountTypeMaster
          );
          setNachChargesMaster(
            props?.qde?.getQdeSectionDetails?.data?.loandetails
              ?.nachChargesMaster
          );
          setStampDutyMaster(
            props?.qde?.getQdeSectionDetails?.data?.loandetails?.stampDutyMaster
          );
        }

        if (data?.pfAmountType) {
          setPfType(
            props.qde.getQdeSectionDetails.data.loandetails?.pfAmountType
          );
        }

        setTypePayout(data?.dealerPayouttype);
        setPayout(data?.dealerPayout);
        setTenure(
          props.qde.getQdeSectionDetails.data.loandetails?.tenure_requested
        );
        setEmi(data?.emi);
        setRoi(data?.roi);
        if (data?.startDate && data?.endDate) {
          setLabel(true);
        }
        if (data?.islifeInsurance) {
          form.setFieldsValue({
            dateOfBirth: moment(data?.dateOfBirth, "DD/MM/YYYY"),
          });
          form.setFieldsValue({
            premiumAmount: data?.premiumAmount,
          });
          setPremiumAmount(parseInt(data?.premiumAmount));
        }
        if (data?.isPremiumamount) {
          let amount =
            parseInt(data?.amt_requested) - parseInt(data?.premiumAmount);
          let total = parseInt(data?.amt_requested);
          setAmount(amount);
          setTotal(total);
        } else {
          let total = parseInt(data?.amt_requested);
          // setAmount(total);
          setTotal(total);
        }

        if(data?.amountSelected){
          setSelectedAmount(data?.amountSelected);
            console.log("maxx 33", maxAmt, maxAmount);
          // saveLoanDetails(data?.amountSelected);
        }
        

        if (props.qde.getQdeSectionDetails.data.loandetails) {
        }
        // setAmount(amt_requested);
        setTenure(data?.tenure_requested);
        setPremiumSelected(data?.isPremiumamount);
        setPremiumAmount(data?.premiumAmount);

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
        setRateOfInterest(data?.rateOfInterest);
        saveLoanDetails()
      }

    }

  }, [props.qde.getQdeSectionDetails]);

  // [set premium Amount]

  // set ROI  Amount
  React.useEffect(() => {
    if (props?.qde?.schemeDetails?.roi) {
      if (roi === null || roi === 0) {
        setRateOfInterest(props?.qde?.schemeDetails?.roi);
        form && form.setFieldsValue({ roi: props?.qde?.schemeDetails?.roi });
        if (schemCodeFlag) {
          EmiCalculation();
        }
      }
    }
  }, [props?.qde?.schemeDetails?.roi]);

  //input props Enable / disabled
  const inputProps = {
    readOnly: props?.freezeLoan && (props.freezeCase || props.freezeUser),
    disabled: props?.freezeLoan && (props.freezeCase || props.freezeUser),
  };

  console.log("propsssss", props);

  //getDropdown data
  const getDropdownData = async (data, type, setList, key) => {
    console.log("keyy",key)
    if (props.qde.getQdeSectionDetails) {
      const payload = {
        ...data,
        lead_code:
          props.qde.getQdeSectionDetails.data &&
          props.qde.getQdeSectionDetails.data.leadCode,
      };
      const response = await loanDetails(payload, type);
      if (!isEmpty(response)) {
        console.log("keyy",response)
        const list = [
          <option hidden></option>,
          ...response.map((item) => (
            <option value={item[key]}>{item[key]}</option>
          )),
        ];
        setList(list);
      }
    }
  };

  //date picker custom format dd/mm/yyyy
  const customFormat = (value) => {
    return value.format("DD/MM/YYYY");
  };

  useEffect(() => {
    getDropdownData(
      {},
      "getvehicletypelist",
      setVehicleTypeDropdownList,
      "vehicletype"
    );
  }, [props.qde.getQdeSectionDetails]);

  //set dropdowns
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
      list: [
        <option hidden></option>,
        dealer.map((item) => <option value={item}>{item}</option>),
      ],
    },
    {
      name: "subdealer",
      label: "Sub Dealer",
      list: [
        <option hidden></option>,
        dealer.map((item) => <option value={item}>{item}</option>),
      ],
    },
  ].map((item) => {
    return (
      <Col lg={8}>
        <div className={"mui-dropdown-wrapper"}>
          <img alt={"select"} src={SelectIcon} className="searchIcon" />
          <Form.Item
            name={item.name}
            rules={[
              {
                required: item.name === "subdealer" ? false : true,
                message: `${
                  item.label && item.label.slice(0, -1)
                } is mandatory`,
              },
            ]}
          >
            <TextField
              key={form && form.getFieldValue(item.name)}
              disabled={!item.list.length}
              inputProps={inputProps}
              select
              label={item.label}
              fullWidth
              SelectProps={{
                native: true,
              }}
              InputLabelProps={
                updated
                  ? {
                      shrink: item.list.length ? true : false,
                    }
                  : {}
              }
            >
              {item.list}
            </TextField>
          </Form.Item>
        </div>
      </Col>
    );
  });

  // [ Get Scheme Code ]
  const getSchemeCode = () => {
    if (props?.qde?.schemeCode) {
      let arr = [];
      arr = props?.qde?.schemeCode;
      return arr?.map((value) => {
        return <option>{value?.schemeCode}</option>;
      });
    }
  };

  // pf amount

  const checkPF = (_, value) => {
    let pfAmount =
      parseFloat(props?.qde?.schemeDetails?.pfAmount) || pfAmountMaster || 0;

    if (
      parseFloat(value) > parseFloat(pfAmount) ||
      parseFloat(value) === parseFloat(pfAmount)
    ) {
      return Promise.resolve();
    } else if (pfType.toLowerCase() === "number") {
      return Promise.reject(
        new Error(`Processing Fee must be greater than ${parseInt(pfAmount)}`)
      );
    } else {
      return Promise.resolve();
    }
  };

  // const allowPF = (_, value) => {
  //   return Promise.resolve();
  // };

  // for nach

  const checkNach = (_, value) => {
    let nachAmount =
      props?.qde?.schemeDetails?.nachCharges || nachChargesMaster;

    console.log(
      "ssss",
      nachAmount,
      props?.qde?.getQdeSectionDetails?.data?.loandetails
    );

    if (
      parseFloat(value) > parseFloat(nachAmount) ||
      parseFloat(value) === parseFloat(nachAmount)
    ) {
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error(`Nach Charges must be greater than ${parseInt(nachAmount)}`)
      );
    }
  };

  // for stamp

  const checkStamp = (_, value) => {
    let stampAmount =
      parseFloat(props?.qde?.schemeDetails?.stampDuty) ||
      parseFloat(stampDutyMaster) ||
      0;

    if (parseFloat(value) < parseFloat(stampAmount)) {
      return Promise.reject(
        new Error(`Stamp Charges must be greater than ${parseInt(stampAmount)}`)
      );
    } else {
      return Promise.resolve();
    }
  };

  const handlePFType = (e, value) => {
    setPfType(e.target.value);
    form && form.resetFields(["processingFees"]);
  };

  useEffect(() => {
    if (PremiumAmount) {
      if (parseInt(PremiumAmount) > 0) {
        form && form.setFieldsValue({ premiumAmount: PremiumAmount });
      } else {
        form && form.setFieldsValue({ premiumAmount: klpiBracket });
        setPremiumAmount(klpiBracket);
      }
    }
  }, [PremiumAmount, klpiBracket]);

  const getTenureList = () => {
    //props?.qde?.schemeDetails?.tenureList;
    if (props?.qde?.schemeDetails?.tenureList) {
      let arr = [];
      arr = props?.qde?.schemeDetails?.tenureList;
      return arr?.map((value) => <option>{value?.tenure}</option>);
    }
  };

  // debounce for slider changes

  function debounce(debounceFunc, timeout = 1000) {
    let timer;

    return (...args) => {
      // --- args are in this case debounceFunc & timeout
      clearTimeout(timer);
      timer = setTimeout(() => {
        debounceFunc(...args);
        // --- args are in this case e.target of Input passed
      }, timeout);
    };
  }

  const debounceFunc = (e) => {
    // setValue(e?.target?.value);
    console.log("hello ss", e);
    props.getMaxAmountValue(e);
  };

  const processChange = debounce(debounceFunc);

  // debounce for input -->

   function handleDebounceFn(e) {
    saveLoanDetails(e)
   }



  return (
    <React.Fragment>
      <div className="loanDetails">
        <Form
          // ref={(e) => (form = e)}
          form={form}
          name="basic"
          onValuesChange={handleFormChange}
          onFinish={handleFormSave}
        >
          <div className="Business-container" style={{ padding: 40 }}>
            <Row gutter={[30, 10]}>{dropdowns}</Row>
            <Row gutter={[30, 10]}>
              <Col lg={8}>
                <Form.Item
                  name={"exShowroom"}
                  rules={[
                    {
                      required: true,
                      message: "Ex Showroom is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="exShowroom"
                    inputProps={inputProps}
                    type="number"
                    id="exShowroom"
                    label="Ex-Showroom Price*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"insurance"}
                  rules={[
                    {
                      required: true,
                      message: "Insurance Fees is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="insurance"
                    inputProps={inputProps}
                    type="number"
                    id="insurance"
                    label="Insurance Amount*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <div className={"mui-dropdown-wrapper"}>
                  <img alt={"select"} src={SelectIcon} className="searchIcon" />
                  <Form.Item
                    name="schemeCode"
                    rules={[
                      {
                        required: true,
                        message: "Scheme Code is mandatory",
                      },
                    ]}
                  >
                    <TextField
                      key={form?.getFieldValue("schemeCode")}
                      inputProps={inputProps}
                      select
                      label={"Scheme Code*"}
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      <option hidden></option>
                      {getSchemeCode()}
                    </TextField>
                  </Form.Item>
                </div>
              </Col>
              <Col lg={8}>
                <label
                  style={{ marginLeft: 12 }}
                  id={"date-picker-label"}
                  className={`MuiFormLabel-root MuiInputLabel-root ${
                    (form && form.getFieldValue("startDate")) || label
                      ? "MuiInputLabel-animated MuiInputLabel-shrink"
                      : ""
                  } MuiInputLabel-formControl MuiInputLabel-animated`}
                  data-shrink="false"
                  for="startDate"
                >
                  Start Date
                </label>
                <Form.Item
                  name={"startDate"}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <DatePicker
                    placeholder=""
                    fullWidth
                    style={{ width: "100%" }}
                    format={customFormat}
                    disabled
                    inputReadOnly={true}
                    labelId={"date-picker-label"}
                    bordered={false}
                    className={
                      "loanDetailDatePicker MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                    }
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <label
                  style={{ marginLeft: 12 }}
                  id={"date-picker-label"}
                  className={`MuiFormLabel-root MuiInputLabel-root ${
                    (form && form.getFieldValue("endDate")) || label
                      ? "MuiInputLabel-animated MuiInputLabel-shrink"
                      : ""
                  } MuiInputLabel-formControl MuiInputLabel-animated`}
                  data-shrink="false"
                  for="endDate"
                >
                  End Date
                </label>
                <Form.Item
                  name={"endDate"}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <DatePicker
                    placeholder=""
                    style={{ width: "100%" }}
                    fullWidth
                    format={customFormat}
                    disabled
                    inputReadOnly={true}
                    labelId={"date-picker-label"}
                    bordered={false}
                    className={
                      "loanDetailDatePicker MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                    }
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"schemeName"}
                  rules={[
                    {
                      required: false,
                      message: "Scheme Name is mandatory",
                    },
                  ]}
                >
                  <TextField
                    className="schemeName"
                    defaultValue={""}
                    inputProps={inputProps}
                    type="text"
                    id="schemeName"
                    label="Scheme Name"
                    fullWidth
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .toString()
                        .match(/^[a-zA-Z0-9 ]*$/)
                        ? e.target.value.toString().slice(0, 30)
                        : e.target.value
                            .toString()
                            .slice(0, e.target.value.length - 1);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"dealerSubvention"}
                  rules={[
                    {
                      required: true,
                      message: "Dealer Subvention is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    inputProps={inputProps}
                    className="dealerSubvention"
                    type="number"
                    id="dealerSubvention"
                    label="Dealer Subvention Charges*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"adminFees"}
                  rules={[
                    {
                      required: true,
                      message: "Admin Fees is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="adminFees"
                    inputProps={inputProps}
                    type="number"
                    id="adminFees"
                    label="Admin Fees Charges*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"nachCharges"}
                  rules={[
                    {
                      required: true,
                      message: "Nach Charges is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                    {
                      validator: checkNach,
                    },
                  ]}
                >
                  <TextField
                    className="nachCharges"
                    inputProps={inputProps}
                    type="number"
                    id="nachCharges"
                    label="Nach Charges*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col lg={8}>
                <div className={"mui-dropdown-wrapper"}>
                  <img alt={"select"} src={SelectIcon} className="searchIcon" />
                  <Form.Item
                    name="pfAmountType"
                    rules={[
                      {
                        required: false,
                        message: "Processing Fee Type is mandatory",
                      },
                    ]}
                  >
                    <TextField
                      onChange={handlePFType}
                      label={"Processing Fees Type"}
                      key={form?.getFieldValue("processingFees")}
                      inputProps={inputProps}
                      select
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option hidden></option>
                      <option value="Number">Number</option>
                      <option value="Percent">Percent</option>
                    </TextField>
                  </Form.Item>
                </div>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"processingFees"}
                  rules={[
                    {
                      required: true,
                      message: "Processing Fee is mandatory",
                    },

                    {
                      pattern:
                        pfType === "Percent"
                          ? new RegExp(/^(100|([0-9][0-9]?(\.[0-9]+)?))$/)
                          : new RegExp(/^[0-9]*$/),
                      message: "Invalid Percent Input",
                    },
                    {
                      validator: checkPF,
                    },
                  ]}
                >
                  <TextField
                    InputProps={{
                      ...inputProps,

                      endAdornment:
                        pfType?.toLowerCase() === "percent" ? (
                          <InputAdornment position="end">%</InputAdornment>
                        ) : (
                          <span />
                        ),
                    }}
                    key={form?.getFieldValue("processingFees")}
                    className="processingFees"
                    type="number"
                    id="processingFees"
                    label="Processing Fees*"
                    fullWidth
                    onKeyDown={(e) =>
                      pfType?.toLowerCase() === "number" &&
                      e.keyCode === 190 &&
                      e.preventDefault()
                    }
                    onInput={(e) => {
                      e.target.value =
                        pfType?.toLowerCase() === "percent"
                          ? e.target.value.toString()
                            ? e.target.value.toString().slice(0, 5)
                            : e.target.value
                                .toString()
                                .slice(0, e.target.value.length - 1)
                          : e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item
                  name={"preEmi"}
                  rules={[
                    {
                      required: true,
                      message: "Pre EMI Fees is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="preEmi"
                    inputProps={inputProps}
                    type="number"
                    id="preEmi"
                    label="Pre Emi*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"convenienceCharges"}
                  rules={[
                    {
                      required: true,
                      message: "Convenience Charges is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="convenienceCharges"
                    inputProps={inputProps}
                    type="number"
                    id="convenienceCharges"
                    label="Convenience Charges*"
                    fullWidth
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                  />
                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item
                  name={"pddCharges"}
                  rules={[
                    {
                      required: true,
                      message: "PDD Charges is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="pddCharges"
                    inputProps={{ readOnly: true }}
                    defaultValue={100}
                    type="number"
                    id="pddCharges"
                    label="PDD Charges*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"bureauCharges"}
                  rules={[
                    {
                      required: true,
                      message: "Bureau Charges is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    id="bureauCharges"
                    inputProps={{ readOnly: true }}
                    className="bureauCharges"
                    type="number"
                    label="Bureau Charges*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"stampDuty"}
                  rules={[
                    {
                      required: true,
                      message: "Stamp Duty is mandatory",
                    },
                    {
                      validator: checkStamp,
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    key={form?.getFieldValue("stampDuty")}
                    className="stampDuty"
                    inputProps={inputProps}
                    type="number"
                    id="stampDuty"
                    label="Stamp Duty*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item
                  name={"dealerCharges"}
                  rules={[
                    {
                      required: true,
                      message: "Dealer Charges is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="dealerCharges"
                    inputProps={inputProps}
                    type="number"
                    id="dealerCharges"
                    label="Dealer Charges*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"otherCharges"}
                  rules={[
                    {
                      required: true,
                      message: "Other Charges is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="otherCharges"
                    inputProps={inputProps}
                    type="number"
                    id="otherCharges"
                    label="Other Charges*"
                    fullWidth
                    onKeyDown={(e) => e.keyCode === 190 && e.preventDefault()}
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item
                  name={"ltvPercentage"}
                  rules={[
                    {
                      required: false,
                      message: "LTV Percentage is mandatory",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Invalid Input Number",
                    },
                  ]}
                >
                  <TextField
                    className="ltvPercentage"
                    inputProps={{
                      readOnly: true,
                    }}
                    // inputReadOnly={true}
                    type="number"
                    id="ltvPercentage"
                    label="LTV Percentage"
                    fullWidth
                    onInput={(e) => {
                      e.target.value =
                        e.target.value.length > 1
                          ? e.target.value.replace(/^0+/, "")
                          : e.target.value;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item
                  name={"dealerPayout"}
                  rules={[
                    {
                      required: true,
                      message: "Dealer Payout is mandatory",
                    },
                    {
                      pattern:
                        typePayout === "percent"
                          ? new RegExp(/^(100|([0-9][0-9]?(\.[0-9]+)?))$/)
                          : new RegExp(/^[0-9]*$/),
                      message: "Invalid Percent Input",
                    },
                  ]}
                >
                  <span>
                    <TextField
                      label="Dealer Payout*"
                      inputProps={inputProps}
                      type="number"
                      value={payout}
                      onChange={(e) => setPayout(e.target.value)}
                      onKeyDown={(e) =>
                        typePayout === "number" &&
                        e.keyCode === 190 &&
                        e.preventDefault()
                      }
                      style={{
                        width: 200,
                        // marginTop: "-5%",
                      }}
                      onInput={(e) => {
                        e.target.value =
                          typePayout === "percent"
                            ? e.target.value.toString()
                              ? e.target.value.toString().slice(0, 5)
                              : e.target.value
                                  .toString()
                                  .slice(0, e.target.value.length - 1)
                            : e.target.value.length > 1
                            ? e.target.value.replace(/^0+/, "")
                            : e.target.value;
                      }}
                    />
                    <Select
                      disabled={
                        props?.freezeLoan &&
                        (props.freezeCase || props.freezeUser)
                      }
                      value={typePayout}
                      style={{
                        width: 80,
                        margin: "0 8px",
                        marginTop: "5%",
                      }}
                      onChange={onCurrencyChange}
                    >
                      <Option value="percent">Percent</Option>
                      <Option value="number">Number</Option>
                    </Select>
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <div className="paddingVertical"></div>

            <br />
            <br />
            <br />
            <h6 className="para-slider">Loan Protect Insurance</h6>
            <Row>
              <Col lg={8}>
                <p className="para-slider-semi-bold">
                  Is Life Insurance taken ?
                </p>
              </Col>
              <br />
              <Col lg={8}>
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
                    style={{ display: "flex", width: "100%" }}
                    disabled={
                      props?.freezeLoan &&
                      (props.freezeCase || props.freezeUser)
                    }
                  >
                    <Radio value={true} style={{ marginRight: 15 }}>
                      Yes
                    </Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <br />
            {islifeInsurance ? (
              <>
                <Row>
                  <Col lg={8}>
                    <p
                      className="para-slider-semi-bold"
                      style={{ marginTop: "10px" }}
                    >
                      Premium Amount{" "}
                    </p>
                  </Col>
                  <Col lg={5}>
                    <Form.Item
                      name={"premiumAmount"}
                      rules={[
                        {
                          required: true,
                          message: "Premium Amount is mandatory",
                        },
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: "Invalid Input Number",
                        },
                      ]}
                    >
                      <TextField
                        inputProps={inputProps}
                        id="premiumAmount"
                        style={{ marginTop: "-15px" }}
                        type="number"
                        label="Premium Amount*"
                        fullWidth
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col lg={8}>
                    <p className="para-slider-semi-bold">
                      Premium Amount to be added to loan amount ?
                    </p>
                  </Col>
                  <Col lg={6}>
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
                        fullWidth
                        disabled={
                          props?.freezeLoan &&
                          (props.freezeCase || props.freezeUser)
                        }
                      >
                        <Radio value={"Y"} style={{ marginRight: 15 }}>
                          Yes
                        </Radio>
                        <Radio value={"N"}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <br />

                <h6 className="para-font-blue">Nominee Details</h6>
                <Row>
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
                      <TextField
                        inputProps={inputProps}
                        className="pr-20"
                        type="name"
                        id="name"
                        label="Name*"
                        fullWidth
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .toString()
                            .match(/^[a-zA-Z ]*$/)
                            ? e.target.value.toString().slice(0, 30)
                            : e.target.value
                                .toString()
                                .slice(0, e.target.value.length - 1);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <div className={"mui-dropdown-wrapper"}>
                      <img
                        alt={"select"}
                        src={SelectIcon}
                        className="searchIcon pr-20"
                      />
                      <Form.Item
                        name="relationType"
                        rules={[
                          {
                            required: true,
                            message: "Relationship selection is mandatory",
                          },
                        ]}
                      >
                        <TextField
                          inputProps={inputProps}
                          className="pr-20"
                          select
                          label="Relationship*"
                          fullWidth
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option hidden></option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Spouse">Spouse</option>
                        </TextField>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col lg={8}>
                    <label
                      id={"date-picker-label"}
                      className={`MuiFormLabel-root MuiInputLabel-root ${
                        (form && form.getFieldValue("dateOfbirth")) ||
                        isSelected
                          ? "MuiInputLabel-animated MuiInputLabel-shrink"
                          : ""
                      } MuiInputLabel-formControl MuiInputLabel-animated`}
                      data-shrink="false"
                      for="dateOfBirth"
                    >
                      Date of Birth*
                    </label>
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
                        inputProps={inputProps}
                        format={customFormat}
                        disabledDate={disabledDate}
                        disabled={
                          props?.freezeLoan &&
                          (props.freezeCase || props.freezeUser)
                        }
                        inputReadOnly={true}
                        placeholder={""}
                        labelId={"date-picker-label"}
                        bordered={false}
                        className={
                          "loanDetailDatePicker MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <br />
                <Row>
                  <Col lg={8}>
                    <Form.Item
                      name={"address"}
                      rules={[
                        {
                          required: true,
                          message: "Address is mandatory",
                        },
                      ]}
                    >
                      <TextField
                        inputProps={inputProps}
                        multiline
                        className="pr-20"
                        type="address"
                        id="address"
                        label="Address*"
                        fullWidth
                        onInput={(e) => {
                          e.target.value = e.target.value.toString()
                            ? e.target.value.toString().slice(0, 255)
                            : e.target.value
                                .toString()
                                .slice(0, e.target.value.length - 1);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              <div></div>
            )}
            <br />
            <Row>
              <Col lg={15}>
                <Form.Item name={"amount"}>
                  <span className="para-font-blue">Finance Amount*</span>

                  <Slider
                    disabled={
                      props?.freezeLoan &&
                      (props.freezeCase || props.freezeUser)
                    }
                    key={amount}
                    defaultValue={amount}
                    ValueLabelComponent={ValueLabelComponent}
                    className={classes.root}
                    marks={marksAmount}
                    track={"normal"}
                    onChangeCommitted={handleSliderAmount}
                    min={20000}
                    max={parseInt(maxAmt)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <TextField
              label="Amount Selected"
              inputProps={inputProps}
              className="form-control amtSelected"
              type="number"
              value={parseInt(selectedAmount) || parseInt(amount)}
              onChange={handleInputChangeAmount}
              onKeyDown={(e) =>
                (e.keyCode === 32 ||
                  e.keycode === 45 ||
                  e.keycode === 173 ||
                  e.keycode === 189) &&
                e.preventDefault()
              }
            />
            <br />
            <br />
            <p className="para-400">
              Approved Loan Amount = &#8377; {approvedLoanAmt}
            </p>
            <br />
              <p className="para-400">
              Amount Requested = &#8377; {amtRequested}
            </p>
            <br />

            <Row>
              <Col lg={6}>
                <div className={"mui-dropdown-wrapper"}>
                  <img
                    alt={"select"}
                    src={SelectIcon}
                    className="searchIcon"
                    style={{ marginTop: 25 }}
                  />
                  <Form.Item name={"tenure"}>
                    <span className="para-font-blue"> Tenure Required*</span>
                    <TextField
                      inputProps={inputProps}
                      select
                      label={"Tenure"}
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                      onChange={(e) => {
                        setTenure(e.target.value);
                        form &&
                          form.setFieldsValue({ tenureInput: e.target.value });
                      }}
                      InputLabelProps={
                        {
                          // shrink: true,
                        }
                      }
                    >
                      <option hidden></option>
                      {getTenureList()}
                    </TextField>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Form.Item
              name={"tenureInput"}
              rules={[
                {
                  validator: handleSliderError,
                },
              ]}
            >
              <div className="para-400">
                Tenure Selected:{" "}
                <Input
                  className="inputSliderTxt"
                  type="number"
                  value={tenure}
                  onChange={handleInputChangeTenure}
                  inputProps={{
                    step: 1,

                    type: "number",
                    "aria-labelledby": "input-slider",
                    readOnly:
                      props?.freezeLoan &&
                      (props.freezeCase || props.freezeUser),
                    disabled:
                      props?.freezeLoan &&
                      (props.freezeCase || props.freezeUser),
                  }}
                />{" "}
                Months
              </div>
            </Form.Item>
            <br />
            <Col lg={5}>
              <Form.Item
                name={"roi"}
                rules={[
                  {
                    required: true,
                    message: "Rate Of Interest is mandatory",
                  },
                  {
                    pattern: new RegExp(/^(100|([0-9][0-9]?(\.[0-9]+)?))$/),
                    message: "Invalid Rate of Interest",
                  },
                ]}
              >
                <TextField
                  inputProps={inputProps}
                  id="roi"
                  className="rateOfInterest"
                  type="number"
                  label="Rate Of Interest % *"
                  fullWidth
                  // onChange={(e) => isEmpty(e.target.value) && setEmi(0)}
                  // onInput={(e) => {
                  //   e.target.value = e.target.value.toString()
                  //     ? e.target.value.toString().slice(0, 5)
                  //     : e.target.value
                  //         .toString()
                  //         .slice(0, e.target.value.length - 1);
                  // }}
                />
              </Form.Item>
            </Col>
            <br />

            <p className="para-slider">
              EMI CALCULATED AMOUNT : &#8377; {Math.ceil(emi)}
            </p>
            <br />

            <div className="alignButton">
              <Button
                className="save-button mr-3"
                onClick={() => {
                  props.history.push(
                    `${public_url.loanSummary}/${props?.qde?.getQdeSectionDetails?.data?.id}`
                  );
                }}
              >
                Loan Summary
              </Button>{" "}
              <Button
                className="cancle-button mr-3"
                onClick={redirectToLeadList}
              >
                {" "}
                Cancel{" "}
              </Button>
              {!(
                props?.freezeLoan &&
                (props.freezeCase || props.freezeUser)
              ) && (
                <Button className="save-button mr-3" htmlType={"submit"}>
                  {" "}
                  Save{" "}
                </Button>
              )}
              <Button
                className="save-button"
                disabled={btnDisable}
                onClick={handleChangeStep}
              >
                {" "}
                Next{" "}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  saveLoanDetail,
  getMaxAmountValue,
  getSchemeCode,
  getSchemeDetails,
  getApprovedLoanAmount,
};

const mapStateToProps = (state) => {
  return {
    qde: state.qde,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanDetails);
