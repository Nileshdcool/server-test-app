import React from "react";
import Table from "../../../Components/Table";
import { Col, Row } from "antd";
import { saveAs } from "file-saver";
import { getDocumentsData, getFIDetails  } from "../../../Redux/Services/Fi";
import { useParams, Link } from "react-router-dom";
import { BASE } from "../../../Redux/Utils/httpInterceptor";
import _ from "lodash";

function OfficePremise() {
  const [docData, setDocData] = React.useState([]);
  const [statusData, setStatusData] = React.useState([]);

  const { id } = useParams();

  React.useEffect(() => {
    (async () => {
      const response = await getDocumentsData({
        applicantUniqueId: id,
      });
      setDocData(response);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const response = await getFIDetails({
        applicantUniqueId: id,
      });
      setStatusData(response);
    })();
  }, []);

  let arrOffice = [];
  let arrRes = [];
  const dataArr = [
    ...docData?.map((e, index) => {
      if (e.formType === "office") {
        arrOffice.push(e);
      }
    }),
    ...docData?.map((e, index) => {
      if (e.formType === "residence") {
        arrRes.push(e);
      }
    }),
  ];

  const columns = [
    {
      title: "Premises Photo",
      width: 200,
      align: "center",
      render: (record) => {
        return <span>{record.docType}</span>;
      },
    },
    {
      title: "View Photo",
      width: 200,
      align: "center",
      render: (item, record) => {
        return (
          <>
            <Link
              className="mr-2"
              onClick={(e) => {
                saveAs(record.filePath.replace("/var/www/html", BASE));
              }}>
              View
            </Link>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {_.isEmpty(arrOffice) ? (
        <p>Pending</p>
      ) : (
        <Row>
          <Col span={24}>
            {(statusData?.office?.finalStatus === "Negative" ||
            statusData?.office?.finalStatus === "Positive") && (
            <Table
              bordered
              scroll={{ y: 200, x:200 }}
              size="small"
              columns={columns}
              dataSource={arrOffice}
            />)}
          </Col>
        </Row>
      )}
    </div>
  );
}

export default OfficePremise;
