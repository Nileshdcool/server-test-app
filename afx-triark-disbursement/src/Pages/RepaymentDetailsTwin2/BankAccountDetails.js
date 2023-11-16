import React, { useContext, useEffect, useState } from "react";
import Label from "../../Components/label";
import { Row, Col, Input, Button } from "antd";
import { getBankDetailsTwin2 } from "../../Redux/Services/repaymentTwin2";
import InputText from "../../Components/Input";
import Verified from "../../Assets/verified.png";
import { notification, Modal } from "antd";

function BankAccountDetails(props) {
  const [bankAccDetails, setBankAccDetails] = useState([]);
  const [type, setType] = useState();
  const [verifyDisable, setVerifyDisable] = useState(false);
  const [verifiedData, setVerifiedData] = useState();
  const [editFlag, setEditFlag] = useState(false);
  const [dropSelected, setDropSelected] = useState("");
  const [dropValue, setDropValue] = useState([]);
  const [accNumber, setAccNumber] = useState(null);
  const [ifscNumber, setIfscNumber] = useState(null);
  const [bankName, setBankName] = useState(null);
  const [open, setOpen] = useState(false);
  const flagRef = React.useRef(true);

  // functions

  const OpenModal = () => {
    setOpen(true);
  };

  const enableEdit = async () => {
    setEditFlag(true);
    // editCount()
    setOpen(false);

    // const response = await editCount({
    //   applicantUniqueId: props.match.params.id,
    //   type: type,
    // });
  };

  useEffect(() => {
    (async () => {
      const response = await getBankDetailsTwin2({
        gupdhupId: props.match.params.id,
      });
      setBankAccDetails(response);
      if (response?.indSelfSoleFlag) {
        setType("business");
      } else if (!response?.indSelfSoleFlag) {
        setType("personal");
      }
    })();

    (async () => {
      // const response = await getDropdownValue();
      //
      const response = [
        {
          bankAccountType: "Savings",
          id: 1,
          is_delete: false,
        },
        {
          bankAccountType: "Current",
          id: 2,
          is_delete: false,
        },
      ];
      setDropValue(response);
    })();
  }, []);

  let dropOptions =
    dropValue &&
    dropValue.map((re) => {
      return { label: re.bankAccountType, value: re.bankAccountType };
    });

  const verifyPenny = async () => {
    // if (
    //   dropSelected !== "" &&
    //   (bankAccDetails?.verified || verifiedData?.verified)
    // ) {
    //   const response = await verifyBankAccount({
    //     applicantUniqueId: props.match.params.id,
    //     accountNumber: bankAccDetails?.accountNumber,
    //     ifscNumber: bankAccDetails?.ifscNumber,
    //     bankName: bankAccDetails?.bankName,
    //     accountType: dropSelected,
    //     type: type,
    //   });
    //   // setEditFlag(response?.verified);
    //   setVerifiedData(response);
    //   setVerifyDisable(true);
    // } else {
    if (dropSelected !== "" && ifscNumber && accNumber) {
      // const response = await verifyBankAccount({
      //   applicantUniqueId: props.match.params.id,
      //   accountNumber: accNumber,
      //   ifscNumber: ifscNumber,
      //   bankName: bankName,
      //   accountType: dropSelected,
      //   type: type,
      // });
      // setVerifiedData(response);
      setVerifyDisable(true);
      getBankDetail();
    } else notification.error({ message: "Please Enter Credentials" });
    // }
  };

  const getBankDetail = () => {
    // (async () => {
    //   const response = await getBanktDetails({
    //     applicantUniqueId: props.match.params.id,
    //   });
    //   setBankAccDetails(response);
    //   if (response?.indSelfSoleFlag) {
    //     setType("business");
    //   } else if (!response?.indSelfSoleFlag) {
    //     setType("personal");
    //   }
    // })();
  };

  const changeIFSC = (e) => {
    setIfscNumber(e?.target?.value);
    if (e?.target?.value.length === 11) {
      // call api
      // (async () => {
      //   const response = await getIFSCDetails({
      //     ifsc: e.target.value,
      //   });
      //
      //   if (response?.bank) {
      //     setBankName(response.bank);
      //   }
      // })();
    }
  };

  React.useEffect(() => {
    if (
      flagRef.current &&
      bankAccDetails?.accountNumber &&
      bankAccDetails?.ifscNumber &&
      bankAccDetails?.bankName &&
      bankAccDetails?.accountType
    ) {
      setAccNumber(bankAccDetails?.accountNumber);
      setIfscNumber(bankAccDetails?.ifscNumber);
      setBankName(bankAccDetails?.bankName);
      setDropSelected(bankAccDetails?.accountType);
      flagRef.current = false;
    }
  }, [
    bankAccDetails?.accountNumber,
    bankAccDetails?.ifscNumber,
    bankAccDetails?.bankName,
    bankAccDetails?.accountType,
  ]);

  React.useEffect(() => {
    if (verifiedData?.verified) {
      setEditFlag(false);
    }
  }, [verifiedData?.verified]);
  return (
    <>
      <Modal
        visible={open}
        onOk={() => {
          enableEdit();
        }}
        zIndex={1000}
        closable={true}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          style: {
            backgroundColor: "#0D6BC8",
          },
        }}
      >
        <p>Are You sure You want to Edit ?</p>
      </Modal>
      <Row gutter={48}>
        <Col lg={8}>
          <Label
            label="Main Applicant Name"
            value={bankAccDetails?.accountHolderName}
          />
        </Col>
        <Col lg={16}>
          <Label label="Account Type" value={bankAccDetails?.accountType} />
        </Col>
        <Col lg={8}>
          {editFlag ? (
            <InputText
              type="number"
              label={"Account Number"}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/ +?/g, "");
              }}
              onChange={(e) => setAccNumber(e?.target?.value)}
              value={accNumber}
              defaultValue={
                bankAccDetails?.accountNumber?.toString()
                  ? bankAccDetails?.accountNumber?.toString()
                  : " "
              }
            />
          ) : (
            <Label
              label="Account Number"
              value={bankAccDetails?.accountNumber}
            />
          )}
        </Col>
        <Col lg={8}>
          {editFlag ? (
            <InputText
              // readOnly={userFreeze || caseFreeze}
              label={"IFSC Code"}
              onChange={changeIFSC}
              value={ifscNumber}
              onInput={(e) => {
                e.target.value = e.target.value
                  // .slice(0, 11)
                  .toUpperCase()
                  .replace(/ +?/g, "");
              }}
              defaultValue={
                bankAccDetails?.ifscNumber?.toString()
                  ? bankAccDetails?.ifscNumber?.toString()
                  : " "
              }
            />
          ) : (
            <Label label="IFSC Code" value={bankAccDetails?.ifscNumber} />
          )}
        </Col>
        <Col lg={8}>
          {editFlag ? (
            <InputText
              // readOnly={userFreeze || caseFreeze}
              label={"Bank Name"}
              value={bankName}
              onChange={(e) => setBankName(e?.target?.value)}
              onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
              defaultValue={
                bankAccDetails?.bankName?.toString()
                  ? bankAccDetails?.bankName?.toString()
                  : " "
              }
              // key={disbsData?.adminFees}
            />
          ) : (
            <Label label="Bank Name" value={bankAccDetails?.bankName} />
          )}
        </Col>
        {!editFlag && (bankAccDetails?.verified || verifiedData?.verified) && (
          <Col lg={8}>
            <Label
              label="Account Holder's Name"
              value={
                bankAccDetails?.accountHolderName ||
                verifiedData?.accountHolderName
              }
            />
          </Col>
        )}
      </Row>

      {/* {!(bankAccDetails?.verified || verifiedData?.verified) ? (
        <>
          <br />
          <Row>
            <Button onClick={verifyPenny} className={"reset-button"}>
              Verify
            </Button>
            <Button className={"reset-button ml-2"} onClick={OpenModal}>
              Edit
            </Button>
          </Row>
        </>
      ) : editFlag ? (
        <>
          <br />
          <Row>
            <Button
              onClick={verifyPenny}
              className={"reset-button"}
              style={{ marginTop: "-8px" }}
            >
              Verify
            </Button>
            <Button
              className="reset-button ml-2"
              onClick={OpenModal}
              style={{ marginTop: "-8px" }}
            >
              Edit
            </Button>
            <Button
              className="reset-button ml-2"
              onClick={OpenModal}
              style={{ marginTop: "-8px" }}
            >
              Save
            </Button>
          </Row>
        </>
      ) : (
        <>
          <br />
          <Row>
            <img alt="verified" src={Verified} height="2%" width="2%" />
            <span>&nbsp;&nbsp;Verified</span>
            <Button
              className="reset-button ml-2"
              onClick={OpenModal}
              style={{ marginTop: "-8px" }}
            >
              Edit
            </Button>
          </Row>
        </>
      )} */}
    </>
  );
}

export default BankAccountDetails;
