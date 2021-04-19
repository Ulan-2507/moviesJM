import React from "react";
import "antd/dist/antd.css";
import { Spin } from "antd";

function Spinner({ isLoading }) {
  if (isLoading) {
    return (
      <div className="position-center">
        <Spin size="large" />
      </div>
    );
  }
  return null;
}

export default Spinner;
