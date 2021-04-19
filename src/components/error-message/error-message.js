import React from "react";

import "antd/dist/antd.css";
import { Alert } from "antd";

function ErrorMessage({ errorData, isError }) {
  if (!isError) {
    return null;
  }
  return <Alert message={errorData.status_message} type="error" />;
}

export default ErrorMessage;
