import { Card, Col, Statistic } from "antd";
import React from "react";
import "./index.scss";

function Cards(props) {
  return (
    <Col style={{ width: "20%" }} className="mainCards">
      {/* <Card className="dashboardCard">
        <Statistic
          title={props.title}
          value={props.value}
          valueStyle={{ float: "right" }}
        />
      </Card> */}
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
