import { Steps } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setHeading } from "../../Redux/Action/App";
import { resetPan } from "../../Redux/Action/Qde";
import { getLeadDetails } from "../../Redux/Services/leads";
import { getQdeDetail } from "../../Redux/Services/Qde";
import "../Qde/style.scss";
import Additional from "./additionalDetails";
import LoanDetails from "./LoanDetails";
import BusinessDetails from "./buisnessDetails";
import Pan from "./pan&gstverify";
import References from "./References";
import Schemes from "./scheme";
import { getLoanSummary } from "../../Redux/Services/LoanSummary";
import filter from "lodash/filter";
import PersonalDetails from "./PersonalDetails";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      stepDisable: {
        additionalDetails: true,
        references: true,
        personalDetails: true,
        schemes: true,
        loanDetails: true,
      },
      freezUserData: null,
      selfemployedFlag: false,
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    this.props.setHeadingValue("Quick Data Entry");
    if (
      this.props.history.location.state &&
      this.props.history.location.state.stepper
    ) {
      this.changeStep(this.props.history.location.state.stepper);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props &&
      this.props.qde &&
      this.props.qde.getQdeSectionDetails !== prevProps.qde.getQdeSectionDetails
    ) {
      if (
        this.props &&
        this.props.qde &&
        this.props.qde.getQdeSectionDetails &&
        this.props.qde.getQdeSectionDetails.data &&
        this.props.qde.getQdeSectionDetails.data.indSelfSoleFlag
      ) {
        this.setState({ selfemployedFlag: true });
      } else {
        this.setState({ selfemployedFlag: false });
      }
    }

    if (
      this.props.Summary &&
      this.props.Summary.loansummary !== prevProps.Summary.loansummary
    ) {
      this.setState({
        freezUserData:
          this.props.Summary &&
          this.props.Summary.loansummary &&
          this.props.Summary.loansummary.data &&
          this.props.Summary.loansummary.data.mainapplicant &&
          this.props.Summary.loansummary.data.mainapplicant.loanAgreementFlag,
      });
    }
    if (
      prevProps.qde.getQdeSectionDetails !==
        this.props.qde.getQdeSectionDetails &&
      this.props.qde.getQdeSectionDetails.data &&
      this.props.qde.getQdeSectionDetails.data.leadCode &&
      this.props.Summary.summaryFlags === null
    ) {
      let userData = localStorage.getItem("UserData");
      let userDataCopy = JSON.parse(userData);
      let mainApplicantUniqueId =
        this.props &&
        this.props.qde &&
        this.props.qde.getQdeSectionDetails &&
        this.props.qde.getQdeSectionDetails.data &&
        this.props.qde.getQdeSectionDetails.data.mainApplicantUniqueId;
      this.props.getLoanSummary({
        applicant_uniqueid: mainApplicantUniqueId,
        // applicant_uniqueid: this.props.match.params.id,
        lead_code: this.props.qde.getQdeSectionDetails.data.leadCode,
        roleId: userDataCopy && userDataCopy.roleId,
      });
    }

    if (
      prevProps.qde.getQdeSectionDetails !==
        this.props.qde.getQdeSectionDetails &&
      this.props.qde.getQdeSectionDetails.data &&
      this.props.qde.getQdeSectionDetails.data.leadCode &&
      this.props.Summary.summaryFlags
    ) {
      let userData = localStorage.getItem("UserData");
      let userDataCopy = JSON.parse(userData);
      let mainApplicantUniqueId =
        this.props.qde &&
        this.props.qde.getQdeSectionDetails &&
        this.props.qde.getQdeSectionDetails.data &&
        this.props.qde.getQdeSectionDetails.data.mainApplicantUniqueId;
      this.props.getLoanSummary({
        applicant_uniqueid: mainApplicantUniqueId,
        // applicant_uniqueid: this.props.match.params.id,
        lead_code: this.props.qde.getQdeSectionDetails.data.leadCode,
        roleId: userDataCopy && userDataCopy.roleId,
      });
    }
    if (
      this.props.Summary.loansummary &&
      this.props.Summary.loansummary.data &&
      this.props.Summary.loansummary.data.mainapplicant &&
      prevProps.Summary.loansummary.data !== this.props.Summary.loansummary.data
    ) {
      const { journey } = this.props.match.params;
      const {
        loanDetails,
        businessDetails,
        additionalDetails,

        reference,

        panAndGst,
      } =
        this.props.Summary.loansummary &&
        this.props.Summary.loansummary.data &&
        this.props.Summary.loansummary.data.mainapplicant;

      if (journey === "applicant" && this.state.selfemployedFlag) {
        this.setState({
          stepDisable: {
            additionalDetails: !panAndGst,
            businessDetails: !(panAndGst && additionalDetails),
            loanDetails: !(panAndGst && additionalDetails && businessDetails),
            schemes: !(
              panAndGst &&
              additionalDetails &&
              businessDetails &&
              loanDetails
            ),
          },
        });
      } else if (journey === "applicant") {
        this.setState({
          stepDisable: {
            additionalDetails: !panAndGst,
            references: !(panAndGst && additionalDetails),
            loanDetails: !(panAndGst && additionalDetails && reference),
            schemes: !(
              panAndGst &&
              additionalDetails &&
              reference &&
              loanDetails
            ),
          },
        });
      }
    }
    if (
      this.props.Summary.loansummary &&
      this.props.Summary.loansummary.data &&
      this.props.Summary.loansummary.data.mainapplicant &&
      prevProps.Summary.loansummary.data !== this.props.Summary.loansummary.data
    ) {
      const { journey } = this.props.match.params;
      const {
        loanDetails,
        businessDetails,
        additionalDetails,

        reference,

        panAndGst,
        personalDetailsFlag,
      } = this.props.Summary.loansummary.data.mainapplicant;

      if (journey === "applicant" && this.state.selfemployedFlag) {
        this.setState({
          stepDisable: {
            additionalDetails: !panAndGst,
            businessDetails: !(panAndGst && additionalDetails),
            loanDetails: !(panAndGst && additionalDetails && businessDetails),
            schemes: !(
              panAndGst &&
              additionalDetails &&
              businessDetails &&
              loanDetails
            ),
          },
        });
      } else if (journey === "applicant") {
        this.setState({
          stepDisable: {
            additionalDetails: !panAndGst,
            references: !(
              panAndGst &&
              additionalDetails &&
              personalDetailsFlag
            ),
            personalDetails: !(panAndGst && additionalDetails),
            loanDetails: !(
              panAndGst &&
              additionalDetails &&
              personalDetailsFlag &&
              reference
            ),
            schemes: !(
              panAndGst &&
              additionalDetails &&
              personalDetailsFlag &&
              reference &&
              loanDetails
            ),
          },
        });
      }

      const coApplicantArray =
        this.props.Summary.loansummary &&
        this.props.Summary.loansummary.data &&
        this.props.Summary.loansummary.data.coapplicant;
      const coApplicantResult = filter(coApplicantArray, {
        coapplicantUniqueId: this.props.match.params.id,
      });
      if (journey === "co-applicant" && this.state.selfemployedFlag) {
        console.log("inside ao-app");
        this.setState({
          stepDisable: {
            additionalDetails: !(
              coApplicantResult[0] && coApplicantResult[0].panAndGst
            ),
            businessDetails: !(
              coApplicantResult[0] && coApplicantResult[0].additionalDetails
            ),
          },
        });
      } else if (journey === "co-applicant") {
        this.setState({
          stepDisable: {
            additionalDetails: !(
              coApplicantResult[0] && coApplicantResult[0].panAndGst
            ),
            personalDetails: !(
              coApplicantResult[0] && coApplicantResult[0].additionalDetails
            ),
          },
        });
      }
      const guarantorArray =
        this.props.Summary.loansummary &&
        this.props.Summary.loansummary.data &&
        this.props.Summary.loansummary.data.gurantor;
      const guarantorResult = filter(guarantorArray, {
        coapplicantUniqueId: this.props.match.params.id,
      });
      if (journey === "guarantor" && this.state.selfemployedFlag) {
        this.setState({
          stepDisable: {
            additionalDetails: !guarantorResult[0].panAndGst,
            businessDetails:
              guarantorResult[0] && !guarantorResult[0].additionalDetails,
          },
        });
      }
      if (journey === "guarantor") {
        this.setState({
          stepDisable: {
            additionalDetails: !guarantorResult[0].panAndGst,
            personalDetails:
              guarantorResult[0] && !guarantorResult[0].additionalDetails,
          },
        });
      }
    }
    if (
      prevProps.qde.getQdeDetails !== this.props.qde.getQdeDetails &&
      this.props.qde.getQdeDetails
    ) {
      const { id } = this.props.match.params;
      this.props.getQdeDetail({
        applicant_uniqueid: id,
        ismainapplicant: this.props.match.params.journey === "applicant",
        isguarantor: this.props.match.params.journey === "guarantor",
      });
    }
  }

  componentWillUnmount() {
    this.props.resetPan();
  }

  changeStep = (current) => {
    this.setState({
      currentStep: current,
    });
    if (
      this.props.qde.getQdeSectionDetails &&
      this.props.qde.getQdeSectionDetails.data &&
      this.props.qde.getQdeSectionDetails.data.leadCode
    ) {
      let userData = localStorage.getItem("UserData");
      let userDataCopy = JSON.parse(userData);
      let mainApplicantUniqueId =
        this.props.qde &&
        this.props.qde.getQdeSectionDetails &&
        this.props.qde.getQdeSectionDetails.data &&
        this.props.qde.getQdeSectionDetails.data.mainApplicantUniqueId;
      this.props.getLoanSummary({
        applicant_uniqueid: mainApplicantUniqueId,
        // applicant_uniqueid: this.props.match.params.id,
        lead_code: this.props.qde.getQdeSectionDetails.data.leadCode,
        roleId: userDataCopy && userDataCopy.roleId,
      });
    }
  };

  setStepDisable = (obj) => {
    this.setState({
      stepDisable: {
        ...this.state.stepDisable,
        ...obj,
      },
    });
  };
  render() {
      console.log("sss",this?.props?.Summary?.loansummary?.data?.mainapplicant?.panFreeze )
    
    const freezeLoan =
      this?.props?.Summary?.loansummary?.data?.mainapplicant?.qdeSalesFreeze &&
      this?.props?.Summary?.loansummary?.data?.mainapplicant?.loanSchemeFreeze;

    const journey = this.props.match.params.journey;

    const freezeUser =
      this.props.Summary &&
      this.props.Summary.loansummary &&
      this.props.Summary.loansummary.data &&
      this.props.Summary.loansummary.data &&
      this.props.Summary.loansummary.data.modelAccess &&
      this.props.Summary.loansummary.data.modelAccess[0] &&
      this.props.Summary.loansummary.data.modelAccess[0].read;

      const freezeMainPan =
        this?.props?.Summary?.loansummary?.data?.mainapplicant?.panFreeze; 
        
        const freezeCoappPan =
          this?.props?.Summary?.loansummary?.data?.coapplicant?.panFreeze;
          
          const freezeGuarPan =
            this?.props?.Summary?.loansummary?.data?.gurantor?.panFreeze;

    const bureauFreeze =
      this?.props?.Summary?.loansummary?.data?.mainapplicant?.bureauStatus;


    return (
      <div className={"qdeContainer"}>
        <div className={"stepsWrapper"}>
          <div className={"stepsContainer"}>
            <Steps
              labelPlacement={"vertical"}
              size={"small"}
              current={this.state.currentStep}
              onChange={this.changeStep}
            >
              <Steps.Step title="PAN & GST Verification" />

              <Steps.Step
                disabled={this.state.stepDisable.additionalDetails}
                title="Additional Details"
              />

              {!this.state.selfemployedFlag && (
                <Steps.Step
                  disabled={
                    this.state.stepDisable.personalDetails || bureauFreeze
                  }
                  title="Personal Details"
                />
              )}

              {this.state.selfemployedFlag && (
                <Steps.Step
                  disabled={
                    this.state.stepDisable.businessDetails || bureauFreeze
                  }
                  title="Business Details"
                />
              )}

              {journey === "applicant" && (
                <Steps.Step
                  title="References"
                  disabled={this.state.stepDisable.references || bureauFreeze}
                />
              )}

              {journey === "applicant" && (
                <Steps.Step
                  title="Loan Details"
                  disabled={this.state.stepDisable.loanDetails || bureauFreeze}
                />
              )}

              {journey === "applicant" && (
                <Steps.Step
                  title="Schemes"
                  disabled={this.state.stepDisable.schemes || bureauFreeze}
                />
              )}
            </Steps>
          </div>
        </div>
        <div className={"qdeContentWrapper"}>
          <div className={"qdeContentContainer"}>
            {this.state.currentStep === 0 && (
              <Pan
                setStepDisable={this.setStepDisable}
                match={this.props.match}
                leadDetails={
                  this.props.leads.leads.data ? this.props.leads.leads.data : {}
                }
                journey={journey}
                history={this.props.history}
                changeStep={this.changeStep}
                getQdeDetails={this.props.getQdeDetail}
                freezeCase={this.state.freezUserData}
                freezeUser={freezeUser}
                freezePan={freezeMainPan}
                freezeCoappPan={freezeCoappPan}
                freezeGuarPan={freezeGuarPan}
              />
            )}
            {this.state.currentStep === 1 && (
              <Additional
                setStepDisable={this.setStepDisable}
                match={this.props.match}
                leadDetails={this.props.leads.commonLeads}
                journey={journey}
                history={this.props.history}
                changeStep={this.changeStep}
                freezeCase={this.state.freezUserData}
                freezeUser={freezeUser}
                bureauFreeze={bureauFreeze}
              />
            )}
            {this.state.currentStep === 2 && this.state.selfemployedFlag && (
              <BusinessDetails
                setStepDisable={this.setStepDisable}
                match={this.props.match}
                journey={journey}
                leadDetails={this.props.leads.leads.data}
                history={this.props.history}
                changeStep={this.changeStep}
                freezeCase={this.state.freezUserData}
                freezeUser={freezeUser}
                bureauFreeze={bureauFreeze}
              />
            )}
            {this.state.currentStep === 2 && !this.state.selfemployedFlag && (
              <PersonalDetails
                setStepDisable={this.setStepDisable}
                match={this.props.match}
                journey={journey}
                leadDetails={this.props.leads.leads.data}
                history={this.props.history}
                changeStep={this.changeStep}
                freezeCase={this.state.freezUserData}
                freezeUser={freezeUser}
                bureauFreeze={bureauFreeze}
              />
            )}
            {this.state.currentStep === 3 && (
              <References
                setStepDisable={this.setStepDisable}
                match={this.props.match}
                journey={journey}
                leadDetails={this.props.leads.leads.data}
                history={this.props.history}
                changeStep={this.changeStep}
                freezeCase={this.state.freezUserData}
                freezeUser={freezeUser}
                bureauFreeze={bureauFreeze}
              />
            )}
            {this.state.currentStep === 4 && (
              <LoanDetails
                setStepDisable={this.setStepDisable}
                match={this.props.match}
                leadDetails={this.props.leads.leads.data}
                changeStep={this.changeStep}
                history={this.props.history}
                freezeCase={this.state.freezUserData}
                freezeUser={freezeUser}
                selfemployedFlag={this.state.selfemployedFlag}
                bureauFreeze={bureauFreeze}
                freezeLoan={freezeLoan}
              />
            )}

            {this.state.currentStep === 5 && (
              <Schemes
                setStepDisable={this.setStepDisable}
                match={this.props.match}
                changeStep={this.changeStep}
                history={this.props.history}
                freezeCase={this.state.freezUserData}
                freezeUser={freezeUser}
                bureauFreeze={bureauFreeze}
                freezeLoan={freezeLoan}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    leads: state.leads,
    qde: state.qde,
    Summary: state.Summary,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    setHeadingValue: (payload) => {
      dispatch(setHeading(payload));
    },
    getLeadDetails: (payload) => {
      dispatch(getLeadDetails(payload));
    },
    resetPan: (payload) => {
      dispatch(resetPan());
    },
    getQdeDetail: (payload) => {
      dispatch(getQdeDetail(payload));
    },
    getLoanSummary: (payload) => {
      dispatch(getLoanSummary(payload));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(index);
