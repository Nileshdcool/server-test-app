import React from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";

function BankDetails(data, props) {
  return (
    <>
      <b>Salary Slips</b>
      <br />
      <Row>
        <Col lg={8}>
          <p
            className="cursorPointer"
            onClick={() => {
              window.open(
                getFilePath(
                  data?.data?.salarySlip[data?.data?.salarySlip.length - 3]
                    ?.filePath
                )
              );
            }}>
            <Label
              label={
                data?.data?.salarySlip[data?.data?.salarySlip.length - 3]
                  ?.docType
              }
              value={
                data?.data?.salarySlip[data?.data?.salarySlip.length - 3]
                  ?.fileName
              }
            />
          </p>
        </Col>
        <Col lg={8}>
          <p
            className="cursorPointer"
            onClick={() => {
              window.open(
                getFilePath(
                  data?.data?.salarySlip[data?.data?.salarySlip.length - 2]
                    ?.filePath
                )
              );
            }}>
            <Label
              label={
                data?.data?.salarySlip[data?.data?.salarySlip.length - 2]
                  ?.docType
              }
              value={
                data?.data?.salarySlip[data?.data?.salarySlip.length - 2]
                  ?.fileName
              }
            />
          </p>
        </Col>
        <Col lg={8}>
          <p
            className="cursorPointer"
            onClick={() => {
              window.open(
                getFilePath(
                  data?.data?.salarySlip[data?.data?.salarySlip.length - 1]
                    ?.filePath
                )
              );
            }}>
            <Label
              label={
                data?.data?.salarySlip[data?.data?.salarySlip.length - 1]
                  ?.docType
              }
              value={
                data?.data?.salarySlip[data?.data?.salarySlip.length - 1]
                  ?.fileName
              }
              onClick={() => {
                window.open(
                  getFilePath(
                    data?.data?.salarySlip[data?.data?.salarySlip.length - 1]
                      ?.filePath
                  )
                );
              }}
            />
          </p>
        </Col>
      </Row>
    </>
  );
}

export default BankDetails;
