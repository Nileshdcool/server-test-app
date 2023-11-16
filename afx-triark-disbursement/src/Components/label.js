import React from "react";
import { Form } from "antd";

function Label({ label, value, extras }) {
  return (
    <React.Fragment>
      <div className={"labelWrapper"}>
        <h6 className="labelName">{label}</h6>
        <p className="labelData">{value}</p>
        <span className="labelData">{extras}</span>
      </div>
    </React.Fragment>
  );
}

export default Label;
