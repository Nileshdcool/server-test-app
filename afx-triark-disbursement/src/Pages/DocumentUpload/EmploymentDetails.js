import React from "react";
import { Row, Col, Tag } from "antd";
import Label from "../../Components/label";

function EmploymentDetails(data) {
  const [flagEdit, setFlagEdit] = React.useState(true);
  const toggleFlag = async () => {
    setFlagEdit(true);
  };
  return (
    <>
      <Row>
        {data?.data?.empProfession && (
          <Col lg={8}>
            <Label label="Profession" value={data?.data?.empProfession} />
          </Col>
        )}
        {data?.data?.empSubCategory && (
          <Col lg={8}>
            <Label label="Sub Category" value={data?.data?.empSubCategory} />
          </Col>
        )}
        <Col lg={5}>
          <Label label="Designation" value={data?.data?.designation} />
        </Col>
        <Col lg={3}>
          {" "}
          <Label label="" value={""} />
          {data?.data?.negativeProfile && (
            <Tag color="red">{"Negative Profile"}</Tag>
          )}
        </Col>

        <Col lg={8}>
          <Label label="Company Name" value={data?.data?.company} />
        </Col>
        {data?.data?.empOtherCompanyName && (
          <Col lg={8}>
            <Label
              label="Other Company Name"
              value={data?.data?.empOtherCompanyName}
            />
          </Col>
        )}

        <Col lg={8}>
          <Label label="Email" value={data?.data?.empOfficeEmail} />
        </Col>

        <Col lg={8}>
          <Label
            label="Working at current job since"
            value={`${data?.data?.jobYear} Years ${data?.data?.jobMonth} Months`}
          />
        </Col>
        <Col lg={8}>
          <Label
            label="Is the current job, your first job?"
            value={data?.data?.firstJob ? "Yes" : "No"}
          />
        </Col>
        {/* {data?.data?.firstJob} */}
        {!data?.data?.firstJob && (
          <Col lg={8}>
            <Label
              label="Total Work experience"
              value={`${data?.data?.empYear ? data?.data?.empYear : 0} Years ${
                data?.data?.empMonth ? data?.data?.empMonth : 0
              } Months`}
            />
          </Col>
        )}
      </Row>
    </>
  );
}

export default EmploymentDetails;
