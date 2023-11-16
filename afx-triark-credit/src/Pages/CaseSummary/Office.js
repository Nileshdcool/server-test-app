import React from "react";
import Spin from "../../Components/Spin";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFIDetails } from "../../Redux/Services/Fi";
import { Checkbox } from "antd";
import "./style.scss";

function office(props) {
  const [loader, setLoader] = React.useState(false);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const response = await getFIDetails({
        applicantUniqueId: props?.match?.params?.id,
      });
      setData(response);
    })();
  }, []);

  return (
    <div>
      <Spin spinning={loader}>
        {data?.formType === "Office" || data?.formType === "both" ? (
          <>
            <Row>
              <Col lg={8}>
                <Label
                  label="Application ID"
                  value={data?.office?.applicationId}
                />
              </Col>
              <Col lg={8}>
                <Label label="Date Time" value={data?.office?.dateTime} />
              </Col>
              <Col lg={8}>
                <Label
                  label="Applicant Name"
                  value={data?.office?.applicantName}
                />
              </Col>
            </Row>
            <p className="para-txt">Office Address</p>
            <Row>
              <Col lg={8}>
                <Label
                  label="Address Line 1"
                  value={data?.office?.kycAddressLine1}
                />
              </Col>
              <Col lg={8}>
                <Label
                  label="Address Line 2"
                  value={data?.office?.kycAddressLine2}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <Label label="Pincode" value={data?.office?.kycPincode} />
              </Col>{" "}
              <Col lg={8}>
                <Label label="City" value={data?.office?.kycCity} />
              </Col>{" "}
              <Col lg={8}>
                <Label label="State" value={data?.office?.kycState} />
              </Col>
            </Row>
            <p className="para-txt">Address Tallied</p>
            <Row>
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.addressTallied}
                  disabled={data?.office?.addressTallied !== true}
                  value={true}
                >
                  Yes
                </Checkbox>
                <Checkbox
                  checked={!data?.office?.addressTallied}
                  disabled={data?.office?.addressTallied !== false}
                  value={false}
                >
                  No
                </Checkbox>
              </Col>
            </Row>
            <br />
            <Row>
              <Col lg={8}>
                <Label label="Mobile Number" value={data?.office?.mobileNo} />
              </Col>{" "}
              <Col lg={8}>
                <Label
                  label="Alternate Mobile Number"
                  value={data?.office?.altMobileNo}
                />
              </Col>
            </Row>
            <p className="para-txt full-width">Period of Stay</p>
            <Row>
              <Col lg={8}>
                <Label label="Years" value={data?.office?.fromYear} />
              </Col>
              <Col lg={8}>
                <Label label="Months" value={data?.office?.fromMonth} />
              </Col>
            </Row>
            <p className="para-txt">Nature of Work</p>
            <Row gutter={[20, 20]}>
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.natureOfWork === "Own Office"}
                  disabled={data?.office?.natureOfWork !== "Own Office"}
                >
                  Own Office
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.natureOfWork === "Rental"}
                  disabled={data?.office?.natureOfWork !== "Rental"}
                >
                  Rental
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.natureOfWork === "Employee"}
                  disabled={data?.office?.natureOfWork !== "Employee"}
                >
                  Employee
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.natureOfWork === "Others"}
                  disabled={data?.office?.natureOfWork !== "Others"}
                  // value={true}
                >
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
                  checked={data?.office?.idProof.some((re) => {
                    return re.name === "GST Certificate";
                  })}
                  disabled={
                    !data?.office?.idProof.some((re) => {
                      return re.name === "GST Certificate";
                    })
                  }
                >
                  GST Certificate
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.idProof.some((re) => {
                    return re.name === "Gumasta License";
                  })}
                  disabled={
                    !data?.office?.idProof.some((re) => {
                      return re.name === "Gumasta License";
                    })
                  }
                >
                  Gumasta License
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.idProof.some((re) => {
                    return re.name === "Certification of Incorporation";
                  })}
                  disabled={
                    !data?.office?.idProof.some((re) => {
                      return re.name === "Certification of Incorporation";
                    })
                  }
                >
                  Certification of Incorporation
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.idProof.some((re) => {
                    return re.name === "Power Bill";
                  })}
                  disabled={
                    !data?.office?.idProof.some((re) => {
                      return re.name === "Power Bill";
                    })
                  }
                >
                  Power Bill
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.idProof.some((re) => {
                    return re.name === "Phone Bill";
                  })}
                  disabled={
                    !data?.office?.idProof.some((re) => {
                      return re.name === "Phone Bill";
                    })
                  }
                >
                  Phone Bill
                </Checkbox>
              </Col>{" "}
              <Col lg={8}>
                {" "}
                <Checkbox
                  checked={data?.office?.idProof.some((re) => {
                    return re.name === "Other";
                  })}
                  disabled={
                    !data?.office?.idProof.some((re) => {
                      return re.name === "Other";
                    })
                  }
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
                  value={data?.office?.otherProofName}
                />
                <br />
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <Label
                  label="Verified By / Verifier Met With"
                  value={data?.office?.verifyby?.name}
                />
              </Col>{" "}
              <Col lg={8}>
                <Label
                  label="Respondent's Name"
                  value={data?.office?.respondentsName}
                />
              </Col>{" "}
              <Col lg={8}>
                <Label
                  label="Respondent's Contact Number"
                  value={data?.office?.respondentsContactNo}
                />
              </Col>
              <Col lg={8}>
                <Label
                  label="Respondent's Remark"
                  value={data?.office?.respondentsRemark}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <p className="para-txt">Name Plate Seen</p>
              </Col>{" "}
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.namePlate === true}
                  disabled={data?.office?.namePlate !== true}
                >
                  Yes
                </Checkbox>
              </Col>
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.namePlate === false}
                  disabled={data?.office?.namePlate !== false}
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
                  checked={data?.office?.thirdPartyCheckDone === true}
                  disabled={data?.office?.thirdPartyCheckDone !== true}
                >
                  Yes
                </Checkbox>
              </Col>
              <Col lg={8}>
                <Checkbox
                  checked={data?.office?.thirdPartyCheckDone === false}
                  disabled={data?.office?.thirdPartyCheckDone !== false}
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
                  value={data?.office?.thirdPartyCheckDoneDetails}
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
                  value={data?.office?.verificationStatus?.name}
                />
              </Col>{" "}
              <Col lg={12}>
                <Label
                  label="Nearest Landmark"
                  value={data?.office?.landmark}
                />
              </Col>{" "}
            </Row>
            <Row>
              <Col lg={24}>
                <Label label="Remarks" value={data?.office?.remark} />
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <Label
                  label="Verifier's Name"
                  value={data?.office?.fieldVerifierName}
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
                  checked={data?.office?.photoOfPremises === true}
                  disabled={data?.office?.photoOfPremises !== true}
                >
                  Yes
                </Checkbox>
              </Col>{" "}
              <Col lg={12}>
                <Checkbox
                  checked={data?.office?.photoOfPremises === false}
                  disabled={data?.office?.photoOfPremises !== false}
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

export default office;
