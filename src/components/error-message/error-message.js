import React from "react";

import "antd/dist/antd.css";
import { Alert } from "antd";

function ErrorMessage({ error }) {
  if (error) {
    return <Alert message={error.status_message} type="error" />;
  }
  return null;
}

export default ErrorMessage;
