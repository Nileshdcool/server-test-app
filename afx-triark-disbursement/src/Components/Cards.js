import { Card, Col, Statistic } from "antd";
import React from "react";
import "./index.scss";

function Cards(props) {
  return (
    <Col style={{ width: "20%" }} className="mainCards">
      <Card className="dashboardCard" onClick={props.onClick}>{props.title}</Card>
    </Col>
  );
}

export default Cards;
