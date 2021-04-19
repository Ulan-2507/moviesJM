import React from "react";
import "antd/dist/antd.css";
import { Spin } from "antd";

function Spinner({ isLoading }) {
  if (!isLoading) {
    return null;
  }
  return (
    <div className="position-center">
      <Spin size="large" />
    </div>
  );
}

export default Spinner;
