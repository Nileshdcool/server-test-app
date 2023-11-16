import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import Label from "../../Components/label";
import { getFilePath } from "../../Redux/Utils/httpInterceptor";
import { getCreditInformation, } from "../../Redux/Services/Cases";
import { getFIReportDetails } from "../../Redux/Services/FIReport";
import { getTvrReferenceReport } from "../../Redux/Services/Tvr";
import Spin from "../../Components/Spin";
import { EditOutlined } from "@ant-design/icons";
import FinalAssessmentEdit from "./FinalAssessmentEdit";
import {getDeviationDetails} from "../../Redux/Services/deviation"

function FinalAssessment(props) {
    const [data, setData] = useState(null);
    const [tvrReference1Report, setTvrReference1Report] = useState(null);
    const [tvrReference2Report, setTvrReference2Report] = useState(null);
    const [fiReportDetails, setFiReportDetails] = useState(null);
    const [deviationDetails, setDeviationDetails] = useState(null);
    const [loader, setLoader] = useState(false);
    const [flagEdit, setFlagEdit] = React.useState(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoader(true);
        const response = await getCreditInformation({
            applicantUniqueId: props?.match?.params?.id,
        });
        const tvrReference1ReportResponse = await getTvrReferenceReport({
            applicantUniqueId: props?.match?.params?.id,
            type: "Reference1"
        });
        const tvrReference2ReportResponse = await getTvrReferenceReport({
            applicantUniqueId: props?.match?.params?.id,
            type: "Reference2"
        });
        const fiReportDetailsResponse = await getFIReportDetails({
            applicantUniqueId: props?.match?.params?.id,
        });
        const deviationDetailsResponse  = await getDeviationDetails({
            applicantUniqueId: props?.match?.params?.id,
        })
        setTvrReference1Report(tvrReference1ReportResponse)
        setTvrReference2Report(tvrReference2ReportResponse)
        setFiReportDetails(fiReportDetailsResponse)
        setDeviationDetails(deviationDetailsResponse)
        setData(response?.data?.data);
        setLoader(false);
    };

    return (
        <>
            {flagEdit ? (
                <Spin spinning={loader}>
                    <Row justify="end" align="middle">
                        {/* {!(props?.caseFreeze || props?.userFreeze) && (
                            <EditOutlined onClick={() => setFlagEdit(false)} />
                        )} */}
                    </Row>
                    <>
                        <Row>
                            <Col lg={8}>
                                <Label label="LTV" value={data?.LTV} />
                            </Col>
                            <Col lg={8}>
                                <Label label="Risk Cat" value={data?.riskSegmentColor} />
                            </Col>
                            <Col lg={8}>
                                <Label label="Credit Bureau" value={data?.creditBureau} />
                            </Col>
                            <Col lg={8}>
                                <Label label="Pan Validation" value={data?.panValidation} />
                            </Col>
                            <Col lg={8}>
                                <Label label="Bank Account Validation - Penny Drop + Perfios" value={data?.bankAccountValidation} />
                            </Col>
                            <Col lg={8}>
                                <Label label="TVR of applicant" value={tvrReference1Report?.applicantUniqueId}/>
                            </Col>
                            <Col lg={8}>
                                <Label label="TVR of reference 1" value={tvrReference1Report?.status} />
                            </Col>
                            <Col lg={8}>
                                <Label label="TVR of reference 2" value={tvrReference2Report?.status} />
                            </Col>
                            <Col lg={8}>
                                <Label label="CPV Outcome" value={fiReportDetails?.status} />
                            </Col>
                            <Col lg={8}>
                                <Label label="Deviations" value={deviationDetails?.breFinalResult} />
                            </Col>
                            <Col lg={8}>
                                <Label label="Final score " value={data?.finalScore} />
                            </Col>
                        </Row>
                    </>
                </Spin>
            ) : (
                <FinalAssessmentEdit
                    data={data}
                    setFlagEdit={setFlagEdit}
                    getData={getData}
                    qdeData={props?.qdeData}
                    appId={props?.id}
                />
            )}
        </>
    );
}

export default FinalAssessment;
