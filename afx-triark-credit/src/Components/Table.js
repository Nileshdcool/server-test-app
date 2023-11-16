import { Table } from "antd";
import React from "react";
import "./index.scss";

function Tables(props) {
  return (
    <div className={"tableWrapper"}>
      <Table {...props} />
    </div>
  );
}

export default Tables;
