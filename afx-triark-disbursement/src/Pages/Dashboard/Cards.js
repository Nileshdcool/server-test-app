import { Card, Col, Statistic } from "antd";
import React from "react";
import "./index.scss";

function Cards(props) {
  const { handleTileClick, title, id, value, tileSelected } = props;
  return (
    <Col
      className="mainCards1"
      onClick={handleTileClick}
    >
      <Card
        className="dashboardCard"
        id={id === tileSelected ? "selectedTile" : ""}
      >
        <Statistic
          title={title}
          value={value}
          valueStyle={{ textAlign: "center" }}
        />
      </Card>
    </Col>
  );
}

export default Cards;
