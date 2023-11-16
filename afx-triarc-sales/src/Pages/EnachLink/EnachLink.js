import React from "react";
import { Col, Row, Button } from "antd";
import { connect } from "react-redux";
import { useLocation} from "react-router-dom";
import {getCodeAndId} from "../../Redux/Services/EnachLink";
import {
  getEnach,
  saveUpdateRepayment,
  saveRepayment,
} from "../../Redux/Services/Repayment";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const EnachLink = (props) => {
  const [enachResponse, setEnachResponse] = React.useState("");
  const [showEnach, setShowEnach] = React.useState(false);

  const query = useQuery();
  let genericCode = query.get("genericCode");
  let gc = genericCode.replaceAll(" ", "+");
  let id = query.get("id");
  let applicantUniqueId = query.get("applicantUniqueId");

  React.useEffect (() => {
    (async () => {
      const response = await props.getEnach({
        applicantUniqueId: applicantUniqueId,
      });
      console.log("responseNach", response);
    })();
  }, []);

  const getCodeAndIdFunction = async() =>{
    const response = await props.getCodeAndId({
      genericCode: gc,
      id: id,
      applicantUniqueId: applicantUniqueId,
    });
    props.saveRepayment({
      repaymentMode: "nach",
      applicantUniqId: applicantUniqueId,
      comments: "",
    });
    setEnachResponse(response?.payload?.data);
    setShowEnach(true)
  }

  React.useEffect(() => {
    (async () => {
      const response = await props.getCodeAndId({
        genericCode: gc,
        id: id,
        applicantUniqueId: applicantUniqueId,
      });
      props.saveRepayment({
        repaymentMode: "nach",
        applicantUniqId: applicantUniqueId,
        comments: "",
      });
      setEnachResponse(response?.payload?.data);
      setShowEnach(true);
    })();
  }, [genericCode, id, applicantUniqueId]);

    localStorage.setItem("accountType", enachResponse?.accountType);
    localStorage.setItem("amountType", enachResponse?.amountType);
    localStorage.setItem("consumerEmailId", enachResponse?.consumerEmailId);
    localStorage.setItem("consumerId", enachResponse?.consumerId);
    localStorage.setItem("consumerMobileNo", enachResponse?.consumerMobileNo);
    localStorage.setItem("currency", enachResponse?.currency);
    localStorage.setItem("debitEndDate", enachResponse?.debitEndDate);
    localStorage.setItem("debitStartDate", enachResponse?.debitStartDate);
    localStorage.setItem("deviceId", enachResponse?.deviceId);
    localStorage.setItem("frequency", enachResponse?.frequency);
    localStorage.setItem("maxAmount", enachResponse?.maxAmount);
    localStorage.setItem("merchantId", enachResponse?.merchantId);
    localStorage.setItem("paymentMode", enachResponse?.paymentMode);
    localStorage.setItem("returnUrl", enachResponse?.returnUrl);
    localStorage.setItem("token", enachResponse?.token);
    localStorage.setItem("txnId", enachResponse?.txnId);

  return (
    <>
      <Row
        style={{
          padding: "30px 15px 0px 15px",
          fontSize: "70%",
          fontWeight: "600",
        }}>
        e-NACH is a new payment service where mandates are registered in a real
        time basis with customers net banking / debit card details.
      </Row>
      <br />
      <div
        style={{
          padding: "0px 15px 0px 15px",
          fontSize: "70%",
          fontWeight: "900",
        }}>
        Featured :
      </div>
      <Row
        style={{
          padding: "0px 15px 30px 15px",
          fontSize: "70%",
          fontWeight: "600",
        }}>
        Real time mandate realization
        <br />
        Governed by NPCI
        <br />
        35 net banking and 23 debit card banks available Single integration{" "}
        <br />
        across NPCI Standard NACH transaction process <br />
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "center" }}>
          {/* {!showEnach && (
            <Button className="save-button" onClick={getCodeAndIdFunction}>
              Submit Enach
            </Button>
          )} */}
          {/* {!showEnach && ( */}
          <Button
            className="save-button"
            id="btnSubmit"
            // onClick={getCodeAndIdFunction}
          >
            Register Mandate
          </Button>
          {/* )} */}
        </Col>
      </Row>
    </>
  );
};

const mapDispatchToProps = {
  getCodeAndId,
  getEnach,
  saveUpdateRepayment,
  saveRepayment,
};

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnachLink);