// import React from "react";
import { Button, Card, Col, Input, Radio, Row, Table, Checkbox } from "antd";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import {
  getPostDisbursal,
  postDisbursal,
} from "../../Redux/Services/documentUpload";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { BASE } from "../../Redux/Utils/httpInterceptor";

function PostDisbursal(props) {
  const { id } = useParams();
  const [data, setData] = React.useState([]);

  const userFreeze = props.caseSummaryData?.modelAccess[0]?.read;
  const caseFreeze =
    props.caseSummaryData?.mainapplicant[0]?.disbursementFreeze;

  const postFreeze = props.caseSummaryData?.mainapplicant[0]?.postSalesFreeze;
  React.useEffect(() => {
    (async () => {
      const response = await getPostDisbursal({
        applicantUniqueId: id,
      });
      setData(response);
    })();
  }, []);

  const markAsViewed = (record) => {
    const newRecords = data.map((item) => {
      if (item.id === record.id) {
        item.markAsViewed = !item.markAsViewed;
      }
      return item;
    });
    setData(newRecords);
  };

  const onSubmit = () => {
    postDisbursal({ data: data, applicantUniqueId: id });
  };

  const columns = [
    {
      title: "Section",
      render: (row) => {
        return (
          <Row type="flex">
            <Col lg="24">
              {" "}
              <>{row.documentSection}</>
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Document",
      align: "center",
      fixed: "right",
      render: (row) => {
        return (
          <Row type="flex">
            <Col lg="24">
              {" "}
              <>{row.fileName}</>
            </Col>
          </Row>
        );
      },
      width: 400,
    },

    {
      title: "Action",
      key: "action",
      align: "center",
      fixed: "right",
      render: (item, record) => {
        return record.filePath ? (
          <>
            {/* <Link
              className="mr-2"
              onClick={(e) => {
                !postFreeze
                  ? saveAs(record.filePath.replace("/var/www/html", BASE))
                  : "";
              }}
            >
              View
            </Link> */}
            <a
              href={(!postFreeze) ? record.filePath.replace("/var/www/html", BASE ): ""}
              target="_blank"
              rel="noopener noreferrer">
              View
            </a>
            <Link
              onClick={(e) => {
                !postFreeze
                  ? saveAs(record.filePath.replace("/var/www/html", BASE))
                  : "";
              }}>
              Download
            </Link>
          </>
        ) : (
          <div></div>
        );
      },
    },
    {
      title: "Mark as Viewed",
      dataIndex: "4",
      key: "4",
      align: "center",
      render: (item, record) => {
        if (record.markAsViewed === null) {
          return (
            <>
              <Button
                className={"reset-button"}
                onClick={onSubmit}
                disabled={userFreeze || caseFreeze || postFreeze}
              >
                {" "}
                Save{" "}
              </Button>
            </>
          );
        }
        return record.filePath ? (
          <>
            <Checkbox
              disabled={userFreeze || caseFreeze || postFreeze}
              defaultChecked={record.markAsViewed}
              onChange={(e) => {
                markAsViewed(record);
              }}
            />
          </>
        ) : (
          <div></div>
        );
      },
    },
  ];
  return (
    <div>
      {" "}
      <Row>
        <Col span={24}>
          <Table
            bordered
            scroll={{ x: 200 }}
            size="small"
            columns={columns}
            // dataSource={data}
            pagination={false}
            dataSource={[...data, { markAsViewed: null }]}
          />
        </Col>
      </Row>
    </div>
  );
}

export default PostDisbursal;
