import React from "react";
import Spin from "../../Components/Spin";
import { useParams } from "react-router-dom";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFIDetails } from "../../Redux/Services/Fi"
import { Checkbox } from "antd";
import "./style.scss";

function Residence() {
  const { id } = useParams();
  const [loader, setLoader] = React.useState(false);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const response = await getFIDetails({
        applicantUniqueId: id,
      });
      setData(response);
    })();
  }, []);

  return (
    <div>
      <Spin spinning={loader}>
        {data?.formType === "residence" || data?.formType === "both" ? (
          <>
            <Row>
              <Col lg={8}>
                <Label
                  label="Application ID"
                  value={data?.residence?.applicationId}
                />
              </Col>
              <Col lg={8}>
                <Label label="Date Time" value={data?.residence?.dateTime} />
              </Col>
              <Col lg={8}>
                <Label
                  label="Applicant Name"
                  value={data?.residence?.applicantName}
                />
              </Col>
            </Row>
            <p className="para-txt">Residential Address 1</p>
            <Row>
              <Col lg={8}>
                <Label
                  label="Address Line 1"
                  value={data?.residence?.kycAddressLine1}
                />
              </Col>
              <Col lg={8}>
                <Label
                  label="Address Line 2"
                  value={data?.residence?.kycAddressLine2}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <Label label="Pincode" value={data?.residence?.kycPincode} />
              </Col>{" "}
              <Col lg={8}>
                <Label label="City" value={data?.residence?.kycCity} />
              </Col>{" "}
              <Col lg={8}>
                <Label label="State" value={data?.residence?.kycState} />
              </Col>
            </Row>
            <p className="para-txt">Residential Address 2</p>
            <Row>
              <Col lg={8}>
                <Label
                  label="Address Line 1"
                  value={data?.residence?.utilityAddressLine1}
                />
              </Col>
              <Col lg={8}>
                <Label
                  label="Address Line 2"
                  value={data?.residence?.utilityAddressLine2}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <Label
                  label="Pincode"
                  value={data?.residence?.utilityPincode}
                />
              </Col>{" "}
              <Col lg={8}>
                <Label label="City" value={data?.residence?.utilityCity} />
              </Col>{" "}
              <Col lg={8}>
                <Label label="State" value={data?.residence?.utilityState} />
              </Col>
            </Row>
            <p className="para-txt">Address Tallied</p>
            <Row>
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.addressTallied}
                  disabled={data?.residence?.addressTallied !== true}
                  value={true}>
                  Yes
                </Checkbox>
                <Checkbox
                  checked={!data?.residence?.addressTallied}
                  disabled={data?.residence?.addressTallied !== false}
                  value={false}>
                  No
                </Checkbox>
              </Col>
            </Row>
            <br />
            <Row>
              <Col lg={8}>
                <Label
                  label="Mobile Number"
                  value={data?.residence?.mobileNo}
                />
              </Col>{" "}
              <Col lg={8}>
                <Label
                  label="Alternate Mobile Number"
                  value={data?.residence?.altMobileNo}
                />
              </Col>
            </Row>
            <p className="para-txt full-width">Period of Stay</p>
            <Row>
              <Col lg={8}>
                <Label label="Years" value={data?.residence?.fromYear} />
              </Col>
              <Col lg={8}>
                <Label label="Months" value={data?.residence?.fromMonth} />
              </Col>
            </Row>
            <p className="para-txt">Nature of Residence</p>
            <Row gutter={[20, 20]}>
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.natureOfWork === "Own House"}
                  disabled={data?.residence?.natureOfWork !== "Own House"}>
                  Own House
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.natureOfWork === "Rental House"}
                  disabled={data?.residence?.natureOfWork !== "Rental House"}>
                  Rental House
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.natureOfWork === "Paying Guest(PG)"}
                  disabled={
                    data?.residence?.natureOfWork !== "Paying Guest(PG)"
                  }>
                  Paying Guest (PG)
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.natureOfWork === "Hostel"}
                  disabled={data?.residence?.natureOfWork !== "Hostel"}>
                  Hostel
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.natureOfWork === "Others"}
                  disabled={data?.residence?.natureOfWork !== "Others"}>
                  Other
                </Checkbox>
              </Col>{" "}
              <Col lg={8}></Col>{" "}
            </Row>
            <p className="para-txt">
              Identity Proof provided by candidate & seen by verifier mentioned
              below
            </p>
            <Row gutter={[20, 20]}>
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Ration Card";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Ration Card";
                    })
                  }>
                  Ration Card
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Passport";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Passport";
                    })
                  }>
                  Passport
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Driving License";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Driving License";
                    })
                  }>
                  Driving License
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Power Bill";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Power Bill";
                    })
                  }>
                  Power Bill
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Water Bill";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Water Bill";
                    })
                  }>
                  Water Bill
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Phone Bill";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Phone Bill";
                    })
                  }>
                  Phone Bill
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                {" "}
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Bank Statement";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Bank Statement";
                    })
                  }>
                  Bank Statement
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                {" "}
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Rent Agreement";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Rent Agreement";
                    })
                  }>
                  Rent Agreement
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                {" "}
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Election card";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Election card";
                    })
                  }>
                  Election Card
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                {" "}
                <Checkbox
                  checked={data?.residence?.idProof.some((re) => {
                    return re.name === "Other";
                  })}
                  disabled={
                    !data?.residence?.idProof.some((re) => {
                      return re.name === "Other";
                    })
                  }
                  // value={true}
                >
                  Other (specify)
                </Checkbox>
              </Col>{" "}
            </Row>
            <Row>
              <Col lg={24}>
                <br />
                <Label
                  label="Other, nature of association"
                  value={data?.residence?.otherProofName}
                />
                <br />
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <Label
                  label="Verified By / Verifier Met With"
                  value={data?.residence?.verifyby?.name}
                />
              </Col>{" "}
              <Col lg={8}>
                <Label
                  label="Respondent's Name"
                  value={data?.residence?.respondentsName}
                />
              </Col>{" "}
              <Col lg={8}>
                <Label
                  label="Respondent's Contact Number"
                  value={data?.residence?.respondentsContactNo}
                />
              </Col>
              <Col lg={8}>
                <Label
                  label="Respondent's Remark"
                  value={data?.residence?.respondentsRemark}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <p className="para-txt">Name Plate Seen</p>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.namePlate === true}
                  disabled={data?.residence?.namePlate !== true}
                  // value={true}
                >
                  Yes
                </Checkbox>
              </Col>
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.namePlate === false}
                  disabled={data?.residence?.namePlate !== false}
                  // value={false}
                >
                  No
                </Checkbox>
              </Col>
            </Row>
            <br />
            <Row>
              <Col lg={24}>
                <p className="para-txt">
                  Neighbourhood / third party check done
                </p>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.thirdPartyCheckDone === true}
                  disabled={data?.residence?.thirdPartyCheckDone !== true}
                  // value={true}
                >
                  Yes
                </Checkbox>
              </Col>
              <Col lg={8}>
                <Checkbox
                  checked={data?.residence?.thirdPartyCheckDone === false}
                  disabled={data?.residence?.thirdPartyCheckDone !== false}
                  // value={false}
                >
                  No
                </Checkbox>
              </Col>
            </Row>
            <br />
            <Row gutter={[20, 20]}>
              <Col lg={12}>
                <Label
                  label="Details Neighbourhood/ third party check done"
                  value={data?.residence?.thirdPartyCheckDoneDetails}
                />
              </Col>{" "}
            </Row>
            <Row>
              <Col lg={24}>
                <p className="para-txt">Field Verifier's Comments</p>
              </Col>{" "}
            </Row>
            <Row>
              <Col lg={12}>
                <Label
                  label="Verification Status"
                  value={data?.residence?.verificationStatus?.name}
                />
              </Col>{" "}
              <Col lg={12}>
                <Label
                  label="Nearest Landmark"
                  value={data?.residence?.landmark}
                />
              </Col>{" "}
            </Row>
            <Row>
              <Col lg={24}>
                <Label label="Remarks" value={data?.residence?.remark} />
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <Label
                  label="Verifier's Name"
                  value={data?.residence?.fieldVerifierName}
                />
              </Col>
            </Row>{" "}
            <Row>
              <Col lg={24}>
                <p className="para-txt">Photo of Premises</p>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Checkbox
                  checked={data?.residence?.photoOfPremises === true}
                  disabled={data?.residence?.photoOfPremises !== true}
                  // value={true}
                >
                  Yes
                </Checkbox>
              </Col>{" "}
              <Col lg={12}>
                <Checkbox
                  checked={data?.residence?.photoOfPremises === false}
                  disabled={data?.residence?.photoOfPremises !== false}
                  // value={false}
                >
                  No
                </Checkbox>
              </Col>{" "}
            </Row>
          </>
        ) : (
          <p>Pending</p>
        )}
      </Spin>
    </div>
  );
}

export default Residence;
