import { Col } from "antd";
import React from "react";
import "./index.scss";

function Cards(props) {
  return (
    <Col style={{ width: "20%" }} className="mainCards">
      <div className="card-dashboard">
        <div className="card-dashboard-child"> 
        <h3>{props.title}</h3>
        <p>{props.value}</p>
        </div>
      </div>
    </Col>
  );
}

export default Cards;
