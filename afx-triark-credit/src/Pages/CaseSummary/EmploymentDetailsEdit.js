import React from "react";
import { Form, Col, Row, Button, Radio } from "antd";
import Label from "../../Components/label";
import InputText from "../../Components/Input";
import { useParams } from "react-router-dom";
import {
  saveEmployeeDetails,
  getProfessionList,
  getSubCategoryList,
  getDesignations,
  getCompanyName,
} from "../../Redux/Services/Cases";

const EmploymentDetailsEdit = (props) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [designation, setDesignation] = React?.useState(null);
  const [comapny, setCompany] = React?.useState(null);
  const [profession, setProfesiion] = React?.useState(null);
  const [subCategory, setSubCategory] = React?.useState(null);
  const [isFirstJob, setIsFirstJob] = React?.useState(true);
  const [showField, setShowField] = React?.useState(false);

  let timer;

  const onFinish = async (values) => {
    const payload = {
      ...values,
      applicantUniqueId: id,
      leadCode: props?.data?.leadCode,
      id: props?.data?.id,
      firstJob: values?.firstJob == "Yes" ? true : false,
    };
    const response = await saveEmployeeDetails(payload);
    if (response) {
      props?.getData();
      props?.toggleFlag();
    }
  };

  const handleFormChange = (changedFields, allFields) => {
    if (changedFields?.firstJob == "Yes") {
      setIsFirstJob(true);
    } else if (changedFields?.firstJob == "No") {
      setIsFirstJob(false);
    }

    if (changedFields?.empProfession) {
      (async () => {
        form.resetFields(["empSubCategory"]);
        form.resetFields(["designation"]);
        const responseDesign = await getSubCategoryList({
          profession: changedFields?.empProfession,
        });
        let finalResult = responseDesign?.data?.data.map((re) => {
          return { label: re?.subCategory, value: re?.subCategory };
        });
        setSubCategory(finalResult);
      })();
    }
    if (changedFields?.empSubCategory) {
      (async () => {
        form.resetFields(["designation"]);
        const responseDesign = await getDesignations({
          profession: allFields?.empProfession,
          subCategory: changedFields?.empSubCategory,
        });
        let finalResult = responseDesign?.data?.data.map((re) => {
          return { label: re?.designation, value: re?.designation };
        });
        setDesignation(finalResult);
      })();
    }
    if (changedFields?.company) {
      if (changedFields?.comapny !== "Other") {
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        (async () => {
          const responseDesign = await getCompanyName({
            name: changedFields?.company,
          });
          let finalResult = responseDesign?.data?.data.map((re) => {
            if (re?.companyNames?.toLowerCase() == "other") {
              setShowField(true);
            } else {
              setShowField(false);
            }
            return { label: re?.companyNames, value: re?.companyNames };
          });
          setCompany(finalResult);
        })();
      }, 1200);
    }
  };

  React.useEffect(() => {
    form &&
      form?.setFieldsValue({
        company: props?.data?.company,
        designation: props?.data?.designation,
        empConstitution: props?.data?.empConstitution,
        empIndustry: props?.data?.empIndustry,
        empOfficeEmail: props?.data?.empOfficeEmail,
        empSubCategory: props?.data?.empSubCategory,
        firstJob: props?.data?.firstJob ? "Yes" : "No",
        jobMonth: props?.data?.jobMonth,
        empMonth: props?.data?.empMonth,
        jobYear: props?.data?.jobYear,
        empYear: props?.data?.empYear,
        empProfession: props?.data?.empProfession,
        empOtherCompanyName: props?.data?.empOtherCompanyName,
        employmentType: props?.data?.employmentType,
        occuptionType: props?.data?.occuptionType,
        employmentStability: props?.data?.employmentStability,
        employerName: props?.data?.employerName,
        natureOfBusiness: props?.data?.natureOfBusiness,
      });

    if (props?.data?.firstJob) {
      setIsFirstJob(true);
    } else {
      setIsFirstJob(false);
    }

    getProfessionList().then((re) => {
      if (re) {
        let finalResult = re.map((re) => {
          return {
            label: re?.profession,
            value: re?.profession,
          };
        });
        setProfesiion(finalResult);
      }
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      const responseDesign = await getProfessionList();
      let finalResult = responseDesign?.data?.data.map((re) => {
        return { label: re?.profession, value: re?.profession };
      });
      setProfesiion(finalResult);
    })();

    if (props?.data?.empProfession) {
      (async () => {
        const responseDesign = await getSubCategoryList({
          profession: props?.data?.empProfession,
        });
        let finalResult = responseDesign?.data?.data.map((re) => {
          return { label: re?.subCategory, value: re?.subCategory };
        });
        setSubCategory(finalResult);
      })();
    }
    if (props?.data?.empProfession) {
      (async () => {
        const responseDesign = await getDesignations({
          profession: props?.data?.empProfession,
          subCategory: props?.data?.empSubCategory,
        });
        let finalResult = responseDesign?.data?.data.map((re) => {
          return { label: re?.designation, value: re?.designation };
        });
        setDesignation(finalResult);
      })();
    }
    if (props?.data?.company) {
      (async () => {
        const responseDesign = await getCompanyName({
          name: props?.data?.company,
        });
        let finalResult = responseDesign?.data?.data.map((re) => {
          if (re?.companyNames?.toLowerCase() == "other") {
            setShowField(true);
            return { label: "Other", value: "Other" };
          } else {
            setShowField(false);
            return { label: re?.companyNames, value: re?.companyNames };
          }
        });
        setCompany(finalResult);
      })();
    }
  }, []);

  return (
    <Form
      initialValues={{
        remember: true,
      }}
      name="dynamic_form_nest_item"
      onValuesChange={handleFormChange}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Row gutter={[30, 10]}>
        <Col lg={8}>
          <Form.Item
            name={"empProfession"}
            rules={[
              {
                required: true,
                message: `Profession is mandatory`,
              },
            ]}
          >
            <InputText
              key={form && form.getFieldValue("empProfession")}
              label={"Profession*"}
              type="dropdown"
              options={profession}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"empSubCategory"}
            rules={[
              {
                required: true,
                message: `Sub Category is mandatory`,
              },
            ]}
          >
            <InputText
              key={form && form.getFieldValue("empSubCategory")}
              label={"Sub Category*"}
              type="dropdown"
              options={subCategory}
            />
          </Form.Item>
        </Col>{" "}
        <Col lg={8}>
          <Form.Item
            name={"designation"}
            rules={[
              {
                required: true,
                message: `Designation is mandatory`,
              },
            ]}
          >
            <InputText
              key={form && form.getFieldValue("designation")}
              label={"Designation*"}
              type={"dropdown"}
              options={designation}
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"company"}
            rules={[
              {
                required: true,
                message: `Company Name is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Company Name*"}
              options={comapny}
              type="search"
            />
          </Form.Item>
        </Col>{" "}
        {showField && (
          <Col lg={8}>
            <Form.Item
              name={"empOtherCompanyName"}
              rules={[
                {
                  required: true,
                  message: `Other Company Name is mandatory`,
                },
              ]}
            >
              <InputText
                label={"Other Company Name*"}
              />
            </Form.Item>
          </Col>
        )}
        <Col lg={8}>
          <Form.Item
            name={"empOfficeEmail"}
            rules={[
              {
                required: true,
                message: `Email is mandatory`,
              },
              {
                type: "email",
                message: "Invalid Email",
              },
            ]}
          >
            <InputText
              label={"Email*"}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={6}>
          <Label label="Is the current Job, Your First Job ?" value={``} />
        </Col>
        <Col span={3}></Col>
        <Col span={4}>
          <Form.Item
            name={"firstJob"}
            rules={[
              {
                required: true,
                message: `Selection is mandatory`,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={8}>
          <Label label="Working at current Job since" value={``} />
        </Col>
        <Col lg={4}>
          <Form.Item
            name={"jobYear"}
            rules={[
              {
                required: true,
                message: `Job Year is mandatory`,
              },
              {
                pattern: new RegExp(/^[0-9]+$/),
                message: "Invalid Input",
              },
            ]}
          >
            <InputText
              label={"Year*"}
            />
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item
            name={"jobMonth"}
            rules={[
              {
                required: true,
                message: `Job Month is mandatory`,
              },
              {
                pattern: new RegExp(/^([0-9]|[0-1][0-2])$/),
                message: "Invalid Input",
              },
            ]}
          >
            <InputText
              label={"Month*"}
            />
          </Form.Item>
        </Col>
      </Row>
      {isFirstJob ? (
        <></>
      ) : (
        <Row gutter={30}>
          <Col span={8}>
            <Label label="Total Work experience" value={``} />
          </Col>
          <Col lg={4}>
            <Form.Item
              name={"empYear"}
              rules={[
                {
                  required: true,
                  message: ` Year is mandatory`,
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Year*"}
              />
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item
              name={"empMonth"}
              rules={[
                {
                  required: true,
                  message: ` Month is mandatory`,
                },
                {
                  pattern: new RegExp(/^([0-9]|[0-1][0-2])$/),
                  message: "Invalid Input",
                },
              ]}
            >
              <InputText
                label={"Month*"}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row gutter={30}>
        <Col lg={8}>
          <Form.Item
            name={"employmentType"}
            rules={[
              {
                required: true,
                message: `Employment Status is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Employment Status*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"occuptionType"}
            rules={[
              {
                required: true,
                message: `Occupation is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Occupation*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"employmentStability"}
            rules={[
              {
                required: true,
                message: `Employment Stability is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Employment Stability*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"employerName"}
            rules={[
              {
                required: true,
                message: `Employer Name is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Employer Name*"}
              type="text"
            />
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item
            name={"natureOfBusiness"}
            rules={[
              {
                required: true,
                message: `Business Information is mandatory`,
              },
            ]}
          >
            <InputText
              label={"Business Information*"}
              type="text"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Button htmlType="submit" className="reset-button">
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default EmploymentDetailsEdit;
